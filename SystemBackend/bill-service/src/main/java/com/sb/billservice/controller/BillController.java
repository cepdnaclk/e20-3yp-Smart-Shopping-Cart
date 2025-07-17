package com.sb.billservice.controller;

import com.sb.billservice.dto.PayBillDTO;
import com.sb.billservice.dto.ViewBillDTO;
import com.sb.billservice.service.BillService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bill")
public class BillController {

    private static final Logger logger = LoggerFactory.getLogger(BillController.class);
    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // GET /bill/customer/view
    @GetMapping("/customer/view")
    public ResponseEntity<?> viewCurrentBill() {
        logger.info("📋 API call to view bill");
        try {
            ViewBillDTO bill = billService.getBill();
            return ResponseEntity.ok(bill);
        } catch (Exception e) {
            logger.error("❌ Error retrieving bill: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to retrieve current bill: " + e.getMessage());
        }
    }

    // POST /bill/auth/pay
    @PostMapping("/auth/pay")
    public ResponseEntity<?> payBill(@Valid @RequestBody PayBillDTO payBillDTO) {
        logger.info("💰 API call to pay bill ID: {}", payBillDTO.getBillId());
        try {
            String response = billService.payBill(payBillDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Error processing payment: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to process payment: " + e.getMessage());
        }
    }

    // GET /bill/auth/view/{userId}
    @GetMapping("/auth/view/{userId}")
    public ResponseEntity<?> getBillForCashier(@PathVariable String userId) {
        logger.info("📋 API call to view bill for user {}", userId);
        try {
            ViewBillDTO dto = billService.cashierGetBill(userId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("❌ Error retrieving bill for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to retrieve bill for user: " + e.getMessage());
        }
    }

}
