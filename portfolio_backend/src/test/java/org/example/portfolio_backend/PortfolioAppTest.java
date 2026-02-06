package org.example.portfolio_backend;



import org.example.portfolio_backend.entity.PortfolioEntity;
import org.example.portfolio_backend.model.DataReciever;
import org.example.portfolio_backend.model.DataSender;
import org.example.portfolio_backend.repo.PortfolioI;
import org.example.portfolio_backend.repo.StockMasterRepository;
import org.example.portfolio_backend.services.BalanceService;
import org.example.portfolio_backend.services.PortfolioApp;
import org.example.portfolio_backend.services.YFinanceClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioAppTest {

    @Mock
    private PortfolioI portfolioWrapper;
    @Mock
    private BalanceService balanceService;
    @Mock
    private StockMasterRepository stockMasterRepo;
    @Mock
    private YFinanceClientService yFinanceService;

    @InjectMocks
    private PortfolioApp portfolioApp;

    private DataSender testDto;
    private PortfolioEntity testEntity;

    @BeforeEach
    void setUp() {
        testDto = new DataSender();
        testDto.setTicker("AAPL");
        testDto.setQuantity(10);

        testEntity = new PortfolioEntity();
        testEntity.setId(1L);
        testEntity.setTicker("AAPL");
        testEntity.setQuantity(10);
        testEntity.setBuyPrice(150.0);
    }

    @Test
    @DisplayName("Attempt Purchase - Success: Price is fetched and funds are deducted")
    void testAttemptPurchase_Success() {
        // Mocking YFinance to return price of $150
        DataReciever mockReciever = new DataReciever();
        mockReciever.setLatestPrice(150.0);
        when(yFinanceService.fetchStockData("AAPL")).thenReturn(mockReciever);

        // Mocking balance check (10 shares * $150 = $1500)
        when(balanceService.deductFunds(1500.0)).thenReturn(true);

        boolean result = portfolioApp.attemptPurchase(testDto);

        assertTrue(result);
        assertEquals(150.0, testDto.getBuyPrice());
        verify(portfolioWrapper, times(1)).saveItem(any(PortfolioEntity.class));
    }

    @Test
    @DisplayName("Attempt Purchase - Failure: Insufficient funds")
    void testAttemptPurchase_InsufficientFunds() {
        DataReciever mockReciever = new DataReciever();
        mockReciever.setLatestPrice(150.0);
        when(yFinanceService.fetchStockData("AAPL")).thenReturn(mockReciever);

        // Return false for deduction
        when(balanceService.deductFunds(1500.0)).thenReturn(false);

        boolean result = portfolioApp.attemptPurchase(testDto);

        assertFalse(result);
        verify(portfolioWrapper, never()).saveItem(any());
    }

    @Test
    @DisplayName("Sell Investment - Full Sale: Record deleted and funds added")
    void testSellInvestment_FullSale() {
        when(portfolioWrapper.getItemById(1L)).thenReturn(testEntity);

        // Selling 10 shares at $200 (Profit = $50/share)
        Map<String, Object> result = portfolioApp.sellInvestment(1L, 200.0, 10);

        assertEquals(500.0, result.get("profitAmount")); // (200-150) * 10
        assertEquals(2000.0, result.get("sellValue"));  // 200 * 10

        verify(balanceService).addFunds(2000.0);
        verify(portfolioWrapper).deleteItem(1L);
    }

    @Test
    @DisplayName("Sell Investment - Partial Sale: Quantity reduced and saved")
    void testSellInvestment_PartialSale() {
        when(portfolioWrapper.getItemById(1L)).thenReturn(testEntity);

        // Selling only 4 shares
        portfolioApp.sellInvestment(1L, 200.0, 4);

        assertEquals(6, testEntity.getQuantity()); // 10 - 4
        verify(portfolioWrapper).saveItem(testEntity);
        verify(portfolioWrapper, never()).deleteItem(anyLong());
    }

    @Test
    @DisplayName("Sell Investment - Error: Sell more than owned")
    void testSellInvestment_InvalidQuantity() {
        when(portfolioWrapper.getItemById(1L)).thenReturn(testEntity);

        assertThrows(IllegalArgumentException.class, () -> {
            portfolioApp.sellInvestment(1L, 200.0, 15); // Own only 10
        });
    }
}
