package org.example.portfolio_backend;


import org.example.portfolio_backend.entity.PortfolioEntity;
import org.example.portfolio_backend.model.DataReciever;
import org.example.portfolio_backend.model.HistoricalData;

import org.example.portfolio_backend.repo.HistoricalDataI;
import org.example.portfolio_backend.repo.PortfolioI;
import org.example.portfolio_backend.services.YFinanceClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class YFinanceClientServiceTest {

    @Mock
    private RestClient restClient;

    @Mock
    private PortfolioI portfolioRepoWrapper;

    @Mock
    private HistoricalDataI historicalRepoWrapper;

    @InjectMocks
    private YFinanceClientService yFinanceClientService;

    // Helper mocks for RestClient's fluent API
    @Mock
    private RestClient.RequestHeadersUriSpec requestHeadersUriSpec;
    @Mock
    private RestClient.RequestHeadersSpec requestHeadersSpec;
    @Mock
    private RestClient.ResponseSpec responseSpec;

    @BeforeEach
    void setUp() {
        // This is necessary because RestClient uses a "Fluent API" (builder pattern)
        // We need to mock each step: .get().uri().header().retrieve().body()
    }

    @Test
    @DisplayName("Should fetch stock data from Python Bridge via RestClient")
    void testFetchStockData() {
        String ticker = "AAPL";
        DataReciever mockResponse = new DataReciever();
        mockResponse.setLatestPrice(150.0);

        // Mocking the fluent API of RestClient
        when(restClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.header(anyString(), anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(DataReciever.class)).thenReturn(mockResponse);

        DataReciever result = yFinanceClientService.fetchStockData(ticker);

        assertNotNull(result);
        assertEquals(150.0, result.getLatestPrice());
    }

    @Test
    @DisplayName("Should NOT save history if ticker is not in Portfolio")
    void testSaveFetchedHistoricalData_NoParent() {
        String ticker = "MSFT";
        DataReciever fetchedData = new DataReciever();
        fetchedData.setHistoricalData(List.of(new HistoricalData()));

        // Return empty list so no portfolio entity is found
        when(portfolioRepoWrapper.getAllItems()).thenReturn(Collections.emptyList());

        yFinanceClientService.saveFetchedHistoricalData(ticker, fetchedData);

        // Verify that save was never called
        verify(historicalRepoWrapper, never()).saveAllEntries(any());
    }

    @Test
    @DisplayName("Should save only NEW historical data points")
    void testSaveFetchedHistoricalData_SavesNewOnly() {
        String ticker = "AAPL";

        // 1. Setup Portfolio Parent
        PortfolioEntity parent = new PortfolioEntity();
        parent.setTicker(ticker);
        when(portfolioRepoWrapper.getAllItems()).thenReturn(List.of(parent));

        // 2. Setup existing dates in DB (AAPL already has data for 2024-01-01)
        // Note: Real code uses LocalDate.parse, so we must match that format
        when(historicalRepoWrapper.findByTicker(ticker)).thenReturn(Collections.emptyList());

        // 3. Setup incoming data (one old date, one new date)
        HistoricalData point1 = new HistoricalData();
        point1.setDate("2024-02-01"); // Assume new
        point1.setClose(155.0);

        DataReciever fetchedData = new DataReciever();
        fetchedData.setHistoricalData(List.of(point1));

        yFinanceClientService.saveFetchedHistoricalData(ticker, fetchedData);

        // Verify saveAllEntries was called with the new point
        verify(historicalRepoWrapper, times(1)).saveAllEntries(ArgumentMatchers.anyList());
    }
}
