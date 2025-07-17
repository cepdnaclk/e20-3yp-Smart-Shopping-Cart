package com.sb.customerbackupservice.service;

import com.sb.customerbackupservice.grpc.CustomerBackupServiceGrpc;
import com.sb.customerbackupservice.grpc.CustomerRequest;
import com.sb.customerbackupservice.grpc.CustomerResponse;
import com.sb.customerbackupservice.grpc.DeleteCustomerRequest;
import com.sb.customerbackupservice.model.CustomerBackup;
import com.sb.customerbackupservice.repository.CustomerBackupRepository;
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
public class CustomerBackupService extends CustomerBackupServiceGrpc.CustomerBackupServiceImplBase {

    private final CustomerBackupRepository customerBackupRepository;
    private static final Logger logger = LoggerFactory.getLogger(CustomerBackupService.class);

    public CustomerBackupService(CustomerBackupRepository customerBackupRepository) {
        this.customerBackupRepository = customerBackupRepository;
    }

    @Override
    @Transactional
    public void saveCustomer(CustomerRequest request, StreamObserver<CustomerResponse> responseObserver) {
        logger.info("Received gRPC request to backup customer: {}", request.getUsername());

        try {
            CustomerBackup backup = new CustomerBackup();
            backup.setId(UUID.fromString(request.getId()));
            backup.setFirstName(request.getFirstName());
            backup.setLastName(request.getLastName());
            backup.setUsername(request.getUsername());
            backup.setPassword(request.getPassword());
            backup.setEmail(request.getEmail());
            backup.setPhoneNumber(request.getPhoneNumber());
            backup.setNic(request.getNic());
            backup.setAddress(request.getAddress());
            backup.setRegistrationDate(LocalDate.parse(request.getRegistrationDate()));

            customerBackupRepository.save(backup);
            logger.info("Successfully saved backup for user: {}", backup.getUsername());

            CustomerResponse response = CustomerResponse.newBuilder()
                    .setStatus("Backup saved for user: " + backup.getUsername())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (IllegalArgumentException | DateTimeParseException e) {
            logger.error("Invalid input in gRPC request: {}", e.getMessage(), e);
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription(e.getMessage())
                    .augmentDescription("Invalid UUID or Date format")
                    .withCause(e)
                    .asRuntimeException());
        } catch (DataIntegrityViolationException e) {
            logger.error("Database error during backup: {}", e.getMessage(), e);
            responseObserver.onError(Status.ALREADY_EXISTS
                    .withDescription("Duplicate entry: username/email/nic already exists")
                    .withCause(e)
                    .asRuntimeException());
        } catch (Exception e) {
            logger.error("Unexpected server error: {}", e.getMessage(), e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Unexpected error occurred while saving backup")
                    .withCause(e)
                    .asRuntimeException());
        }
    }


    @Override
    @Transactional
    public void deleteCustomer(DeleteCustomerRequest request, StreamObserver<CustomerResponse> responseObserver) {
        String username = request.getUsername();
        logger.info("Received gRPC request to delete backup for username: {}", username);

        try {
            boolean exists = customerBackupRepository.existsByUsername(username);

            if (!exists) {
                logger.warn("No backup found for username: {}", username);
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("No backup found for username: " + username)
                        .asRuntimeException());
                return;
            }

            customerBackupRepository.deleteByUsername(username);
            logger.info("Deleted backup for username: {}", username);

            CustomerResponse response = CustomerResponse.newBuilder()
                    .setStatus("Backup deleted for user: " + username)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            logger.error("Failed to delete backup for username: {}", username, e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Server error while deleting backup")
                    .withCause(e)
                    .asRuntimeException());
        }
    }

}
