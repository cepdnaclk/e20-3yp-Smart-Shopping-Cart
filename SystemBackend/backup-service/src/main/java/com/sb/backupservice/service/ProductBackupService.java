package com.sb.backupservice.service;

import com.sb.backupservice.grpc.DeleteProductRequest;
import com.sb.backupservice.grpc.ProductBackupServiceGrpc;
import com.sb.backupservice.grpc.ProductRequest;
import com.sb.backupservice.grpc.ProductResponse;
import com.sb.backupservice.model.ProductBackup;
import com.sb.backupservice.repository.ProductBackupRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@GrpcService
public class ProductBackupService extends ProductBackupServiceGrpc.ProductBackupServiceImplBase {

    private final ProductBackupRepository productBackupRepository;
    private static final Logger logger = LoggerFactory.getLogger(ProductBackupService.class);


    public ProductBackupService(ProductBackupRepository productBackupRepository) {
        this.productBackupRepository = productBackupRepository;
    }

    @Override
    @Transactional
    public void addProduct(ProductRequest request, StreamObserver<ProductResponse> responseObserver) {
        logger.info("📦 Received gRPC request to backup product: {}", request.getProductName());

        try {
            // Map gRPC request to entity
            ProductBackup backup = new ProductBackup();

            // Convert string id to UUID, if provided
            if (!request.getId().isBlank()) {
                try {
                    backup.setId(UUID.fromString(request.getId()));
                } catch (IllegalArgumentException e) {
                    logger.error("❌ Invalid UUID string: {}", request.getId());
                    responseObserver.onError(Status.INVALID_ARGUMENT
                            .withDescription("Invalid UUID for id: " + request.getId())
                            .asRuntimeException());
                    return;
                }
            }

            backup.setBarcode(request.getBarcode());
            backup.setProductName(request.getProductName());
            backup.setProductDescription(request.getProductDescription());
            backup.setProductPrice(request.getProductPrice());
            backup.setProductQuantity(request.getProductQuantity());
            backup.setProductCategory(request.getProductCategory());
            backup.setProductBrand(request.getProductBrand());
            backup.setProductWeight(request.getProductWeight());
            backup.setAddedDate(LocalDateTime.parse(request.getAddedDate())); // Assumes ISO-8601 format
            backup.setProductImage(request.getProductImageUrl());

            // Save to DB
            productBackupRepository.save(backup);
            logger.info("✅ Successfully saved product backup: {}", backup.getProductName());

            ProductResponse response = ProductResponse.newBuilder()
                    .setStatus("✅ Backup saved for product: " + backup.getProductName())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            logger.error("❌ Invalid input in gRPC request: {}", e.getMessage(), e);
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid input: " + e.getMessage())
                    .asRuntimeException());

        } catch (DataIntegrityViolationException e) {
            logger.error("❌ Database error while saving product: {}", e.getMessage(), e);
            responseObserver.onError(Status.ALREADY_EXISTS
                    .withDescription("Product with barcode already exists: " + request.getBarcode())
                    .asRuntimeException());

        } catch (Exception e) {
            logger.error("❌ Unexpected error during product backup", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Unexpected error occurred")
                    .asRuntimeException());
        } finally {
            logger.info("📦 Finished processing gRPC request to backup product: {}", request.getProductName());
        }

    }

    @Override
    @Transactional
    public void updateProduct(ProductRequest request, StreamObserver<ProductResponse> responseObserver) {
        logger.info("🔄 Received gRPC request to update product: {}", request.getProductName());

        try {
            ProductBackup existing = productBackupRepository.findAll()
                    .stream()
                    .filter(p -> p.getBarcode().equals(request.getBarcode()))
                    .findFirst()
                    .orElse(null);

            if (existing == null) {
                logger.warn("❌ Product not found with barcode: {}", request.getBarcode());
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Product not found for barcode: " + request.getBarcode())
                        .asRuntimeException());
                return;
            }

            // Update fields
            existing.setProductName(request.getProductName());
            existing.setProductDescription(request.getProductDescription());
            existing.setProductPrice(request.getProductPrice());
            existing.setProductQuantity(request.getProductQuantity());
            existing.setProductCategory(request.getProductCategory());
            existing.setProductBrand(request.getProductBrand());
            existing.setProductWeight(request.getProductWeight());
            existing.setAddedDate(LocalDateTime.parse(request.getAddedDate()));
            existing.setProductImage(request.getProductImageUrl());

            productBackupRepository.save(existing);
            logger.info("✅ Product updated successfully for barcode: {}", request.getBarcode());

            ProductResponse response = ProductResponse.newBuilder()
                    .setStatus("✅ Product updated: " + request.getProductName())
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            logger.error("❌ Failed to update product", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Failed to update product")
                    .asRuntimeException());
        } finally {
            logger.info("🔄 Finished processing gRPC request to update product: {}", request.getProductName());
        }

    }

    @Override
    @Transactional
    public void deleteProduct(DeleteProductRequest request, StreamObserver<ProductResponse> responseObserver) {
        String barcode = request.getBarcode();
        logger.info("🗑️ Received gRPC request to delete product with barcode: {}", barcode);

        try {
            ProductBackup product = productBackupRepository.findAll()
                    .stream()
                    .filter(p -> p.getBarcode().equals(barcode))
                    .findFirst()
                    .orElse(null);

            if (product == null) {
                logger.warn("❌ Product not found for deletion with barcode: {}", barcode);
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Product not found for barcode: " + barcode)
                        .asRuntimeException());
                return;
            }

            productBackupRepository.delete(product);
            logger.info("✅ Product deleted for barcode: {}", barcode);

            ProductResponse response = ProductResponse.newBuilder()
                    .setStatus("✅ Product deleted: " + barcode)
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            logger.error("❌ Failed to delete product", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Failed to delete product")
                    .asRuntimeException());
        } finally {
            logger.info("🗑️ Finished processing gRPC request to delete product with barcode: {}", barcode);
        }

    }


}
