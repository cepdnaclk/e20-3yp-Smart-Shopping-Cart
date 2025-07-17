//package com.sb.productservice.service;
//
//import com.sb.productservice.grpc.ProductLookupRequest;
//import com.sb.productservice.grpc.ProductServiceGrpc;
//import com.sb.productservice.grpc.ProductShelfRowResponse;
//import com.sb.productservice.model.Products;
//import com.sb.productservice.repository.ProductRepository;
//import io.grpc.stub.StreamObserver;
//import net.devh.boot.grpc.server.service.GrpcService;
//
//@GrpcService
//public class ProductLookUpGrpc extends ProductServiceGrpc.ProductServiceImplBase {
//
//    private final ProductRepository productRepository;
//
//    public ProductLookUpGrpc(ProductRepository productRepository) {
//        this.productRepository = productRepository;
//    }
//
//    @Override
//    public void getProductShelfRow(ProductLookupRequest request, StreamObserver<ProductShelfRowResponse> responseObserver) {
//        // Lookup by item name
//        Products product = productRepository.findByProductName(request.getItemName())
//                .orElse(null);
//
//        ProductShelfRowResponse.Builder response = ProductShelfRowResponse.newBuilder();
//
//        if (product != null) {
//            response.setExists(true)
//                    .setShelfNumber(product.getProductShelfNumber())
//                    .setRowNumber(product.getProductRowNumber())
//                    .setMessage("Product found");
//        } else {
//            response.setExists(false)
//                    .setShelfNumber(0)
//                    .setRowNumber(0)
//                    .setMessage("Product not found");
//        }
//
//        responseObserver.onNext(response.build());
//        responseObserver.onCompleted();
//    }
//}
