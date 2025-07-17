package com.sb.productservice.service;

import com.sb.productservice.dto.UpdateLayoutDTO;
import com.sb.productservice.model.LayoutEntity;

import java.util.List;

public interface LayoutService {

    void saveLayout(LayoutEntity layout);

    LayoutEntity getLayoutById(String layoutId);

    List<LayoutEntity> getAllLayouts();

    void updateLayout(UpdateLayoutDTO updateDTO);

    void deleteLayoutById(String layoutId);

}
