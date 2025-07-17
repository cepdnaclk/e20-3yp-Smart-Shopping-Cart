package com.sb.userservice.model;

public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),

    MANAGER_READ("manager:read"),
    MANAGER_UPDATE("manager:update"),
    MANAGER_CREATE("manager:create"),
    MANAGER_DELETE("manager:delete"),

    CASHIER_READ("cashier:read"),
    CASHIER_UPDATE("cashier:update"),
    CASHIER_CREATE("cashier:create"),
    CASHIER_DELETE("cashier:delete"),

    SECURITY_READ("security:read"),
    SECURITY_UPDATE("security:update"),
    SECURITY_CREATE("security:create"),
    SECURITY_DELETE("security:delete"),

    SUPPLIER_READ("supplier:read"),
    SUPPLIER_UPDATE("supplier:update"),
    SUPPLIER_CREATE("supplier:create"),
    SUPPLIER_DELETE("supplier:delete"),

    STAFF_READ("staff:read"),
    STAFF_UPDATE("staff:update"),
    STAFF_CREATE("staff:create"),
    STAFF_DELETE("staff:delete");

    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }

}
