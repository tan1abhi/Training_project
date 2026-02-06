package org.example.portfolio_backend;

import org.example.portfolio_backend.apiController.ApiClientController;
import org.example.portfolio_backend.services.BalanceService;
import org.example.portfolio_backend.services.PortfolioApp;
import org.example.portfolio_backend.services.YFinanceClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PortfolioBackendApplicationTests {

    @Autowired
    private ApiClientController controller;

    @Autowired
    private PortfolioApp portfolioApp;

    @Autowired
    private BalanceService balanceService;

    @Autowired
    private YFinanceClientService yFinanceService;

    @Test
    void contextLoads() {
        // This test ensures the application starts and the context is created.
        // If it fails, check your application.properties and DB connection.
    }

    @Test
    void healthCheck() {
        // Assertions to verify that the critical beans are actually created by Spring
        // This proves that your @Service and @RestController annotations are working.
        assertThat(controller).isNotNull();
        assertThat(portfolioApp).isNotNull();
        assertThat(balanceService).isNotNull();
        assertThat(yFinanceService).isNotNull();
    }
}
