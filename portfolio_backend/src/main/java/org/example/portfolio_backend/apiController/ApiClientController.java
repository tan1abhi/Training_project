package org.example.portfolio_backend.apiController;

import org.example.portfolio_backend.model.AmountRequest;
import org.example.portfolio_backend.model.DataReciever;
import org.example.portfolio_backend.model.DataSender;
import org.example.portfolio_backend.services.BalanceService;
import org.example.portfolio_backend.services.PortfolioApp;
import org.example.portfolio_backend.services.YFinanceClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class ApiClientController {

    private final PortfolioApp portfolioService;
    private final YFinanceClientService yFinanceClientService;
    private final BalanceService balanceService; // 1. Injected BalanceService

    // 2. Updated Constructor to include BalanceService
    public ApiClientController(PortfolioApp portfolioService,
                               YFinanceClientService yFinanceClientService,
                               BalanceService balanceService) {
        this.portfolioService = portfolioService;
        this.yFinanceClientService = yFinanceClientService;
        this.balanceService = balanceService;
    }

    // =================================================================
    // BALANCE ENDPOINTS
    // =================================================================

    @GetMapping("/balance")
    public Double getBalance() {
        // 3. Directly using the balanceService object
        return balanceService.getCurrentBalance();
    }

    @PostMapping("/balance/update")
    public ResponseEntity<String> updateBalance(@RequestBody AmountRequest payload) {
        Double amount = payload == null ? null : payload.getAmount();
        if (amount == null) {
            return ResponseEntity.badRequest().body("Missing 'amount' in JSON body");
        }
        try {
            balanceService.topUpBalance(amount);
            return ResponseEntity.ok("Success: Balance updated by " + amount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // =================================================================
    // INVESTMENT ENDPOINTS
    // =================================================================

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
    public String addNewInvestment(@RequestBody DataSender newInvestment){
        if (newInvestment == null || newInvestment.getTicker() == null || newInvestment.getTicker().isBlank()
                || newInvestment.getQuantity() == null) {
            return "Error: Missing required fields.";
        }

        String ticker = newInvestment.getTicker().trim().toUpperCase();
        Integer quantity = newInvestment.getQuantity();

        DataReciever fetchedData = null;
        try {
            fetchedData = yFinanceClientService.fetchStockData(ticker);
        } catch (Exception ignored) {
            return "Error: Could not fetch stock data for " + ticker;
        }

        if (fetchedData == null) return "Error: External data unavailable.";

        DataSender dto = buildDataSender(ticker, quantity, fetchedData);

        // --- THE TRANSACTIONAL LOGIC ---
        // portfolioService.attemptPurchase handles the deduction via balanceService internally
        boolean success = portfolioService.attemptPurchase(dto);

        if (success) {
            yFinanceClientService.saveFetchedHistoricalData(ticker, fetchedData);
            return "Success: Investment added and balance deducted.";
        } else {
            return "Error: Insufficient balance to complete purchase.";
        }
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
        dto.setAssetType("STOCK");

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

        dto.setRiskLabel("LOW");
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

    @PostMapping("/portfolio/analyze-risk")
    public ResponseEntity<Object> analyzePortfolioRisk(@RequestBody Map<String, Object> payload) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonInput = mapper.writeValueAsString(payload);

            ProcessBuilder pb = new ProcessBuilder(
                    "python3",
                    "../risk_analysis/risk_analysis.py",
                    jsonInput
            );

            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Python error: " + output);
            }

            return ResponseEntity.ok(mapper.readTree(output.toString()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Risk analysis failed: " + e.getMessage());
        }
    }
}

