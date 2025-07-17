package com.sb.productservice.service;

import com.sb.backupservice.grpc.ProductBackupServiceGrpc;
import com.sb.backupservice.grpc.ProductRequest;
import com.sb.backupservice.grpc.ProductResponse;
import com.sb.productservice.dto.AddProductDTO;
import com.sb.productservice.dto.GetProductDTO;
import com.sb.productservice.dto.UpdateProductDTO;
import com.sb.productservice.model.Products;
import com.sb.productservice.repository.ProductRepository;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    private final ProductRepository productRepository;
//    private final BarcodeListenerService barcodeListenerService;

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    @Value("${aws.s3.bucket.region}")
    private String region;

    private final S3Service s3Service;

    @GrpcClient("product-backup-service")
    private ProductBackupServiceGrpc.ProductBackupServiceBlockingStub productBackupStub;


    public ProductServiceImpl(ProductRepository productRepository, S3Service s3Service) {
        this.productRepository = productRepository;
        this.s3Service = s3Service;
    }

    @Override
    @Transactional
    public String addProduct(AddProductDTO dto) {

        String barcode = dto.getBarcode();

        // Construct product entity
        Products product = new Products();
        product.setBarcode(barcode);
        product.setProductName(dto.getProductName());
        product.setProductDescription(dto.getProductDescription());
        product.setProductPrice(dto.getProductPrice());
        product.setProductQuantity(dto.getProductQuantity());
        product.setProductCategory(dto.getProductCategory());
        product.setProductBrand(dto.getProductBrand());
        product.setProductWeight(dto.getProductWeight());
        product.setAddedDate(LocalDateTime.now());


        logger.debug("🛠 Constructed product entity: {}", product);

        // Upload image to S3
        String s3Key = null;
        if (dto.getProductImage() != null && !dto.getProductImage().isEmpty()) {
            try {
                String folder = "images/" + dto.getProductCategory() + "/" + dto.getProductBrand();
                String filename = barcode + ".jpg"; // You may dynamically get extension if needed
                s3Key = s3Service.uploadImage(folder, filename, dto.getProductImage());

                logger.info("📤 Image uploaded to S3 at: {}", s3Key);
                product.setProductImage(s3Key); // Save key/path in DB
            } catch (Exception e) {
                logger.error("❌ Failed to upload image to S3", e);
                throw new RuntimeException("Image upload failed, rolling back DB insert", e);
            }
        }

        // Save to database
        productRepository.save(product);
        logger.info("✅ Product saved to database with barcode: {}", barcode);

        // Build gRPC backup request
        ProductRequest backupRequest = ProductRequest.newBuilder()
                .setId(product.getId().toString())
                .setBarcode(barcode)
                .setProductName(dto.getProductName())
                .setProductDescription(dto.getProductDescription())
                .setProductPrice(dto.getProductPrice())
                .setProductQuantity(dto.getProductQuantity())
                .setProductCategory(dto.getProductCategory())
                .setProductBrand(dto.getProductBrand())
                .setProductWeight(dto.getProductWeight())
                .setAddedDate(product.getAddedDate().toString()) // Use the same added date as DB
                .setProductImageUrl(s3Key != null ? s3Key : "")
                .build();

        try {
            // Backup via gRPC
            ProductResponse grpcResponse = productBackupStub.addProduct(backupRequest);
            logger.info("📡 gRPC AddProduct response: {}", grpcResponse.getStatus());
        } catch (Exception e) {
            logger.error("gRPC call failed: {}", e.getMessage(), e);
            // Throw RuntimeException to trigger rollback of the DB insert
            throw new RuntimeException("Product backup (gRPC) failed, rolling back DB save", e);
        }

        // Clear used barcode
        //barcodeListenerService.clearLatestBarcode();
        //logger.info("🧹 Cleared cached barcode after save");

        return "✅ Product saved successfully with barcode: " + barcode;
    }


    @Override
    @Transactional
    public String updateProduct(UpdateProductDTO dto) {
        logger.info("🔄 Starting update for product with barcode: {}", dto.getBarcode());

        // Fetch product by barcode
        Products existingProduct = productRepository
                .findAll()
                .stream()
                .filter(p -> p.getBarcode().equals(dto.getBarcode()))
                .findFirst()
                .orElse(null);

        if (existingProduct == null) {
            logger.warn("❌ No product found with barcode: {}", dto.getBarcode());
            throw new IllegalArgumentException("Product with the given barcode not found.");
        }

        // Update fields
        existingProduct.setProductName(dto.getProductName());
        existingProduct.setProductDescription(dto.getProductDescription());
        existingProduct.setProductPrice(dto.getProductPrice());
        existingProduct.setProductQuantity(dto.getProductQuantity());
        existingProduct.setProductCategory(dto.getProductCategory());
        existingProduct.setProductBrand(dto.getProductBrand());
        existingProduct.setProductWeight(dto.getProductWeight());


        // Handle image overwrite
        String s3Key = existingProduct.getProductImage(); // Default to existing key
        if (dto.getProductImage() != null && !dto.getProductImage().isEmpty()) {
            try {
                String folder = "images/" + dto.getProductCategory() + "/" + dto.getProductBrand();
                String filename = dto.getBarcode() + ".jpg";
                s3Key = s3Service.overwriteImage(folder, filename, dto.getProductImage());

                logger.info("♻️ Image overwritten in S3 at: {}", s3Key);
                existingProduct.setProductImage(s3Key); // Update DB field
            } catch (Exception e) {
                logger.error("❌ Failed to overwrite image in S3", e);
                throw new RuntimeException("Image overwrite failed, rolling back DB update", e);
            }
        }

        // Save to DB
        productRepository.save(existingProduct);
        logger.info("✅ Product updated successfully in DB for barcode: {}", dto.getBarcode());

        // gRPC Backup call
        try {
            ProductRequest grpcRequest = ProductRequest.newBuilder()
                    .setBarcode(dto.getBarcode())
                    .setProductName(dto.getProductName())
                    .setProductDescription(dto.getProductDescription())
                    .setProductPrice(dto.getProductPrice())
                    .setProductQuantity(dto.getProductQuantity())
                    .setProductCategory(dto.getProductCategory())
                    .setProductBrand(dto.getProductBrand())
                    .setProductWeight(dto.getProductWeight())
                    .setAddedDate(existingProduct.getAddedDate().toString()) // use original date
                    .setProductImageUrl(s3Key != null ? s3Key : "")
                    .build();

            ProductResponse grpcResponse = productBackupStub.updateProduct(grpcRequest);
            logger.info("📡 gRPC UpdateProduct response: {}", grpcResponse.getStatus());

        } catch (Exception e) {
            logger.error("❌ gRPC backup failed during update: {}", e.getMessage(), e);
            throw new RuntimeException("Product update failed due to backup error", e);
        }

        return "✅ Product updated successfully with barcode: " + dto.getBarcode();
    }

    @Override
    @Transactional
    public String deleteProduct(String barcode) {
        logger.info("🗑️ Attempting to delete product with barcode: {}", barcode);

        Products productToDelete = productRepository
                .findAll()
                .stream()
                .filter(p -> p.getBarcode().equals(barcode))
                .findFirst()
                .orElse(null);

        if (productToDelete == null) {
            logger.warn("❌ Product not found with barcode: {}", barcode);
            throw new IllegalArgumentException("Product with the given barcode not found.");
        }

        // Delete image from S3
        if (productToDelete.getProductImage() != null && !productToDelete.getProductImage().isBlank()) {
            try {
                String fullUrl = productToDelete.getProductImage();
                String prefix = "https://" + bucketName + ".s3." + region + ".amazonaws.com/";
                String s3Key = fullUrl.replace(prefix, ""); // Extract actual S3 key

                String[] parts = s3Key.split("/", 4); // ["images", "Category", "Brand", "filename"]
                if (parts.length == 4) {
                    String folder = parts[0] + "/" + parts[1] + "/" + parts[2];
                    String filename = parts[3];
                    s3Service.deleteImage(folder, filename);
                    logger.info("🧹 Image deleted from S3: {}", s3Key);
                } else {
                    logger.warn("⚠️ Unexpected S3 key format: {}", s3Key);
                }
            } catch (Exception e) {
                logger.error("❌ Failed to delete image from S3", e);
                throw new RuntimeException("Product image deletion failed, rolling back DB delete", e);
            }
        }

        // Delete from DB
        productRepository.delete(productToDelete);
        logger.info("✅ Product deleted from DB: {}", barcode);

        // gRPC delete request
        try {
            var deleteRequest = com.sb.backupservice.grpc.DeleteProductRequest.newBuilder()
                    .setBarcode(barcode)
                    .build();

            ProductResponse grpcResponse = productBackupStub.deleteProduct(deleteRequest);
            logger.info("📡 gRPC DeleteProduct response: {}", grpcResponse.getStatus());

        } catch (Exception e) {
            logger.error("❌ gRPC backup failed during delete: {}", e.getMessage(), e);
            throw new RuntimeException("Product deletion failed due to backup error", e);
        }

        return "✅ Product successfully deleted with barcode: " + barcode;
    }


    @Override
    @Transactional(readOnly = true)
    public GetProductDTO getProductByBarcode(String barcode) {

        Products product = productRepository.findAll()
                .stream()
                .filter(p -> p.getBarcode().equals(barcode))
                .findFirst()
                .orElseThrow(() -> {
                    logger.warn("❌ No product found with barcode: {}", barcode);
                    return new IllegalArgumentException("No product found for barcode: " + barcode);
                });

        logger.info("✅ Product found for barcode {}: {}", barcode, product.getProductName());

        GetProductDTO dto = new GetProductDTO();
        dto.setBarcode(product.getBarcode());
        dto.setProductName(product.getProductName());
        dto.setProductDescription(product.getProductDescription());
        dto.setProductPrice(product.getProductPrice());
        dto.setProductQuantity(product.getProductQuantity());
        dto.setProductCategory(product.getProductCategory());
        dto.setProductBrand(product.getProductBrand());
        dto.setProductWeight(product.getProductWeight());
        dto.setProductName(product.getProductImage());
        dto.setProductImage(product.getProductImage());

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GetProductDTO> getAllProducts() {
        logger.info("📦 Fetching all products from the database");

        List<Products> products = productRepository.findAll();

        List<GetProductDTO> dtoList = products.stream().map(product -> {
            GetProductDTO dto = new GetProductDTO();
            dto.setBarcode(product.getBarcode());
            dto.setProductName(product.getProductName());
            dto.setProductDescription(product.getProductDescription());
            dto.setProductPrice(product.getProductPrice());
            dto.setProductQuantity(product.getProductQuantity());
            dto.setProductCategory(product.getProductCategory());
            dto.setProductBrand(product.getProductBrand());
            dto.setProductWeight(product.getProductWeight());
            dto.setProductImage(product.getProductImage());
            return dto;
        }).toList();

        logger.info("✅ Found {} product(s)", dtoList.size());
        return dtoList;
    }


    @Override
    @Transactional(readOnly = true)
    public List<GetProductDTO> getProductsByCategory(String category) {
        logger.info("🔍 Fetching products for category: {}", category);

        List<Products> products = productRepository.findAll()
                .stream()
                .filter(p -> p.getProductCategory().equalsIgnoreCase(category))
                .toList();

        List<GetProductDTO> dtoList = products.stream().map(product -> {
            GetProductDTO dto = new GetProductDTO();
            dto.setBarcode(product.getBarcode());
            dto.setProductName(product.getProductName());
            dto.setProductDescription(product.getProductDescription());
            dto.setProductPrice(product.getProductPrice());
            dto.setProductQuantity(product.getProductQuantity());
            dto.setProductCategory(product.getProductCategory());
            dto.setProductBrand(product.getProductBrand());
            dto.setProductWeight(product.getProductWeight());
            dto.setProductImage(product.getProductImage());

            return dto;
        }).toList();

        logger.info("✅ Found {} product(s) in category '{}'", dtoList.size(), category);
        return dtoList;
    }


    @Override
    @Transactional(readOnly = true)
    public List<GetProductDTO> getProductsByBrand(String brand) {
        logger.info("🔍 Fetching products for brand: {}", brand);

        List<Products> products = productRepository.findAll()
                .stream()
                .filter(p -> p.getProductBrand().equalsIgnoreCase(brand))
                .toList();

        List<GetProductDTO> dtoList = products.stream().map(product -> {
            GetProductDTO dto = new GetProductDTO();
            dto.setBarcode(product.getBarcode());
            dto.setProductName(product.getProductName());
            dto.setProductDescription(product.getProductDescription());
            dto.setProductPrice(product.getProductPrice());
            dto.setProductQuantity(product.getProductQuantity());
            dto.setProductCategory(product.getProductCategory());
            dto.setProductBrand(product.getProductBrand());
            dto.setProductWeight(product.getProductWeight());
            dto.setProductImage(product.getProductImage());

            return dto;
        }).toList();

        logger.info("✅ Found {} product(s) for brand '{}'", dtoList.size(), brand);
        return dtoList;
    }

}
