package com.sb.backupservice.repository;

import com.sb.backupservice.model.BillBackup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillBackupRepository extends JpaRepository<BillBackup, Long> {

}
