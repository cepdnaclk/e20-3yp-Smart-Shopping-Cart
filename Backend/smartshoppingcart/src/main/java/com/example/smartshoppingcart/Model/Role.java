package com.example.smartshoppingcart.Model;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import static com.example.smartshoppingcart.Model.Permission.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Enum representing different roles in the application.
 * Each role has a set of permissions associated with it.
 */
@Getter
@RequiredArgsConstructor
public enum Role {

    /**
     * Role for regular users with read-only permissions.
     */
    USER(
            Set.of(
                    USER_READ
            )
    ),

    /**
     * Role for managers with CRUD permissions.
     */
    MANAGER(
            Set.of(
                    MANAGER_READ,
                    MANAGER_CREATE,
                    MANAGER_UPDATE,
                    MANAGER_DELETE
            )
    ),

    /**
     * Role for administrators with all permissions, including manager permissions.
     */
    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_CREATE,
                    ADMIN_DELETE,
                    // Inheriting MANAGER permissions
                    MANAGER_READ,
                    MANAGER_CREATE,
                    MANAGER_UPDATE,
                    MANAGER_DELETE
            )
    );

    /**
     * Permissions assigned to the role.
     */
    private final Set<Permission> permissions;

    /**
     * Converts the role's permissions into a list of SimpleGrantedAuthority objects.
     * Adds the role itself as a SimpleGrantedAuthority.
     *
     * @return List of SimpleGrantedAuthority objects representing the role's permissions and the role itself.
     */
    public List<SimpleGrantedAuthority> getAuthorities() {
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