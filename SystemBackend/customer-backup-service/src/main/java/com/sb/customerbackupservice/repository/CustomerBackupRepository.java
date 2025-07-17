package com.sb.customerbackupservice.repository;

import com.sb.customerbackupservice.model.CustomerBackup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CustomerBackupRepository extends JpaRepository<CustomerBackup, UUID> {

    void deleteByUsername(String username);

    boolean existsByUsername(String username);

}
