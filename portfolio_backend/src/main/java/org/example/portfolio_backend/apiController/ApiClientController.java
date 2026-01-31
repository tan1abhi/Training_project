package org.example.portfolio_backend.apiController;

import org.example.portfolio_backend.model.DataSender;
import org.springframework.web.bind.annotation.*;

@RestController
public class ApiClientController {
    @GetMapping("/investments")
    public String getInvestments(){
        return "investment list";
    }

    @GetMapping("/investments/{id}")
    public String getInvestmentsById(@PathVariable long id){
        return "Investment by ID";
    }

    @GetMapping("/investments/{sector}")
    public String getInvestmentsBySector(@PathVariable String sector){
        return "Investmet by sector";
    }

    @GetMapping("/investments/{type}")
    public String getInvestmentsByType(@PathVariable String type){
        return "Investment by type";
    }

    @GetMapping("/investments/{risk}")
    public String getInvestmentsByRisk(@PathVariable String risk){
        return "Investment by risk";
    }

    @GetMapping("/investments/{curr}")
    public String getInvestmentsByCurr(@PathVariable String curr){
        return "Investment by curr";
    }

    @PostMapping("/investment/addnew")
    public void addNewInvestment(){
        return;
    }

    @PutMapping("/investment/{id}")
    public void editInvestmentById(@PathVariable long id){
        return;
    }

    @DeleteMapping("/investment/{id}")
    public void deleteInvestmentById(@PathVariable long id){
        return;
    }

}
