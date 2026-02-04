package org.example.portfolio_backend.services;

import org.example.portfolio_backend.entity.UserBalance;
import org.example.portfolio_backend.repo.BalanceI;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BalanceService {

    private final BalanceI balanceRepoWrapper;

    public BalanceService(BalanceI balanceRepoWrapper) {
        this.balanceRepoWrapper = balanceRepoWrapper;
    }

    public Double getCurrentBalance() {
        return balanceRepoWrapper.getBalance().getBalance();
    }

    @Transactional
    public void topUpBalance(Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Top-up amount must be positive");
        }
        Double newBalance = getCurrentBalance() + amount;
        balanceRepoWrapper.updateBalance(newBalance);
    }

    @Transactional
    public boolean deductFunds(Double cost) {
        Double current = getCurrentBalance();
        if (current >= cost) {
            balanceRepoWrapper.updateBalance(current - cost);
            return true;
        }
        return false;
    }

    // Add this method to BalanceService.java
    @Transactional
    public void addFunds(Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount to add must be positive");
        }
        Double newBalance = getCurrentBalance() + amount;
        balanceRepoWrapper.updateBalance(newBalance);
    }
}