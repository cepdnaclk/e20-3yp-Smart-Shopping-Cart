package com.sb.billservice.repository;

import com.sb.billservice.model.Bill;
import com.sb.billservice.model.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill,Long> {

    Bill findById(long id);

    Optional<Bill> findByUsernameAndStatus(String username, BillStatus status);

}
