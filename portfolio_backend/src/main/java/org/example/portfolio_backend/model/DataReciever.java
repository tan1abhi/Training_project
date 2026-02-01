package org.example.portfolio_backend.model;

import java.util.List;

public class DataReciever{
    private List<HistoricalData> historicalData;
    private Double latestPrice;
    private Metadata metadata;
    private String period;
    private Double returnPercentage;

    public DataReciever() {
    }

    public DataReciever(List<HistoricalData> historicalData, Double latestPrice, Metadata metadata, String period, Double returnPercentage) {
        this.historicalData = historicalData;
        this.latestPrice = latestPrice;
        this.metadata = metadata;
        this.period = period;
        this.returnPercentage = returnPercentage;
    }

    public List<HistoricalData> getHistoricalData() {
        return historicalData;
    }

    public void setHistoricalData(List<HistoricalData> historicalData) {
        this.historicalData = historicalData;
    }

    public Double getLatestPrice() {
        return latestPrice;
    }

    public void setLatestPrice(Double latestPrice) {
        this.latestPrice = latestPrice;
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Double getReturnPercentage() {
        return returnPercentage;
    }

    public void setReturnPercentage(Double returnPercentage) {
        this.returnPercentage = returnPercentage;
    }
}
