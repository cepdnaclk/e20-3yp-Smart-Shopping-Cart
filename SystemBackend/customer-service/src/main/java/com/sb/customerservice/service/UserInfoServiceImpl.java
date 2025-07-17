package com.sb.customerservice.service;

import com.sb.customerservice.grpc.GetUsernameRequest;
import com.sb.customerservice.grpc.GetUsernameResponse;
import com.sb.customerservice.grpc.UserInfoServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@GrpcService
public class UserInfoServiceImpl extends UserInfoServiceGrpc.UserInfoServiceImplBase {

    private final JWTService jwtService;

    private static final Logger logger = LoggerFactory.getLogger(UserInfoServiceImpl.class);

    public UserInfoServiceImpl(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void getUsername(GetUsernameRequest request, StreamObserver<GetUsernameResponse> responseObserver) {
        String jwt = request.getJwt();
        logger.info("🔑 Received getUsername gRPC request with JWT: {}", jwt);

        String username;
        try {
            username = jwtService.extractUserName(jwt);
            logger.info("✅ Extracted username '{}' from JWT", username);
        } catch (Exception e) {
            logger.error("❌ Failed to extract username from JWT: {}", jwt, e);
            responseObserver.onError(
                    io.grpc.Status.INVALID_ARGUMENT
                            .withDescription("Invalid JWT token")
                            .withCause(e)
                            .asRuntimeException()
            );
            return;
        }

        GetUsernameResponse response = GetUsernameResponse.newBuilder()
                .setUsername(username)
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();

        logger.info("📤 Responded with username: {}", username);
    }

}
