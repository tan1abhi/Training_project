// java
package org.example.portfolio_backend.model;

public class AmountRequest {
    private Double amount;

    public AmountRequest() {}

    public AmountRequest(Double amount) {
        this.amount = amount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}