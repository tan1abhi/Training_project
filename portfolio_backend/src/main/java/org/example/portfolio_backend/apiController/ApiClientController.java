package org.example.portfolio_backend.apiController;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.portfolio_backend.entity.StockMaster; // Added Import
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
@CrossOrigin(origins = "http://localhost:3000")
 // Added base mapping for cleaner routing

public class ApiClientController {

    private final PortfolioApp portfolioService;
    private final YFinanceClientService yFinanceClientService;
    private final BalanceService balanceService;

    public ApiClientController(PortfolioApp portfolioService,
                               YFinanceClientService yFinanceClientService,
                               BalanceService balanceService) {
        this.portfolioService = portfolioService;
        this.yFinanceClientService = yFinanceClientService;
        this.balanceService = balanceService;
    }

    // =================================================================
    // MARKET DATA ENDPOINTS (NEW)
    // =================================================================

    /**
     * Fetch all available stocks and real-time prices from the StockMaster table.
     * This is what your React "Browse Stocks" page will call by default.
     */
    @GetMapping("/market/stocks")
    public ResponseEntity<List<StockMaster>> getMarketStocks() {
        return ResponseEntity.ok(portfolioService.getAvailableMarketStocks());
    }

    /**
     * Manually trigger a refresh of market data for specific tickers.
     */
    @PostMapping("/market")
    public ResponseEntity<String> syncMarket() {
        List<String> tickersToSync = List.of("AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "AVGO", "ORCL", "TSM", "ADBE",
                "ASML", "CRM", "AMD", "TXN", "INTC", "QCOM", "MU", "AMAT", "LRCX", "PANW",
                "SNPS", "CDNS", "KLAC", "IBM", "UBER", "NOW", "CSCO", "ACN", "INTU", "SAP",
                "ANET", "FI", "WDAY", "ROP", "ADSK", "TEAM", "DDOG", "MDB", "CRWD", "PLTR",

                // --- FINANCE & BANKING (51-100) ---
                "JPM", "BAC", "V", "MA", "WFC", "MS", "GS", "HSBC", "AXP", "PYPL",
                "BLK", "BX", "C", "PGR", "CB", "SCHW", "MMC", "SPGI", "MUFG", "UBS",
                "RY", "TD", "BN", "AON", "ICE", "CME", "MCO", "USB", "TFC", "MET",

                // --- HEALTHCARE & PHARMA (101-150) ---
                "LLY", "UNH", "NVO", "JNJ", "ABBV", "MRK", "TMO", "ABT", "PFE", "DHR",
                "AMGN", "ISRG", "SYK", "VRTX", "BMY", "REGN", "ZTS", "BSX", "GILD", "BDX",
                "HCA", "MCK", "CVS", "COR", "CI", "HUM", "AZN", "SNY", "GSK", "MDT",

                // --- CONSUMER DISCRETIONARY & RETAIL (151-200) ---
                "TSLA", "AMZN", "HD", "MCD", "NKE", "LOW", "SBUX", "TJX", "BKNG", "OR",
                "LVMUY", "NKE", "TM", "HMC", "F", "GM", "RIVN", "LCID", "MAR", "HLT",
                "YUM", "CMG", "LULU", "AZO", "ORLY", "TGT", "EBAY", "MELI", "BABA", "PDD",

                // --- CONSUMER STAPLES (201-250) ---
                "WMT", "PG", "COST", "KO", "PEP", "PM", "EL", "CL", "MO", "KMB",
                "TGT", "DG", "DLTR", "ADM", "TSN", "STZ", "BUD", "DEO", "UL", "NESN",

                // --- ENERGY & UTILITIES (251-300) ---
                "XOM", "CVX", "SHEL", "TTE", "COP", "BP", "EQNR", "E", "SLB", "VLO",
                "NEE", "DUK", "SO", "D", "AEP", "EXC", "PCG", "SRE", "ETN", "GE",

                // --- INDUSTRIAL, MATERIALS & REAL ESTATE (301-400) ---
                "CAT", "DE", "HON", "UPS", "LMT", "RTX", "BA", "UNP", "FDX", "MMM",
                "LIN", "APD", "SHW", "NUE", "FCX", "PLD", "AMT", "EQIX", "CCI", "WY",
                "SPG", "DLR", "VICI", "O", "PSA", "CBRE", "IR", "EMR", "ITW", "ETN");

        try {
            System.out.println("DEBUG: Starting manual market sync for: " + tickersToSync);

            portfolioService.syncMarketData(tickersToSync);

            return ResponseEntity.ok("Market data sync successful for: " + tickersToSync);

        } catch (Exception e) {
            // This will print the full error stack trace in your IntelliJ/Eclipse console
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Sync failed! Error: " + e.getMessage() +
                            ". Check if the Python bridge is running at the correct URL.");
        }
    }

    // =================================================================
    // BALANCE ENDPOINTS
    // =================================================================

    @GetMapping("/balance")
    public Double getBalance() {
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

    @PostMapping("/investment/sell/{id}")
    public ResponseEntity<?> sellStock(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            DataSender investment = portfolioService.getInvestmentById(id);
            if (investment == null) return ResponseEntity.notFound().build();

            // Fetch real-time price
            DataReciever liveData = yFinanceClientService.fetchStockData(investment.getTicker());
            Double currentMarketPrice = liveData.getLatestPrice();

            // Execute partial sell logic
            Map<String, Object> result = portfolioService.sellInvestment(id, currentMarketPrice, quantity);

            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Sell failed: " + e.getMessage());
        }
    }

    @PostMapping("/investment/addnew")
    public ResponseEntity<?> addNewInvestment(@RequestBody DataSender newInvestment) {
        if (newInvestment == null || newInvestment.getTicker() == null || newInvestment.getTicker().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ticker is required"));
        }

        String ticker = newInvestment.getTicker().trim().toUpperCase();

        DataReciever fetchedData;
        try {
            fetchedData = yFinanceClientService.fetchStockData(ticker);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("message", "External API Error"));
        }

        DataSender dto = buildDataSender(ticker, newInvestment.getQuantity(), newInvestment.getNotes(), newInvestment.getTargetSellPrice(), fetchedData);

        if (portfolioService.attemptPurchase(dto)) {
            yFinanceClientService.saveFetchedHistoricalData(ticker, fetchedData);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("status", "success", "ticker", ticker));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Insufficient Balance"));
        }
    }

    private DataSender buildDataSender(String ticker, Integer quantity, String notes, Double targetSellPrice, DataReciever fetchedData) {
        DataSender dto = new DataSender();
        dto.setTicker(ticker);
        dto.setQuantity(quantity);
        dto.setNotes(notes);
        dto.setTargetSellPrice(targetSellPrice);
        dto.setBuyPrice(fetchedData != null ? fetchedData.getLatestPrice() : 0.0);
        dto.setAssetType("STOCK");
        dto.setRiskLabel("LOW");
        dto.setPurchaseDate(LocalDateTime.now());

        if (fetchedData != null && fetchedData.getMetadata() != null) {
            dto.setSector(fetchedData.getMetadata().getSector());
            dto.setCurrency(fetchedData.getMetadata().getCurrency());
        }
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

    @PostMapping("/portfolio/analyze-risk")
    public ResponseEntity<Object> analyzePortfolioRisk(@RequestBody Map<String, Object> payload) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonInput = mapper.writeValueAsString(payload);
            ProcessBuilder pb = new ProcessBuilder("python3", "../risk_analysis/risk_analysis.py", jsonInput);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) { output.append(line); }
            process.waitFor();
            return ResponseEntity.ok(mapper.readTree(output.toString()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Analysis failed: " + e.getMessage());
        }
    }
}