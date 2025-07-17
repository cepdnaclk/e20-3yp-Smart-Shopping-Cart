package com.sb.backupservice.service;

import com.sb.backupservice.grpc.DeleteUserRequest;
import com.sb.backupservice.grpc.UserBackupServiceGrpc;
import com.sb.backupservice.grpc.UserRequest;
import com.sb.backupservice.grpc.UserResponse;
import com.sb.backupservice.model.Role;
import com.sb.backupservice.model.UserBackup;
import com.sb.backupservice.repository.UserBackupRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@GrpcService
public class UserBackupService extends UserBackupServiceGrpc.UserBackupServiceImplBase {

    private final UserBackupRepository userBackupRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserBackupService.class.getName());

    public UserBackupService(UserBackupRepository userBackupRepository) {
        this.userBackupRepository = userBackupRepository;
    }

    @Override
    @Transactional
    public void saveUser(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        logger.info("Received gRPC request to backup user: {}", request.getUsername());

        try {
            UserBackup backup = new UserBackup();
            backup.setId(UUID.fromString(request.getId()));
            backup.setFirstName(request.getFirstName());
            backup.setLastName(request.getLastName());
            backup.setUsername(request.getUsername());
            backup.setPassword(request.getPassword());
            backup.setEmail(request.getEmail());
            backup.setPhoneNumber(request.getPhoneNumber());
            backup.setNic(request.getNic());
            backup.setRole(Role.valueOf(request.getRole().name()));
            backup.setRegisteredBy(request.getRegisteredBy());
            backup.setRegistrationDate(LocalDate.parse(request.getRegistrationDate()));

            userBackupRepository.save(backup);
            logger.info("Successfully saved backup for user: {}", backup.getUsername());

            UserResponse response = UserResponse.newBuilder()
                    .setStatus("Backup saved for user: " + backup.getUsername())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (IllegalArgumentException | DateTimeParseException e) {
            logger.error("Invalid input in gRPC request: {}", e.getMessage(), e);
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid input: " + e.getMessage())
                    .asRuntimeException());
        } catch (DataIntegrityViolationException e) {
            logger.error("Database error while saving user: {}", e.getMessage(), e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Database error: " + e.getMessage())
                    .asRuntimeException());
        } catch (Exception e) {
            logger.error("Unexpected error while saving user: {}", e.getMessage(), e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Unexpected error: " + e.getMessage())
                    .asRuntimeException());
        } finally {
            logger.info("Finished processing gRPC request to backup user: {}", request.getUsername());
        }
    }

    @Override
    @Transactional
    public void deleteUser(DeleteUserRequest request, StreamObserver<UserResponse> responseObserver) {

        logger.info("Received gRPC request to delete user: {}", request.getUsername());

        try {
            boolean exists = userBackupRepository.existsByUsername(request.getUsername());

            if (!exists) {
                logger.warn("User not found: {}", request.getUsername());
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("User not found: " + request.getUsername())
                        .asRuntimeException());
                return;
            }

            userBackupRepository.deleteByUsername(request.getUsername());
            logger.info("Successfully deleted backup for user: {}", request.getUsername());

            UserResponse response = UserResponse.newBuilder()
                    .setStatus("Backup deleted for user: " + request.getUsername())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            logger.error("Error while deleting user backup: {}", e.getMessage(), e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Error while deleting user backup: " + e.getMessage())
                    .asRuntimeException());
        } finally {
            logger.info("Finished processing gRPC request to delete user: {}", request.getUsername());
        }

    }

}
