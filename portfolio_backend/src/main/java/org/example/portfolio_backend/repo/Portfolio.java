package org.example.portfolio_backend.repo;

import org.example.portfolio_backend.entity.PortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Portfolio extends JpaRepository<PortfolioEntity, Long> {

    // --- CUSTOM JPA METHODS (Spring writes the SQL automatically) ---

    // 1. Find by Sector (e.g., "Technology")
    List<PortfolioEntity> findBySector(String sector);

    // 2. Find by Asset Type (e.g., "STOCK", "CRYPTO") -> Now accepts String
    List<PortfolioEntity> findByAssetType(String assetType);

    // 3. Find by Risk Label (e.g., "HIGH")
    List<PortfolioEntity> findByRiskLabel(String riskLabel);

    // 4. Find items where currency is NOT the one specified (e.g., non-USD)
    List<PortfolioEntity> findByCurrencyNot(String currency);
}