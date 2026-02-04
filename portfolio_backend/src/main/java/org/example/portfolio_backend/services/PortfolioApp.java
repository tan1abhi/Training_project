package org.example.portfolio_backend.services;

import org.example.portfolio_backend.entity.PortfolioEntity;
import org.example.portfolio_backend.entity.StockMaster;
import org.example.portfolio_backend.model.DataSender;
import org.example.portfolio_backend.model.DataReciever;
import org.example.portfolio_backend.repo.PortfolioI;
import org.example.portfolio_backend.repo.StockMasterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PortfolioApp {

    private final PortfolioI portfolioWrapper;
    private final BalanceService balanceService;
    private final StockMasterRepository stockMasterRepo;
    private final YFinanceClientService yFinanceService;

    public PortfolioApp(PortfolioI portfolioWrapper,
                        BalanceService balanceService,
                        StockMasterRepository stockMasterRepo,
                        YFinanceClientService yFinanceService) {
        this.portfolioWrapper = portfolioWrapper;
        this.balanceService = balanceService;
        this.stockMasterRepo = stockMasterRepo;
        this.yFinanceService = yFinanceService;
    }

    // --- Mapper Methods (Kept at Top) ---

    public DataSender toDataSender(PortfolioEntity entity) {
        DataSender dto = new DataSender();
        dto.setId(entity.getId());
        dto.setTicker(entity.getTicker());
        dto.setQuantity(entity.getQuantity());
        dto.setBuyPrice(entity.getBuyPrice());
        dto.setAssetType(entity.getAssetType());
        dto.setSector(entity.getSector());
        dto.setCurrency(entity.getCurrency());
        dto.setRiskLabel(entity.getRiskLabel());
        dto.setTargetSellPrice(entity.getTargetSellPrice());
        dto.setStopLossPrice(entity.getStopLossPrice());
        dto.setNotes(entity.getNotes());
        dto.setPurchaseDate(entity.getPurchaseDate());
        return dto;
    }

    private PortfolioEntity toEntity(DataSender dto) {
        PortfolioEntity entity = new PortfolioEntity();
        entity.setId(null);
        entity.setTicker(dto.getTicker());
        entity.setQuantity(dto.getQuantity());
        entity.setBuyPrice(dto.getBuyPrice());
        entity.setAssetType(dto.getAssetType());
        entity.setSector(dto.getSector());
        entity.setCurrency(dto.getCurrency());
        entity.setRiskLabel(dto.getRiskLabel());
        entity.setTargetSellPrice(dto.getTargetSellPrice());
        entity.setStopLossPrice(dto.getStopLossPrice());
        entity.setNotes(dto.getNotes());
        entity.setPurchaseDate(dto.getPurchaseDate());
        return entity;
    }

    // --- Balance Methods for Controller ---

    public Double getUserBalance() {
        return balanceService.getCurrentBalance();
    }

    // =================================================================
    // MARKET DATA LOGIC (STOCK MASTER)
    // =================================================================

    /**
     * Fetches the full list of available stocks and their real-time prices
     * from the DB to be shown in the frontend by default.
     */
    public List<StockMaster> getAvailableMarketStocks() {
        return stockMasterRepo.findAll();
    }

    /**
     * Pulls details from Yahoo Finance and updates the Stock Master table.
     */
    @Transactional
    public void syncMarketData(List<String> tickers) {
        for (String ticker : tickers) {
            try {
                DataReciever liveData = yFinanceService.fetchStockData(ticker);
                if (liveData != null) {
                    StockMaster stock = stockMasterRepo.findByTicker(ticker)
                            .orElse(new StockMaster());

                    stock.setTicker(ticker);
                    stock.setCompanyName(liveData.getMetadata().getCompanyName()); // Placeholder name
                    stock.setCurrentPrice(liveData.getLatestPrice());
                    stock.setSector(liveData.getMetadata().getSector());
                    stockMasterRepo.save(stock);
                }
            } catch (Exception e) {
                System.err.println("Could not sync ticker: " + ticker);
            }
        }
    }

    // =================================================================
    // CORE LOGIC: PURCHASE WITH BALANCE CHECK
    // =================================================================

    @Transactional
    public boolean attemptPurchase(DataSender dto) {
        // Fetch real-time price from YFinance before deducting balance
        DataReciever liveData = yFinanceService.fetchStockData(dto.getTicker());
        if (liveData == null) return false;

        double currentMarketPrice = liveData.getLatestPrice();
        double totalCost = dto.getQuantity() * currentMarketPrice;

        boolean paymentProcessed = balanceService.deductFunds(totalCost);

        if (paymentProcessed) {
            // Overwrite the DTO price with the actual real-time market price
            dto.setBuyPrice(currentMarketPrice);
            addNewInvestment(dto);
            return true;
        }
        return false;
    }

    @Transactional
    public Map<String, Object> sellInvestment(Long id, Double currentMarketPrice, Integer quantityToSell) {
        // 1. Find the existing investment
        PortfolioEntity entity = portfolioWrapper.getItemById(id);
        if (entity == null) throw new RuntimeException("Investment not found");

        // 2. Validate quantity
        if (quantityToSell > entity.getQuantity()) {
            throw new IllegalArgumentException("You cannot sell more than you own!");
        }

        // 3. Calculate Financials
        Double totalSellValue = currentMarketPrice * quantityToSell;
        // Profit based on the cost of the portion being sold
        Double profitAmount = (currentMarketPrice - entity.getBuyPrice()) * quantityToSell;

        // 4. Update User Balance
        balanceService.addFunds(totalSellValue);

        // 5. Update or Delete Portfolio Record
        if (quantityToSell.equals(entity.getQuantity())) {
            // Selling everything
            portfolioWrapper.deleteItem(id);
        } else {
            // Partial sale: Reduce the quantity and save
            entity.setQuantity(entity.getQuantity() - quantityToSell);
            portfolioWrapper.saveItem(entity);
        }

        // 6. Return summary
        return Map.of(
                "ticker", entity.getTicker(),
                "sellValue", totalSellValue,
                "profitAmount", profitAmount,
                "remainingQuantity", entity.getQuantity()
        );
    }

    // =================================================================
    // READ OPERATIONS
    // =================================================================

    public List<DataSender> getAllInvestments() {
        return portfolioWrapper.getAllItems().stream()
                .map(this::toDataSender)
                .collect(Collectors.toList());
    }

    public DataSender getInvestmentById(Long id) {
        PortfolioEntity entity = portfolioWrapper.getItemById(id);
        return entity == null ? null : toDataSender(entity);
    }

    // ... (Filter methods remain the same)

    public List<DataSender> getInvestmentsByTicker(String ticker) {
        return portfolioWrapper.getAllItems().stream()
                .filter(item -> item.getTicker().equalsIgnoreCase(ticker))
                .map(this::toDataSender)
                .collect(Collectors.toList());
    }

    // =================================================================
    // WRITE OPERATIONS
    // =================================================================

    public void addNewInvestment(DataSender dto) {
        PortfolioEntity entity = toEntity(dto);
        portfolioWrapper.saveItem(entity);
    }

    public void updateInvestment(DataSender updatedInvestment) {
        PortfolioEntity existingItem = portfolioWrapper.getItemById(updatedInvestment.getId());
        if (existingItem != null) {
            existingItem.setTicker(updatedInvestment.getTicker());
            existingItem.setQuantity(updatedInvestment.getQuantity());
            existingItem.setBuyPrice(updatedInvestment.getBuyPrice());
            existingItem.setAssetType(updatedInvestment.getAssetType());
            existingItem.setSector(updatedInvestment.getSector());
            existingItem.setCurrency(updatedInvestment.getCurrency());
            existingItem.setRiskLabel(updatedInvestment.getRiskLabel());
            existingItem.setTargetSellPrice(updatedInvestment.getTargetSellPrice());
            existingItem.setStopLossPrice(updatedInvestment.getStopLossPrice());
            existingItem.setNotes(updatedInvestment.getNotes());
            portfolioWrapper.saveItem(existingItem);
        }
    }

    public void deleteInvestmentById(long id) {
        portfolioWrapper.deleteItem(id);
    }

    // =================================================================
    // ANALYTICS
    // =================================================================

    public Double getTotalPortfolioValue() {
        return portfolioWrapper.calculateTotalValue();
    }

    public void deleteAllInvestments() {
        portfolioWrapper.getAllItems().forEach(item -> portfolioWrapper.deleteItem(item.getId()));
    }
}