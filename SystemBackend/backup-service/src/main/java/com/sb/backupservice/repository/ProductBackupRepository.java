package com.sb.backupservice.repository;

import com.sb.backupservice.model.ProductBackup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductBackupRepository extends JpaRepository<ProductBackup, Long> {
}
