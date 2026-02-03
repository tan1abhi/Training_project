package org.example.portfolio_backend.apiController;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    public ResponseEntity<?> addNewInvestment(@RequestBody DataSender newInvestment) {

        // 1️⃣ Validate request
        if (newInvestment == null
                || newInvestment.getTicker() == null
                || newInvestment.getTicker().isBlank()
                || newInvestment.getQuantity() == null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "status", "error",
                            "message", "Missing required fields (ticker / quantity)"
                    ));
        }

        String ticker = newInvestment.getTicker().trim().toUpperCase();
        Integer quantity = newInvestment.getQuantity();
        String notes = newInvestment.getNotes();
        Double targetSellPrice = newInvestment.getTargetSellPrice();

        // 2️⃣ Fetch external stock data
        DataReciever fetchedData;
        try {
            fetchedData = yFinanceClientService.fetchStockData(ticker);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to fetch stock data",
                            "ticker", ticker
                    ));
        }

        if (fetchedData == null) {
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of(
                            "status", "error",
                            "message", "External data unavailable",
                            "ticker", ticker
                    ));
        }

        // 3️⃣ Build DTO
        DataSender dto = buildDataSender(
                ticker,
                quantity,
                notes,
                targetSellPrice,
                fetchedData
        );

        // 4️⃣ Attempt transactional purchase
        boolean success;
        try {
            success = portfolioService.attemptPurchase(dto);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Internal error while processing investment"
                    ));
        }

        // 5️⃣ Final response
        if (!success) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "status", "error",
                            "message", "Insufficient balance to complete purchase"
                    ));
        }

        // 6️⃣ Save history (non-blocking)
        try {
            yFinanceClientService.saveFetchedHistoricalData(ticker, fetchedData);
        } catch (Exception ignored) {
            // history failure should NOT fail investment
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "status", "success",
                        "message", "Investment added successfully",
                        "ticker", ticker,
                        "quantity", quantity
                ));
    }

    private DataSender buildDataSender(String ticker, Integer quantity, String notes, Double setTargetSellPrice ,  DataReciever fetchedData) {
        DataSender dto = new DataSender();
        dto.setTicker(ticker);
        dto.setQuantity(quantity);
        dto.setNotes(notes);
        dto.setTargetSellPrice(setTargetSellPrice);

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
        dto.setStopLossPrice(0.00);
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

