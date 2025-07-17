package com.sb.backupservice.service;

import com.sb.backupservice.grpc.BillBackupServiceGrpc;
import com.sb.backupservice.grpc.BillRequest;
import com.sb.backupservice.grpc.BillResponse;
import com.sb.backupservice.grpc.DeleteBillRequest;
import com.sb.backupservice.model.BillBackup;
import com.sb.backupservice.model.BillStatus;
import com.sb.backupservice.model.PaymentMethod;
import com.sb.backupservice.repository.BillBackupRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@GrpcService
public class BillBackupService extends BillBackupServiceGrpc.BillBackupServiceImplBase {

    private final BillBackupRepository billBackupRepository;

    private static final Logger logger = LoggerFactory.getLogger(BillBackupService.class);

    public BillBackupService(BillBackupRepository billBackupRepository) {
        this.billBackupRepository = billBackupRepository;
    }

    @Override
    @Transactional
    public void saveBill(BillRequest request, StreamObserver<BillResponse> responseObserver) {

        logger.info("📦 Received gRPC request to backup bill: {}", request.getId());

        try {
            // Map gRPC request to entity
            BillBackup backup = new BillBackup();
            backup.setId(request.getId());
            backup.setCartId(request.getCartId());
            backup.setUsername(request.getUsername());
            backup.setTotalPrice(request.getTotalPrice());
            backup.setDate(LocalDateTime.parse(request.getDate()));
            backup.setApprovedBy(request.getApprovedBy());
            backup.setStatus(BillStatus.valueOf(request.getStatus().name()));
            backup.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().name()));

            // Save to DB
            billBackupRepository.save(backup);
            logger.info("✅ Successfully saved bill backup: {}", backup.getId());

            BillResponse response = BillResponse.newBuilder()
                    .setStatus("✅ Backup saved for bill: " + backup.getId())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            logger.error("❌ Error saving bill backup: {}", e.getMessage());
            responseObserver.onError(Status.INVALID_ARGUMENT.withDescription(e.getMessage()).asRuntimeException());
        } catch (DataIntegrityViolationException e) {
            logger.error("❌ Data integrity violation: {}", e.getMessage());
            responseObserver.onError(Status.ALREADY_EXISTS.withDescription(e.getMessage()).asRuntimeException());
        } catch (Exception e) {
            logger.error("❌ Unexpected error: {}", e.getMessage());
            responseObserver.onError(Status.INTERNAL.withDescription(e.getMessage()).asRuntimeException());
        } finally {
            logger.info("📦 Finished processing gRPC request to backup bill: {}", request.getId());
        }
    }

    @Override
    @Transactional
    public void deleteBill(DeleteBillRequest request, StreamObserver<BillResponse> responseObserver) {
        logger.info("📦 Received gRPC request to delete bill: {}", request.getId());

        try {
            // Delete from DB
            billBackupRepository.deleteById(request.getId());
            logger.info("✅ Successfully deleted bill backup: {}", request.getId());

            BillResponse response = BillResponse.newBuilder()
                    .setStatus("✅ Deleted bill backup: " + request.getId())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();


        } catch (DataIntegrityViolationException e) {
            logger.error("❌ Data integrity violation: {}", e.getMessage());
            responseObserver.onError(Status.ALREADY_EXISTS.withDescription(e.getMessage()).asRuntimeException());
        } catch (Exception e) {
            logger.error("❌ Unexpected error: {}", e.getMessage());
            responseObserver.onError(Status.INTERNAL.withDescription(e.getMessage()).asRuntimeException());
        } finally {
            logger.info("📦 Finished processing gRPC request to delete bill: {}", request.getId());
        }
    }

}
