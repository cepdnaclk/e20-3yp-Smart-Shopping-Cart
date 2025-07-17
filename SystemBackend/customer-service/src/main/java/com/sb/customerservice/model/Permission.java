package com.sb.customerservice.model;

public enum Permission {

    // Define permissions for the CUSTOMER role.
    CUSTOMER_READ("customer:read");

    private final String permission;


    Permission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
