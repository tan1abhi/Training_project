package org.example.portfolio_backend;

import org.example.portfolio_backend.entity.UserBalance;
import org.example.portfolio_backend.repo.BalanceI;
import org.example.portfolio_backend.services.BalanceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BalanceServiceTest {

    @Mock
    private BalanceI balanceRepoWrapper;

    @InjectMocks
    private BalanceService balanceService;

    private UserBalance mockUserBalance;

    @BeforeEach
    void setUp() {
        mockUserBalance = new UserBalance();
        mockUserBalance.setBalance(1000.0);
    }

    @Test
    @DisplayName("Should return the current balance correctly")
    void testGetCurrentBalance() {
        when(balanceRepoWrapper.getBalance()).thenReturn(mockUserBalance);

        Double balance = balanceService.getCurrentBalance();

        assertEquals(1000.0, balance);
        verify(balanceRepoWrapper, times(1)).getBalance();
    }

    @Test
    @DisplayName("Should top up balance when amount is positive")
    void testTopUpBalance_Success() {
        when(balanceRepoWrapper.getBalance()).thenReturn(mockUserBalance);

        balanceService.topUpBalance(500.0);

        verify(balanceRepoWrapper).updateBalance(1500.0);
    }

    @Test
    @DisplayName("Should throw exception when top up amount is negative")
    void testTopUpBalance_NegativeAmount() {
        assertThrows(IllegalArgumentException.class, () -> {
            balanceService.topUpBalance(-50.0);
        });
        verify(balanceRepoWrapper, never()).updateBalance(anyDouble());
    }

    @Test
    @DisplayName("Should deduct funds when balance is sufficient")
    void testDeductFunds_Success() {
        when(balanceRepoWrapper.getBalance()).thenReturn(mockUserBalance);

        boolean result = balanceService.deductFunds(400.0);

        assertTrue(result);
        verify(balanceRepoWrapper).updateBalance(600.0);
    }

    @Test
    @DisplayName("Should return false when funds are insufficient for deduction")
    void testDeductFunds_InsufficientFunds() {
        when(balanceRepoWrapper.getBalance()).thenReturn(mockUserBalance);

        boolean result = balanceService.deductFunds(2000.0);

        assertFalse(result);
        verify(balanceRepoWrapper, never()).updateBalance(anyDouble());
    }

    @Test
    @DisplayName("Should add funds correctly via addFunds method")
    void testAddFunds_Success() {
        when(balanceRepoWrapper.getBalance()).thenReturn(mockUserBalance);

        balanceService.addFunds(250.0);

        verify(balanceRepoWrapper).updateBalance(1250.0);
    }
}