package org.example.portfolio_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
        name = "historical_prices",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"ticker", "price_date"})
        }
)
public class HistoricalDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Core Instrument Data ---

    @Column(nullable = false, length = 10)
    private String ticker; // e.g., "AAPL"

    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    private Double openPrice;
    private Double highPrice;
    private Double lowPrice;
    private Double closePrice;
    private Long volume;

    // ✅ FIXED: Added the variable 'portfolio' and correctly mapped the annotations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id")
    private PortfolioEntity portfolio;

    // Default Constructor
    public HistoricalDataEntity() {
    }

    // Convenience Constructor
    public HistoricalDataEntity(
            String ticker,
            LocalDate priceDate,
            Double openPrice,
            Double highPrice,
            Double lowPrice,
            Double closePrice,
            Long volume
    ) {
        this.ticker = ticker;
        this.priceDate = priceDate;
        this.openPrice = openPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.closePrice = closePrice;
        this.volume = volume;
    }

    // --- Getters & Setters ---

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

    public LocalDate getPriceDate() {
        return priceDate;
    }

    public void setPriceDate(LocalDate priceDate) {
        this.priceDate = priceDate;
    }

    public Double getOpenPrice() {
        return openPrice;
    }

    public void setOpenPrice(Double openPrice) {
        this.openPrice = openPrice;
    }

    public Double getHighPrice() {
        return highPrice;
    }

    public void setHighPrice(Double highPrice) {
        this.highPrice = highPrice;
    }

    public Double getLowPrice() {
        return lowPrice;
    }

    public void setLowPrice(Double lowPrice) {
        this.lowPrice = lowPrice;
    }

    public Double getClosePrice() {
        return closePrice;
    }

    public void setClosePrice(Double closePrice) {
        this.closePrice = closePrice;
    }

    public Long getVolume() {
        return volume;
    }

    public void setVolume(Long volume) {
        this.volume = volume;
    }

    // ✅ FIXED: Added Getter and Setter for Portfolio
    public PortfolioEntity getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(PortfolioEntity portfolio) {
        this.portfolio = portfolio;
    }
}