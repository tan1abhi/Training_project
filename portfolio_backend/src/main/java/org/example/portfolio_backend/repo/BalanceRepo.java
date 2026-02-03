package org.example.portfolio_backend.repo;

import org.example.portfolio_backend.entity.UserBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BalanceRepo extends JpaRepository<UserBalance, Long> {
}