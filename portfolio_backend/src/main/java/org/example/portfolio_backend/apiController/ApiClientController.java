package org.example.portfolio_backend.apiController;
import org.example.portfolio_backend.model.DataReciever;
import org.example.portfolio_backend.model.DataSender;
import org.example.portfolio_backend.services.PortfolioApp;
import org.example.portfolio_backend.services.YFinanceClientService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class ApiClientController {

    private final PortfolioApp portfolioService;
    private final YFinanceClientService yFinanceClientService;


    public ApiClientController(PortfolioApp portfolioService, YFinanceClientService yFinanceClientService) {
        this.portfolioService = portfolioService;
        this.yFinanceClientService = yFinanceClientService;
    }

    @GetMapping("/investments")
    public List<DataSender> getInvestments(){
        return portfolioService.getAllInvestments();
    }

    @GetMapping("/investments/id/{id}")
    public DataSender getInvestmentsById(@PathVariable long id){
        return portfolioService.getInvestmentById(id);
    }

    @GetMapping("/investments/sector/{sector}")
    public List<DataSender> getInvestmentsBySector(@PathVariable String sector){
        return portfolioService.getInvestmentsBySector(sector);
    }

    @GetMapping("/investments/ticker/{ticker}")
    public List<DataSender> getInvestmentsByTicker(@PathVariable String ticker){
        return portfolioService.getInvestmentsByTicker(ticker);
    }

    @GetMapping("/investments/type/{type}")
    public List<DataSender> getInvestmentsByType(@PathVariable String type){
        return portfolioService.getInvestmentsByType(type);
    }

    @GetMapping("/investments/risk/{risk}")
    public List<DataSender> getInvestmentsByRisk(@PathVariable String risk){
        return portfolioService.getInvestmentsByRisk(risk);
    }

    @GetMapping("/investments/curr/{curr}")
    public List<DataSender> getInvestmentsByCurr(@PathVariable String curr){
        return portfolioService.getInvestmentsByCurr(curr);
    }

    @GetMapping("/investments/total-value")
    public Double getTotalPortfolioValue() {
        return portfolioService.getTotalPortfolioValue();
    }

    @GetMapping("/investments/high-risk")
    public List<DataSender> getHighRiskAlerts() {
        return portfolioService.getHighRiskAlerts();
    }

    @PostMapping("/investment/addnew")
    public void addNewInvestment(@RequestBody DataSender newInvestment){
        if (newInvestment == null || newInvestment.getTicker() == null || newInvestment.getTicker().isBlank()
                || newInvestment.getQuantity() == null) {
            return;
        }

        String ticker = newInvestment.getTicker().trim().toUpperCase();
        Integer quantity = newInvestment.getQuantity();

        DataReciever fetchedData = null;
        try {
            fetchedData = yFinanceClientService.fetchStockData(ticker);
        } catch (Exception ignored) {
            // Keep fetchedData null and fall back to defaults
        }

        assert fetchedData != null;
        DataSender dto = buildDataSender(ticker, quantity, fetchedData);
        portfolioService.addNewInvestment(dto);
        yFinanceClientService.saveFetchedHistoricalData(ticker, fetchedData);
    }


    private DataSender buildDataSender(String ticker, Integer quantity, DataReciever fetchedData) {
        DataSender dto = new DataSender();
        dto.setTicker(ticker);
        dto.setQuantity(quantity);

        // buyPrice from fetched data if available
        Double latestPrice = null;
        try {
            latestPrice = fetchedData.getLatestPrice();
        } catch (Exception ignored) { /* ignore */ }
        dto.setBuyPrice(latestPrice != null ? latestPrice : 0.0);
        dto.setAssetType("STOCK"); // default
        if (fetchedData.getMetadata() != null) {
            var meta = fetchedData.getMetadata();

            if (meta.getSector() != null && !meta.getSector().isBlank()) {
                dto.setSector(meta.getSector());
            } else if (meta.getIndustry() != null && !meta.getIndustry().isBlank()) {
                dto.setSector(meta.getIndustry());
            }
            if (meta.getCurrency() != null && !meta.getCurrency().isBlank()) {
                dto.setCurrency(meta.getCurrency());
            }
        }
        dto.setRiskLabel(null);

        // Set purchase date to now
        dto.setPurchaseDate(LocalDateTime.now());

        dto.setTargetSellPrice(null);
        dto.setStopLossPrice(null);
        dto.setNotes(null);
        return dto;
    }

    @PutMapping("/investment/{id}")
    public void editInvestmentById(@PathVariable long id , @RequestBody DataSender updatedInvestment){
        portfolioService.updateInvestment(updatedInvestment);
    }

    @DeleteMapping("/investment/{id}")
    public void deleteInvestmentById(@PathVariable long id){
        portfolioService.deleteInvestmentById(id);
    }

    @DeleteMapping("/investments/delete-all")
    public void deleteAllInvestments() {
        portfolioService.deleteAllInvestments();
    }

}
