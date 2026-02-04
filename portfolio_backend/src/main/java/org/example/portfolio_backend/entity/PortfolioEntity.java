package org.example.portfolio_backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "portfolio_items")
public class PortfolioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Core Data ---

    @Column(nullable = false)
    private String ticker;        // e.g., "AAPL"

    @Column(nullable = false)
    private Integer quantity;     // e.g., 100

    @Column(name = "buy_price", nullable = false)
    private Double buyPrice;      // e.g., 150.00

    @Column(name = "asset_type", nullable = false)
    private String assetType;  // STOCK, BOND, etc.

    @Column(nullable = false)
    private String sector;

    @Column(length = 3, nullable = false)
    private String currency;

    @Column(name = "risk_label")
    private String riskLabel;

    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;

    @Column(name = "target_sell_price")
    private Double targetSellPrice;

    @Column(name = "stop_loss_price")
    private Double stopLossPrice;

    @Column(length = 500)
    private String notes;
    // Inside PortfolioEntity.java

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoricalDataEntity> historicalPrices;

    public PortfolioEntity() {
    }

    public PortfolioEntity(Long id, String ticker, Integer quantity, Double buyPrice, String assetType, String sector, String currency, String riskLabel, LocalDateTime purchaseDate, Double targetSellPrice, Double stopLossPrice, String notes) {
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
