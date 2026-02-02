package org.example.portfolio_backend.services;

import org.example.portfolio_backend.entity.HistoricalDataEntity;
import org.example.portfolio_backend.entity.PortfolioEntity;
import org.example.portfolio_backend.model.DataReciever;
import org.example.portfolio_backend.model.HistoricalData;
import org.example.portfolio_backend.repo.HistoricalDataI;
import org.example.portfolio_backend.repo.HistoricalDataRepository;
import org.example.portfolio_backend.repo.PortfolioI;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
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
    public List<HistoricalDataEntity> findByTicker(String ticker) {
        return historicalRepoWrapper.findByTicker(ticker);
    }

    public void saveFetchedHistoricalData(String ticker, DataReciever fetchedData) {

        if (fetchedData == null || fetchedData.getHistoricalData() == null
                || fetchedData.getHistoricalData().isEmpty()) {
            System.out.println("No historical data to save for: " + ticker);
            return;
        }

        // 1️⃣ Find parent portfolio entity
        PortfolioEntity parent = portfolioRepoWrapper.getAllItems().stream()
                .filter(item -> item.getTicker().equalsIgnoreCase(ticker))
                .findFirst()
                .orElse(null);

        if (parent == null) {
            System.out.println("Cannot save history: Ticker " + ticker + " not found in Portfolio table.");
            return;
        }

        // 2️⃣ Fetch existing history dates for this ticker
        Set<LocalDate> existingDates = historicalRepoWrapper.findByTicker(ticker)
                .stream()
                .map(HistoricalDataEntity::getPriceDate)
                .collect(Collectors.toSet());

        // 3️⃣ Map ONLY new historical entries
        List<HistoricalDataEntity> entities = fetchedData.getHistoricalData().stream()
                .filter(data -> {
                    LocalDate date = LocalDate.parse(data.getDate());
                    return !existingDates.contains(date);
                })
                .map(data -> {
                    HistoricalDataEntity entity = new HistoricalDataEntity();
                    entity.setTicker(parent.getTicker());
                    entity.setPriceDate(LocalDate.parse(data.getDate()));
                    entity.setOpenPrice(data.getOpen());
                    entity.setHighPrice(data.getHigh());
                    entity.setLowPrice(data.getLow());
                    entity.setClosePrice(data.getClose());
                    entity.setVolume(data.getVolume());
                    return entity;
                })
                .collect(Collectors.toList());

        // 4️⃣ Persist only if new data exists
        if (entities.isEmpty()) {
            System.out.println("No new historical data to insert for " + ticker);
            return;
        }

        historicalRepoWrapper.saveAllEntries(entities);
        System.out.println("Saved " + entities.size() + " NEW historical points for " + ticker);
    }


}