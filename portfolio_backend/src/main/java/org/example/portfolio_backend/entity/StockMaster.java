package org.example.portfolio_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_master")
public class StockMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName; // e.g., "Apple Inc."

    @Column(nullable = false, unique = true)
    private String ticker;      // e.g., "AAPL"

    private Double currentPrice;

    private String sector;

    // --- Constructors ---

    public StockMaster() {
    }

    public StockMaster(String companyName, String ticker, Double currentPrice, String sector) {
        this.companyName = companyName;
        this.ticker = ticker;
        this.currentPrice = currentPrice;
        this.sector = sector;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public Double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(Double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }
}