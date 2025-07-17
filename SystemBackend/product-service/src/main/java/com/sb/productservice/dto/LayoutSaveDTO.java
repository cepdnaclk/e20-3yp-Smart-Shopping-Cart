package com.sb.productservice.dto;
import java.util.List;
import java.util.Map;

public class LayoutSaveDTO {

    private Map<String, FixtureEntity> fixtureLayout;

    // For this:
    // "itemMap": { "fixture-id": List<List<List<ItemDTO>>> }
    private Map<String, List<List<List<ItemEntity>>>> itemMap;


}
