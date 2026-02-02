package org.example.portfolio_backend.services;

import org.example.portfolio_backend.entity.PortfolioEntity;
import org.example.portfolio_backend.model.DataSender;
import org.example.portfolio_backend.repo.PortfolioI;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioApp {

    private final PortfolioI portfolioWrapper;
    private final BalanceService balanceService; // New dependency injected

    public PortfolioApp(PortfolioI portfolioWrapper, BalanceService balanceService) {
        this.portfolioWrapper = portfolioWrapper;
        this.balanceService = balanceService;
    }

    // --- Mapper Methods ---

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
        return entity;
    }

    // --- Balance Methods for Controller ---

    public Double getUserBalance() {
        return balanceService.getCurrentBalance();
    }

    // =================================================================
    // CORE LOGIC: PURCHASE WITH BALANCE CHECK
    // =================================================================

    /**
     * This method validates if the user has enough money.
     * If yes, it deducts funds and saves the investment.
     */
    @Transactional
    public boolean attemptPurchase(DataSender dto) {
        // Calculate the cost based on quantity and the buyPrice (fetched from YFinance)
        double totalCost = dto.getQuantity() * dto.getBuyPrice();

        // 1. Check balance and deduct funds via BalanceService
        boolean paymentProcessed = balanceService.deductFunds(totalCost);

        if (paymentProcessed) {
            // 2. If payment was successful, save the investment to the main table
            addNewInvestment(dto);
            return true;
        }

        // 3. If not enough money, return false to the controller
        return false;
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

    public List<DataSender> getInvestmentsBySector(String sector) {
        return portfolioWrapper.getAllItems().stream()
                .filter(item -> item.getSector().equalsIgnoreCase(sector))
                .map(this::toDataSender)
                .collect(Collectors.toList());
    }

    public List<DataSender> getInvestmentsByType(String type) {
        return portfolioWrapper.getAllItems().stream()
                .filter(item -> item.getAssetType().equalsIgnoreCase(type))
                .map(this::toDataSender)
                .collect(Collectors.toList());
    }

    public List<DataSender> getInvestmentsByRisk(String risk) {
        return portfolioWrapper.getAllItems().stream()
                .filter(item -> item.getRiskLabel().equalsIgnoreCase(risk))
                .map(this::toDataSender)
                .collect(Collectors.toList());
    }

    public List<DataSender> getInvestmentsByCurr(String curr) {
        return portfolioWrapper.getAllItems().stream()
                .filter(item -> item.getCurrency().equalsIgnoreCase(curr))
                .map(this::toDataSender)
                .collect(Collectors.toList());
    }

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

    public List<DataSender> getHighRiskAlerts() {
        return portfolioWrapper.getHighRiskAssets().stream()
                .map(this::toDataSender)
                .collect(Collectors.toList());
    }
}