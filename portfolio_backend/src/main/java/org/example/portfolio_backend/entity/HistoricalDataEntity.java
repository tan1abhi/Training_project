package org.example.portfolio_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "historical_prices")
public class HistoricalDataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Foreign Key Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private PortfolioEntity portfolioItem;

    // --- Core Data ---
    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    @Column(nullable = false)
    private String ticker; // e.g., "AAPL"

    private Double openPrice;
    private Double highPrice;
    private Double lowPrice;
    private Double closePrice;
    private Long volume;

    // Default Constructor
    public HistoricalDataEntity() {
    }

    // Full Constructor
    public HistoricalDataEntity(PortfolioEntity portfolioItem, LocalDate priceDate,
                                Double openPrice, Double highPrice, Double lowPrice,
                                Double closePrice, Long volume) {
        this.portfolioItem = portfolioItem;
        this.priceDate = priceDate;
        // Automatically set ticker from the linked portfolio item if available
        this.ticker = (portfolioItem != null) ? portfolioItem.getTicker() : null;
        this.openPrice = openPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.closePrice = closePrice;
        this.volume = volume;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PortfolioEntity getPortfolioItem() {
        return portfolioItem;
    }

    public void setPortfolioItem(PortfolioEntity portfolioItem) {
        this.portfolioItem = portfolioItem;
        // Sync ticker when portfolio item is set
        if (portfolioItem != null) {
            this.ticker = portfolioItem.getTicker();
        }
    }

    public LocalDate getPriceDate() {
        return priceDate;
    }

    public void setPriceDate(LocalDate priceDate) {
        this.priceDate = priceDate;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
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
}