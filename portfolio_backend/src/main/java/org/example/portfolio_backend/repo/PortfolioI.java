package org.example.portfolio_backend.repo;

import org.example.portfolio_backend.entity.PortfolioEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class PortfolioI {

    // Injecting the Interface defined above
    private final Portfolio repository;

    public PortfolioI(Portfolio repository) {
        this.repository = repository;
    }
    // --- STANDARD CRUD OPERATIONS ---

    public PortfolioEntity saveItem(PortfolioEntity item) {
        // Uses JpaRepository's built-in save()
        // If ID is null -> INSERT. If ID exists -> UPDATE.
        return repository.save(item);
    }

    public List<PortfolioEntity> getAllItems() {
        return repository.findAll();
    }

    public PortfolioEntity getItemById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    // --- INNOVATIVE / ANALYTICS METHODS ---

    /**
     * 1. TOTAL PORTFOLIO VALUE
     * Calculates the total sum of (Quantity * BuyPrice) for all items.
     */
    public Double calculateTotalValue() {
        List<PortfolioEntity> allItems = repository.findAll();

        return allItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getBuyPrice())
                .sum();
    }

    /**
     * 2. RISK ANALYSIS DASHBOARD
     * Fetches all assets tagged as "HIGH" or "SPECULATIVE".
     * Useful for showing a warning to the client.
     */
    public List<PortfolioEntity> getHighRiskAssets() {
        // We use the custom JPA methods we defined in the interface
        List<PortfolioEntity> highRisk = repository.findByRiskLabel("HIGH");
        List<PortfolioEntity> speculative = repository.findByRiskLabel("SPECULATIVE");

        // Combine both lists
        highRisk.addAll(speculative);
        return highRisk;
    }

    /**
     * 3. SECTOR ALLOCATION (For Pie Charts)
     * Groups investments by Sector and sums their total value.
     * Example Output: { "Technology": 5000.0, "Energy": 1500.0 }
     */
    public Map<String, Double> getSectorAllocation() {
        List<PortfolioEntity> allItems = repository.findAll();

        return allItems.stream()
                .collect(Collectors.groupingBy(
                        PortfolioEntity::getSector,
                        Collectors.summingDouble(item -> item.getQuantity() * item.getBuyPrice())
                ));
    }

    /**
     * 4. FOREIGN EXPOSURE CHECK
     * Returns TRUE if more than 50% of the portfolio value is held in non-USD assets.
     */
    public boolean isHighForeignExposure() {
        // Fetch all items that are NOT in USD
        List<PortfolioEntity> foreignItems = repository.findByCurrencyNot("USD");

        double foreignValue = foreignItems.stream()
                .mapToDouble(item -> item.getQuantity() * item.getBuyPrice())
                .sum();

        double totalValue = calculateTotalValue();

        // Avoid division by zero if portfolio is empty
        if (totalValue == 0) return false;

        // Return true if foreign value is greater than 50% of total
        return (foreignValue / totalValue) > 0.50;
    }
}
