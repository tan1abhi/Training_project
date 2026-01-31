package org.example.portfolio_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

public class DataSender {

    private Long id;

    // --- Core Data ---
    private String ticker;        // e.g., "AAPL"
    private Integer quantity;     // e.g., 100
    private Double buyPrice;      // e.g., 150.00
    private String assetType;  // STOCK, BOND, etc.
    private String sector;
    private String currency;
    private String riskLabel;
    private LocalDateTime purchaseDate;
    private Double targetSellPrice;
    private Double stopLossPrice;
    private String notes;

    public DataSender() {
    }

    public DataSender(Long id, String ticker, Integer quantity, Double buyPrice, String assetType, String sector, String currency, String riskLabel, LocalDateTime purchaseDate, Double targetSellPrice, Double stopLossPrice, String notes) {
        this.id = id;
        this.ticker = ticker;
        this.quantity = quantity;
        this.buyPrice = buyPrice;
        this.assetType = assetType;
        this.sector = sector;
        this.currency = currency;
        this.riskLabel = riskLabel;
        this.purchaseDate = purchaseDate;
        this.targetSellPrice = targetSellPrice;
        this.stopLossPrice = stopLossPrice;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(Double buyPrice) {
        this.buyPrice = buyPrice;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getRiskLabel() {
        return riskLabel;
    }

    public void setRiskLabel(String riskLabel) {
        this.riskLabel = riskLabel;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Double getTargetSellPrice() {
        return targetSellPrice;
    }

    public void setTargetSellPrice(Double targetSellPrice) {
        this.targetSellPrice = targetSellPrice;
    }

    public Double getStopLossPrice() {
        return stopLossPrice;
    }

    public void setStopLossPrice(Double stopLossPrice) {
        this.stopLossPrice = stopLossPrice;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
