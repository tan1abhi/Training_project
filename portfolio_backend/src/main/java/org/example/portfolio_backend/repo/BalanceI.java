package org.example.portfolio_backend.repo;

import org.example.portfolio_backend.entity.UserBalance;
import org.springframework.stereotype.Repository;

@Repository
public class BalanceI {
    private final BalanceRepo repository;

    public BalanceI(BalanceRepo repository) {
        this.repository = repository;
    }

    public UserBalance getBalance() {
        // Find ID 1 or create it with 0 if it doesn't exist
        return repository.findById(1L).orElseGet(() -> repository.save(new UserBalance(0.0)));
    }

    public void updateBalance(Double newBalance) {
        UserBalance ub = getBalance();
        ub.setBalance(newBalance);
        repository.save(ub);
    }
}
