package com.sb.productservice.service;

import com.sb.productservice.dto.AddProductDTO;
import com.sb.productservice.dto.GetProductDTO;
import com.sb.productservice.dto.UpdateProductDTO;
import com.sb.productservice.model.Products;

import java.util.List;

public interface ProductService{

    String addProduct(AddProductDTO addProductDTO);

    String updateProduct(UpdateProductDTO updateProductDTO);

    String deleteProduct(String barcode);

    GetProductDTO getProductByBarcode(String barcode);

    List<GetProductDTO> getAllProducts();

    List<GetProductDTO> getProductsByCategory(String category);

    List<GetProductDTO> getProductsByBrand(String brand);
}
