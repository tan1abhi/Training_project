package org.example.portfolio_backend.repo;

import org.example.portfolio_backend.entity.StockMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StockMasterRepository extends JpaRepository<StockMaster, Long> {

    Optional<StockMaster> findByTicker(String ticker);
}