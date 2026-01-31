package org.example.portfolio_backend.apiController;

import org.example.portfolio_backend.model.DataSender;
import org.example.portfolio_backend.services.PortfolioApp;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApiClientController {

    private final PortfolioApp portfolioService;

    public ApiClientController(PortfolioApp portfolioService) {
        this.portfolioService = portfolioService;
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

    @GetMapping("/investments/{type}")
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
        portfolioService.addNewInvestment(newInvestment);
    }

    @PutMapping("/investment/{id}")
    public void editInvestmentById(@PathVariable long id , @RequestBody DataSender updatedInvestment){
        portfolioService.updateInvestment(updatedInvestment);
    }

    @DeleteMapping("/investment/{id}")
    public void deleteInvestmentById(@PathVariable long id){
        portfolioService.deleteInvestmentById(id);
        return;
    }

}
