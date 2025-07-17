package com.sb.customerservice.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public enum Role {

    CUSTOMER(Collections.emptySet())
    ;


    // Permissions assigned to the role.
    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    /**
     * Converts the permissions and role name into a list of SimpleGrantedAuthority objects,
     * which are used by Spring Security for role-based authorization.
     *
     * @return A list of SimpleGrantedAuthority objects, including role-specific and permission-based authorities.
     */
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

    public Set<Permission> getPermissions() {
        return Collections.unmodifiableSet(permissions);
    }


}
