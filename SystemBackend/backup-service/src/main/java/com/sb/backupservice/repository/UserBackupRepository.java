package com.sb.backupservice.repository;

import com.sb.backupservice.model.UserBackup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserBackupRepository extends JpaRepository<UserBackup, UUID> {

    void deleteByUsername(String username);

    boolean existsByUsername(String username);

}
