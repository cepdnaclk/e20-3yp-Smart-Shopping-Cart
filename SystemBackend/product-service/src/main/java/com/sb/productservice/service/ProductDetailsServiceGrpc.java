package com.sb.productservice.service;

import com.sb.productservice.grpc.ProductDetailsRequest;
import com.sb.productservice.grpc.ProductDetailsResponse;
import com.sb.productservice.model.Products;
import com.sb.productservice.repository.ProductRepository;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.transaction.annotation.Transactional;

@GrpcService
public class ProductDetailsServiceGrpc extends com.sb.productservice.grpc.ProductDetailsServiceGrpc.ProductDetailsServiceImplBase {

    private final ProductRepository productRepository;

    public ProductDetailsServiceGrpc(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public void getProductDetails(ProductDetailsRequest request, StreamObserver<ProductDetailsResponse> responseObserver) {
        Products product = productRepository.findByBarcode(request.getBarcode())
                .orElse(null);

        ProductDetailsResponse.Builder response = ProductDetailsResponse.newBuilder();
        if (product != null) {
            response.setExists(true)
                    .setProductName(product.getProductName())
                    .setProductPrice(product.getProductPrice())
                    .setProductQuantity(product.getProductQuantity())
                    .setProductWeight(product.getProductWeight())
                    .setMessage("Product found");
        } else {
            response.setExists(false)
                    .setMessage("Product not found");
        }

        responseObserver.onNext(response.build());
        responseObserver.onCompleted();
    }

}
