package com.example.smartshoppingcart.Model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Enum representing different permissions in the application.
 * Each permission is associated with a specific action that can be performed.
 */
@Getter
@RequiredArgsConstructor
public enum Permission {

    // ===== Admin Permissions =====
    // Permissions for admin users, covering CRUD operations.

    /**
     * Permission to read admin data.
     */
    ADMIN_READ("admin:read"),

    /**
     * Permission to update admin data.
     */
    ADMIN_UPDATE("admin:update"),

    /**
     * Permission to create admin data.
     */
    ADMIN_CREATE("admin:create"),

    /**
     * Permission to delete admin data.
     */
    ADMIN_DELETE("admin:delete"),

    // ===== Manager Permissions =====
    // Permissions for managers, covering CRUD operations.

    /**
     * Permission to read manager data.
     */
    MANAGER_READ("manager:read"),

    /**
     * Permission to update manager data.
     */
    MANAGER_UPDATE("manager:update"),

    /**
     * Permission to create manager data.
     */
    MANAGER_CREATE("manager:create"),

    /**
     * Permission to delete manager data.
     */
    MANAGER_DELETE("manager:delete"),

    // ===== Student Permissions =====
    // Permissions for students, typically restricted to read-only access.

    /**
     * Permission to read student data.
     */
    USER_READ("student:read");

    /**
     * The permission string that will be used for Spring Security authorization checks.
     */
    private final String permission;
}