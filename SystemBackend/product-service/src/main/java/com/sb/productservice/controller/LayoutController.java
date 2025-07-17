package com.sb.productservice.controller;

import com.sb.productservice.dto.DeleteLayoutRequestDTO;
import com.sb.productservice.dto.UpdateLayoutDTO;
import com.sb.productservice.model.LayoutEntity;
import com.sb.productservice.service.LayoutService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/layout/auth")
public class LayoutController {

    private static final Logger logger = LoggerFactory.getLogger(LayoutController.class);
    private final LayoutService layoutService;

    public LayoutController(LayoutService layoutService) {
        this.layoutService = layoutService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveLayout(@RequestBody LayoutEntity layout) {
        try {
            layoutService.saveLayout(layout);
            return ResponseEntity.ok("✅ Layout saved successfully");
        } catch (Exception e) {
            logger.error("❌ Error saving layout: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to save layout");
        }
    }

    @GetMapping("/get/{layoutId}")
    public ResponseEntity<?> getLayoutById(@PathVariable String layoutId) {
        try {
            LayoutEntity layout = layoutService.getLayoutById(layoutId);
            if (layout != null) {
                return ResponseEntity.ok(layout);
            } else {
                return ResponseEntity.status(404).body("Layout not found for ID: " + layoutId);
            }
        } catch (Exception e) {
            logger.error("❌ Error retrieving layout: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to retrieve layout");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllLayouts() {
        try {
            List<LayoutEntity> layouts = layoutService.getAllLayouts();
            return ResponseEntity.ok(layouts);
        } catch (Exception e) {
            logger.error("❌ Error fetching all layouts: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to fetch layouts");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateLayout(@RequestBody UpdateLayoutDTO dto) {
        try {
            layoutService.updateLayout(dto);
            return ResponseEntity.ok("✅ Layout updated successfully");
        } catch (IllegalArgumentException e) {
            logger.warn("⚠️ Layout not found: {}", e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            logger.error("❌ Error updating layout: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to update layout");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteLayout(@RequestBody DeleteLayoutRequestDTO dto) {
        try {
            layoutService.deleteLayoutById(dto.getLayoutId());
            return ResponseEntity.ok("🗑️ Layout deleted successfully");
        } catch (Exception e) {
            logger.error("❌ Error deleting layout: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to delete layout");
        }
    }
}
