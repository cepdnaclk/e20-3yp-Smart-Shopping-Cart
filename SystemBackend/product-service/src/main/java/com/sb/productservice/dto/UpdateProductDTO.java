package com.sb.productservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class UpdateProductDTO {

    @Size(min = 3, max = 50, message = "Barcode must be between 3 and 50 characters")
    private String barcode;

    @Size(min = 3, max = 50, message = "Product Name must be between 3 and 50 characters")
    private String productName;

    @Size(min = 10, max = 200, message = "Product Description must be between 10 and 200 characters")
    private String productDescription;

    private Double productPrice;

    private Integer productQuantity;

    @Size(min = 3, max = 50, message = "Product Category must be between 3 and 50 characters")
    private String productCategory;

    private MultipartFile productImage;

    @Size(min = 3, max = 50, message = "Product Brand must be between 3 and 50 characters")
    private String productBrand;

    private Double productWeight;

    private Integer productShelfNumber;

    private Integer productColumnNumber;

    private Integer productRowNumber;

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getProductQuantity() {
        return productQuantity;
    }

    public void setProductQuantity(Integer productQuantity) {
        this.productQuantity = productQuantity;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public MultipartFile getProductImage() {
        return productImage;
    }

    public void setProductImage(MultipartFile productImage) {
        this.productImage = productImage;
    }

    public String getProductBrand() {
        return productBrand;
    }

    public void setProductBrand(String productBrand) {
        this.productBrand = productBrand;
    }

    public Double getProductWeight() {
        return productWeight;
    }

    public void setProductWeight(Double productWeight) {
        this.productWeight = productWeight;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public Integer getProductShelfNumber() {
        return productShelfNumber;
    }

    public void setProductShelfNumber(Integer productShelfNumber) {
        this.productShelfNumber = productShelfNumber;
    }

    public Integer getProductRowNumber() {
        return productRowNumber;
    }

    public void setProductRowNumber(Integer productRowNumber) {
        this.productRowNumber = productRowNumber;
    }

    public Integer getProductColumnNumber() {
        return productColumnNumber;
    }

    public void setProductColumnNumber(Integer productColumnNumber) {
        this.productColumnNumber = productColumnNumber;
    }
}

