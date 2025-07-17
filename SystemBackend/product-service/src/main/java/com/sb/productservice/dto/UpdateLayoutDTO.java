package com.sb.productservice.dto;

import java.util.List;
import java.util.Map;

public class UpdateLayoutDTO {

    private String layoutId;

    private Map<String, FixtureEntity> fixtureLayout;

    private Map<String, List<List<List<ItemEntity>>>> itemMap;


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
