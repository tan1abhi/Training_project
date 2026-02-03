package org.example.portfolio_backend.repo;

import org.example.portfolio_backend.entity.HistoricalDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistoricalDataRepository extends JpaRepository<HistoricalDataEntity, Long> {

    // 1. Find all history for a specific ticker (e.g., "AAPL")
    List<HistoricalDataEntity> findByTickerOrderByPriceDateDesc(String ticker);

    // 2. Find history for a ticker within a specific date range
    List<HistoricalDataEntity> findByTickerAndPriceDateBetween(String ticker, LocalDate start, LocalDate end);

    // 3. Find by the Portfolio Item's ID (Using the Foreign Key relationship)

    @Query("SELECT h FROM HistoricalDataEntity h WHERE h.ticker = :ticker")
    List<HistoricalDataEntity> findByTicker(@Param("ticker") String ticker);
}