package org.example.portfolio_backend.repo;

import org.example.portfolio_backend.entity.HistoricalDataEntity;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class HistoricalDataI {

    private final HistoricalDataRepository repository;

    public HistoricalDataI(HistoricalDataRepository repository) {
        this.repository = repository;
    }

    // --- STANDARD CRUD OPERATIONS ---

    public HistoricalDataEntity savePriceEntry(HistoricalDataEntity entity) {
        return repository.save(entity);
    }

    public List<HistoricalDataEntity> saveAllEntries(List<HistoricalDataEntity> entries) {
        return repository.saveAll(entries);
    }

    public List<HistoricalDataEntity> getHistoryByTicker(String ticker) {
        return repository.findByTickerOrderByPriceDateDesc(ticker);
    }

    public List<HistoricalDataEntity> getHistoryById(Long id) {
        return repository.findByPortfolioItemId(id);
    }

    public void deleteHistoryByTicker(String ticker) {
        List<HistoricalDataEntity> items = repository.findByTickerOrderByPriceDateDesc(ticker);
        repository.deleteAll(items);
    }

    // --- ANALYTICS / HELPER METHODS ---

    /**
     * Calculates the price change percentage between the oldest and newest
     * record in the provided list.
     */
    public Double calculatePriceChangePercent(String ticker) {
        List<HistoricalDataEntity> prices = repository.findByTickerOrderByPriceDateDesc(ticker);

        if (prices.size() < 2) return 0.0;

        Double latest = prices.get(0).getClosePrice();
        Double oldest = prices.get(prices.size() - 1).getClosePrice();

        return ((latest - oldest) / oldest) * 100;
    }

    /**
     * Finds the highest price reached for a ticker in a given date range.
     */
    public Double getPeriodHigh(String ticker, LocalDate start, LocalDate end) {
        return repository.findByTickerAndPriceDateBetween(ticker, start, end)
                .stream()
                .mapToDouble(HistoricalDataEntity::getHighPrice)
                .max()
                .orElse(0.0);
    }
}
