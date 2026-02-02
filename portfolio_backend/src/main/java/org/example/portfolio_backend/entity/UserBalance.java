package org.example.portfolio_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_balance")
public class UserBalance {

    @Id
    private Long id = 1L; // Always 1 for a single-user system

    @Column(nullable = false)
    private Double balance;

    public UserBalance() {}

    public UserBalance(Double balance) {
        this.balance = balance;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
}
