package com.sb.billservice.service;

import com.sb.backupservice.grpc.*;
import com.sb.billservice.dto.PayBillDTO;
import com.sb.billservice.dto.ViewBillDTO;
import com.sb.billservice.model.Bill;
import com.sb.billservice.model.BillStatus;
import com.sb.billservice.repository.BillRepository;
import com.sb.customerservice.grpc.GetUsernameRequest;
import com.sb.customerservice.grpc.GetUsernameResponse;
import com.sb.customerservice.grpc.UserInfoServiceGrpc;
import jakarta.servlet.http.HttpServletRequest;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BillServiceImpl implements BillService {

    private static final Logger logger = LoggerFactory.getLogger(BillServiceImpl.class);

    private final BillRepository billRepository;

    private final HttpServletRequest request;

    public BillServiceImpl(BillRepository billRepository, HttpServletRequest request) {
        this.billRepository = billRepository;
        this.request = request;
    }

    @GrpcClient("bill-backup-service")
    private BillBackupServiceGrpc.BillBackupServiceBlockingStub billBackupService;

    @GrpcClient("customer-service")
    private UserInfoServiceGrpc.UserInfoServiceBlockingStub userInfoStub;

    /** Helper to extract username from JWT in Authorization header. */
    private String extractUsernameFromRequest() {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.error("❌ Missing or invalid Authorization header");
            throw new SecurityException("Missing or invalid Authorization header");
        }
        String jwt = authHeader.substring(7);
        try {
            GetUsernameRequest grpcRequest = GetUsernameRequest.newBuilder().setJwt(jwt).build();
            GetUsernameResponse grpcResponse = userInfoStub.getUsername(grpcRequest);
            String username = grpcResponse.getUsername();
            if (username.isEmpty()) {
                logger.error("❌ Username extraction failed via gRPC for JWT: {}", jwt);
                throw new SecurityException("Unable to extract username from JWT");
            }
            return username;
        } catch (Exception e) {
            logger.error("❌ gRPC call failed while extracting username: {}", e.getMessage(), e);
            throw new SecurityException("Error extracting username from JWT via gRPC", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ViewBillDTO getBill() {

        String username = extractUsernameFromRequest();

        logger.info("🔍 Fetching IN_PROGRESS bill for user: {}", username);

        // Find bill with status IN_PROGRESS for the user
        return billRepository.findByUsernameAndStatus(username, BillStatus.IN_PROGRESS)
                .map(bill -> {
                    ViewBillDTO dto = new ViewBillDTO();
                    dto.setUsername(bill.getUsername());
                    dto.setBillId(bill.getId());
                    dto.setTotalAmount(String.format("%.2f", bill.getTotalPrice()));
                    dto.setTotalWeight(String.format("%.3f", bill.getTotalWeight()));
                    dto.setBillStatus(bill.getStatus());
                    logger.info("✅ Found bill for user: {}", username);
                    return dto;
                })
                .orElseThrow(() -> {
                    logger.warn("❌ No IN_PROGRESS bill found for user: {}", username);
                    return new IllegalArgumentException("No IN_PROGRESS bill found for user: " + username);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public ViewBillDTO cashierGetBill(String userId) {

        logger.info("🧾 Cashier requested IN_PROGRESS bill for user: {}", userId);

        return billRepository.findByUsernameAndStatus(userId, BillStatus.IN_PROGRESS)
                .map(bill -> {
                    ViewBillDTO dto = new ViewBillDTO();
                    dto.setUsername(bill.getUsername());
                    dto.setBillId(bill.getId());
                    dto.setTotalAmount(String.format("%.2f", bill.getTotalPrice()));
                    dto.setTotalWeight(String.format("%.3f", bill.getTotalWeight()));
                    dto.setBillStatus(bill.getStatus());
                    logger.info("✅ Bill found for cashier view: {}", userId);
                    return dto;
                })
                .orElseThrow(() -> {
                    logger.warn("❌ No IN_PROGRESS bill found for user (cashier): {}", userId);
                    return new IllegalArgumentException("No IN_PROGRESS bill found for user: " + userId);
                });
    }


    @Override
    @Transactional
    public String payBill(PayBillDTO payBillDTO) {

        String approvedBy = "authorized-user"; // 🔐 Replace with JWT username later
        Long billId = payBillDTO.getBillId();
        String username = payBillDTO.getUsername();

        logger.info("💳 Attempting to pay bill ID {} for user {}", billId, username);

        Bill bill = billRepository.findById(billId)
                .filter(b -> b.getUsername().equals(username))
                .orElseThrow(() -> {
                    logger.warn("❌ Bill not found for ID {} and user {}", billId, username);
                    return new IllegalArgumentException("Bill not found for the specified user and ID.");
                });

        if (bill.getStatus() == BillStatus.PAID) {
            logger.warn("❌ Bill ID {} is already marked as PAID", billId);
            throw new IllegalStateException("Bill is already paid.");
        }

        // ✅ Update payment details
        bill.setStatus(BillStatus.PAID);
        bill.setPaymentMethod(payBillDTO.getPaymentMethod());
        bill.setApprovedBy(approvedBy);
        bill.setDate(LocalDateTime.now());

        billRepository.save(bill);
        logger.info("✅ Bill ID {} marked as PAID by {}", billId, approvedBy);

        // 📦 Prepare gRPC backup request
        BillRequest grpcRequest = BillRequest.newBuilder()
                .setId(bill.getId())
                .setCartId(bill.getCartId())
                .setUsername(bill.getUsername())
                .setTotalPrice(bill.getTotalPrice())
                .setDate(bill.getDate().toString())
                .setApprovedBy(bill.getApprovedBy() != null ? bill.getApprovedBy() : "")
                .setStatus(BILL_STATUS.valueOf(bill.getStatus().name()))
                .setPaymentMethod(PAYMENT_METHOD.valueOf(bill.getPaymentMethod().name()))
                .build();

        try {
            BillResponse grpcResponse = billBackupService.saveBill(grpcRequest);
            logger.info("📡 Backup updated successfully via gRPC: {}", grpcResponse.getStatus());
        } catch (Exception e) {
            logger.error("❌ Failed to update bill in backup database via gRPC", e);
            throw new RuntimeException("Backup update failed: " + e.getMessage(), e);
        }


        return "✅ Bill paid successfully for bill ID: " + billId;
    }
}
