package com.sb.productservice.service;

import com.sb.productservice.dto.UpdateLayoutDTO;
import com.sb.productservice.model.LayoutEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class LayoutServiceImpl implements LayoutService{

    private final DynamoDbTable<LayoutEntity> layoutTable;

    private static final Logger logger = LoggerFactory.getLogger(LayoutServiceImpl.class);

    public LayoutServiceImpl(DynamoDbEnhancedClient enhancedClient) {
        this.layoutTable = enhancedClient.table("Layouts", TableSchema.fromBean(LayoutEntity.class));
    }

    @Override
    @Transactional
    public void saveLayout(LayoutEntity layout) {
        try {
            if (layout.getLayoutId() == null || layout.getLayoutId().isBlank()) {
                layout.setLayoutId(UUID.randomUUID().toString());
            }

            layoutTable.putItem(layout);
            logger.info("✅ Saved layout with ID: {}", layout.getLayoutId());
        } catch (Exception e) {
            logger.error("❌ Failed to save layout: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save layout", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public LayoutEntity getLayoutById(String layoutId) {
        try {
            LayoutEntity layout = layoutTable.getItem(r -> r.key(k -> k.partitionValue(layoutId)));
            if (layout != null) {
                logger.info("✅ Retrieved layout with ID: {}", layoutId);
            } else {
                logger.warn("⚠️ Layout not found with ID: {}", layoutId);
            }
            return layout;
        } catch (Exception e) {
            logger.error("❌ Failed to get layout by ID {}: {}", layoutId, e.getMessage(), e);
            throw new RuntimeException("Failed to get layout", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<LayoutEntity> getAllLayouts() {
        try {
            List<LayoutEntity> allLayouts = new ArrayList<>();
            layoutTable.scan().items().forEach(allLayouts::add);
            logger.info("✅ Retrieved {} layout(s) from DynamoDB", allLayouts.size());
            return allLayouts;
        } catch (Exception e) {
            logger.error("❌ Failed to get all layouts: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get all layouts", e);
        }
    }

    @Override
    @Transactional
    public void updateLayout(UpdateLayoutDTO updateDTO) {
        try {
            LayoutEntity existing = layoutTable.getItem(r -> r.key(k -> k.partitionValue(updateDTO.getLayoutId())));

            if (existing != null) {
                existing.setFixtureLayout(updateDTO.getFixtureLayout());
                existing.setItemMap(updateDTO.getItemMap());

                layoutTable.putItem(existing);
                logger.info("✅ Updated layout with ID: {}", updateDTO.getLayoutId());
            } else {
                logger.warn("⚠️ Cannot update — layout not found with ID: {}", updateDTO.getLayoutId());
                throw new IllegalArgumentException("Layout with ID " + updateDTO.getLayoutId() + " not found.");
            }
        } catch (Exception e) {
            logger.error("❌ Failed to update layout ID {}: {}", updateDTO.getLayoutId(), e.getMessage(), e);
            throw new RuntimeException("Failed to update layout", e);
        }
    }

    @Override
    @Transactional
    public void deleteLayoutById(String layoutId) {
        try {
            layoutTable.deleteItem(r -> r.key(k -> k.partitionValue(layoutId)));
            logger.info("🗑️ Deleted layout with ID: {}", layoutId);
        } catch (Exception e) {
            logger.error("❌ Failed to delete layout ID {}: {}", layoutId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete layout", e);
        }
    }

}
