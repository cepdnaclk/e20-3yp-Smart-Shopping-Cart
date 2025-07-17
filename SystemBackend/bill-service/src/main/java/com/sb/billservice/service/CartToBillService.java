package com.sb.billservice.service;

import com.sb.billservice.grpc.BillRequest;
import com.sb.billservice.grpc.BillResponse;
import com.sb.billservice.grpc.BillUpdateServiceGrpc;
import com.sb.billservice.model.Bill;
import com.sb.billservice.model.BillStatus;
import com.sb.billservice.model.PaymentMethod;
import com.sb.billservice.repository.BillRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CartToBillService extends BillUpdateServiceGrpc.BillUpdateServiceImplBase {

    private final BillRepository billRepository;
    private static final Logger logger = LoggerFactory.getLogger(CartToBillService.class);

    public CartToBillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @Override
    @Transactional
    public void updateBill(BillRequest request, StreamObserver<BillResponse> responseObserver) {

        String username = request.getUsername();
        double changeInTotal = request.getTotalPrice();
        double changeInWeight = request.getTotalWeight();
        Long cartId = null;

        try {
            cartId = Long.parseLong(request.getCartId());
        } catch (NumberFormatException e) {
            logger.error("Invalid cartId format: {}", request.getCartId());
            responseObserver.onError(Status.INVALID_ARGUMENT.withDescription("Invalid cartId").asRuntimeException());
            return;
        }

        logger.info("🧾 Received gRPC update for username: {}, cartId: {}, change: {}", username, cartId, changeInTotal);

        try {
            Optional<Bill> optionalBill = billRepository.findByUsernameAndStatus(username, BillStatus.IN_PROGRESS);

            if (optionalBill.isPresent()) {
                Bill bill = optionalBill.get();
                double newTotal = bill.getTotalPrice() + changeInTotal;
                double newWeight = bill.getTotalWeight() + changeInWeight;

                if (newTotal <= 0) {
                    billRepository.delete(bill);
                    logger.info("💸 Bill total reduced to 0. Deleted bill for user: {}", username);
                    BillResponse response = BillResponse.newBuilder()
                            .setStatus("Deleted bill as total became zero for user: " + username)
                            .build();
                    responseObserver.onNext(response);
                    responseObserver.onCompleted();
                    return;
                }


                bill.setTotalPrice(newTotal);
                bill.setDate(LocalDateTime.now());
                bill.setTotalWeight(newWeight);
                billRepository.save(bill);
                logger.info("✅ Updated bill total to {} for user {}", newTotal, username);
            } else {
                Bill bill = new Bill();
                bill.setUsername(username);
                bill.setCartId(cartId);
                bill.setTotalPrice(changeInTotal);
                bill.setTotalWeight(changeInWeight);
                bill.setDate(LocalDateTime.now());
                bill.setApprovedBy(null); // To be updated during payment phase
                bill.setStatus(BillStatus.IN_PROGRESS);
                bill.setPaymentMethod(PaymentMethod.PENDING);

                billRepository.save(bill);
                logger.info("🆕 Created new bill for user {}", username);
            }

           BillResponse response = BillResponse.newBuilder()
                    .setStatus("Bill processed successfully for user: " + username)
                    .build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            logger.error("❌ Failed to update or create bill: {}", e.getMessage(), e);
            responseObserver.onError(Status.INTERNAL.withDescription("Server error").asRuntimeException());
        }
    }

}
