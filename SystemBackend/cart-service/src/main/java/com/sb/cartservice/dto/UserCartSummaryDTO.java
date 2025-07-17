package com.sb.cartservice.dto;

import java.util.List;

public class UserCartSummaryDTO {

    private String userId;
    private List<CartDTO> items;
    private double totalPrice;
    private double totalWeight;

    // Constructors
    public UserCartSummaryDTO() {}

    public UserCartSummaryDTO(String userId, List<CartDTO> items, double totalPrice, double totalWeight) {
        this.userId = userId;
        this.items = items;
        this.totalPrice = totalPrice;
        this.totalWeight = totalWeight;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<CartDTO> getItems() {
        return items;
    }

    public void setItems(List<CartDTO> items) {
        this.items = items;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public double getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(double totalWeight) {
        this.totalWeight = totalWeight;
    }

}
