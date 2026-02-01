package org.example.portfolio_backend.services;

import org.example.portfolio_backend.entity.HistoricalDataEntity;
import org.example.portfolio_backend.entity.PortfolioEntity;
import org.example.portfolio_backend.model.DataReciever;
import org.example.portfolio_backend.model.HistoricalData;
import org.example.portfolio_backend.repo.HistoricalDataI;
import org.example.portfolio_backend.repo.PortfolioI;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class YFinanceClientService {

    private final RestClient restClient;
    private final PortfolioI portfolioRepoWrapper;
    private final HistoricalDataI historicalRepoWrapper;

    public YFinanceClientService(RestClient restClient,
                                 PortfolioI portfolioRepoWrapper,
                                 HistoricalDataI historicalRepoWrapper) {
        this.restClient = restClient;
        this.portfolioRepoWrapper = portfolioRepoWrapper;
        this.historicalRepoWrapper = historicalRepoWrapper;
    }

    /**
     * Original method used by Controller to fetch data from Python
     */
    public DataReciever fetchStockData(String ticker) {
        String url = "http://127.0.0.1:5000/stock/" + ticker;

        return restClient.get()
                .uri(url)
                .header("Accept-Encoding", "identity")
                .retrieve()
                .body(DataReciever.class);
    }

    /**
     * NEW METHOD: Takes the already-fetched data and saves it to the DB
     */
    public void saveFetchedHistoricalData(String ticker, DataReciever fetchedData) {
        if (fetchedData == null || fetchedData.getHistoricalData() == null || fetchedData.getHistoricalData().isEmpty()) {
            System.out.println("No historical data to save for: " + ticker);
            return;
        }

        // 1. Find the parent Portfolio item (Foreign Key reference)
        PortfolioEntity parent = portfolioRepoWrapper.getAllItems().stream()
                .filter(item -> item.getTicker().equalsIgnoreCase(ticker))
                .findFirst()
                .orElse(null);

        if (parent == null) {
            System.out.println("Cannot save history: Ticker " + ticker + " not found in Portfolio table.");
            return;
        }

        // 2. Map the List<HistoricalData> from the model to List<HistoricalDataEntity>
        List<HistoricalDataEntity> entities = fetchedData.getHistoricalData().stream()
                .map(data -> {
                    HistoricalDataEntity entity = new HistoricalDataEntity();
                    entity.setPortfolioItem(parent); // Set FK
                    entity.setTicker(parent.getTicker());
                    entity.setPriceDate(LocalDate.parse(data.getDate())); // Parses "yyyy-MM-dd"
                    entity.setOpenPrice(data.getOpen());
                    entity.setHighPrice(data.getHigh());
                    entity.setLowPrice(data.getLow());
                    entity.setClosePrice(data.getClose());
                    entity.setVolume(data.getVolume());
                    return entity;
                })
                .collect(Collectors.toList());

        // 3. Persist to DB
        historicalRepoWrapper.saveAllEntries(entities);
        System.out.println("Successfully saved " + entities.size() + " historical points for " + ticker);
    }
}