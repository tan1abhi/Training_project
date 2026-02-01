package org.example.portfolio_backend.model;

public class Metadata {
    private String ticker;
    private String companyName;
    private String exchange;
    private String industry;
    private String sector;
    private String currency;

    public Metadata(String ticker, String companyName, String exchange, String industry, String sector, String currency) {
        this.ticker = ticker;
        this.companyName = companyName;
        this.exchange = exchange;
        this.industry = industry;
        this.sector = sector;
        this.currency = currency;
    }

    public Metadata() {
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
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
}