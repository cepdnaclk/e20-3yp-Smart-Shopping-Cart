package com.sb.userservice.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public enum Role {

    GUEST(Collections.emptySet()),

    ADMIN(
            Set.of(
                    Permission.ADMIN_READ,
                    Permission.ADMIN_UPDATE,
                    Permission.ADMIN_CREATE,
                    Permission.ADMIN_DELETE,

                    Permission.MANAGER_READ,
                    Permission.MANAGER_CREATE,
                    Permission.MANAGER_UPDATE,
                    Permission.MANAGER_DELETE,

                    Permission.CASHIER_READ,
                    Permission.CASHIER_CREATE,
                    Permission.CASHIER_UPDATE,
                    Permission.CASHIER_DELETE,

                    Permission.SECURITY_READ,
                    Permission.SECURITY_CREATE,
                    Permission.SECURITY_UPDATE,
                    Permission.SECURITY_DELETE,

                    Permission.SUPPLIER_READ,
                    Permission.SUPPLIER_CREATE,
                    Permission.SUPPLIER_UPDATE,
                    Permission.SUPPLIER_DELETE,

                    Permission.STAFF_READ,
                    Permission.STAFF_CREATE,
                    Permission.STAFF_UPDATE,
                    Permission.STAFF_DELETE

            )
    ),

    MANAGER(
            Set.of(
                    Permission.MANAGER_READ,
                    Permission.MANAGER_CREATE,
                    Permission.MANAGER_UPDATE,
                    Permission.MANAGER_DELETE
            )
    ),

    CASHIER(
            Set.of(
                    Permission.CASHIER_READ,
                    Permission.CASHIER_CREATE,
                    Permission.CASHIER_UPDATE,
                    Permission.CASHIER_DELETE
            )
    ),

    SECURITY(
            Set.of(
                    Permission.SECURITY_READ,
                    Permission.SECURITY_CREATE,
                    Permission.SECURITY_UPDATE,
                    Permission.SECURITY_DELETE
            )
    ),

    SUPPLIER(
            Set.of(
                    Permission.SUPPLIER_READ,
                    Permission.SUPPLIER_CREATE,
                    Permission.SUPPLIER_UPDATE,
                    Permission.SUPPLIER_DELETE
            )
    ),

    STAFF(
            Set.of(
                    Permission.STAFF_READ,
                    Permission.STAFF_CREATE,
                    Permission.STAFF_UPDATE,
                    Permission.STAFF_DELETE
            )
    );

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public List<SimpleGrantedAuthority> getAuthorities()
    {
        // Convert permissions into SimpleGrantedAuthority objects.
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());

        // Add the role itself as a SimpleGrantedAuthority (e.g., ROLE_ADMIN, ROLE_TEACHER).
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }

}
