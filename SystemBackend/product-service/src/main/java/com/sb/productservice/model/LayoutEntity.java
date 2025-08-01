package com.sb.productservice.model;

import com.sb.productservice.dto.FixtureEntity;
import com.sb.productservice.dto.ItemEntity;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;
import java.util.Map;

@DynamoDbBean
public class LayoutEntity {

    private String layoutId; // Partition key
    private Map<String, FixtureEntity> fixtureLayout;
    private Map<String, List<List<List<ItemEntity>>>> itemMap;

    @DynamoDbPartitionKey
    public String getLayoutId() {
        return layoutId;
    }

    public void setLayoutId(String layoutId) {
        this.layoutId = layoutId;
    }

    public Map<String, FixtureEntity> getFixtureLayout() {
        return fixtureLayout;
    }

    public void setFixtureLayout(Map<String, FixtureEntity> fixtureLayout) {
        this.fixtureLayout = fixtureLayout;
    }

    public Map<String, List<List<List<ItemEntity>>>> getItemMap() {
        return itemMap;
    }

    public void setItemMap(Map<String, List<List<List<ItemEntity>>>> itemMap) {
        this.itemMap = itemMap;
    }
}
