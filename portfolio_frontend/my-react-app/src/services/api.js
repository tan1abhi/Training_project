import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const api = {
    // GET /balance
    
    getInvestmentById: (id) =>
    apiClient.get(`/investments/id/${id}`),

    // GET /investments/sector/{sector}
    getInvestmentsBySector: (sector) =>
        apiClient.get(`/investments/sector/${sector}`),

    // GET /investments/ticker/{ticker}
    getInvestmentsByTicker: (ticker) =>
        apiClient.get(`/investments/ticker/${ticker}`),

    // GET /investments/type/{type}
    getInvestmentsByType: (type) =>
        apiClient.get(`/investments/type/${type}`),

    // GET /investments/risk/{risk}
    getInvestmentsByRisk: (risk) =>
        apiClient.get(`/investments/risk/${risk}`),

    // GET /investments/curr/{curr}
    getInvestmentsByCurr: (currency) =>
        apiClient.get(`/investments/curr/${currency}`),

    getBalance: () => apiClient.get('/balance'),

    // POST /balance/update - Sends AmountRequest object
    updateBalance: (amount) => apiClient.post('/balance/update', { amount }),

    // GET /investments
    getInvestments: () => apiClient.get('/investments'),

    // POST /investment/addnew - Sends DataSender object
    addInvestment: (investmentData) => apiClient.post('/investment/addnew', investmentData),

    // DELETE /investment/{id}
    deleteInvestment: (id) => apiClient.delete(`/investment/${id}`),

    // POST /portfolio/analyze-risk
    analyzeRisk: (portfolioData) => apiClient.post('/portfolio/analyze-risk', portfolioData),

    sellStock: (id, quantity) =>
        apiClient.post(`/investment/sell/${id}`, null, {
            params: { quantity }
        }),

    getBrowseStocks: () => apiClient.get('/market/stocks'),

    // GET /market/history/{ticker}
    getStockHistory: (ticker) =>
        apiClient.get(`/market/history/${ticker.toUpperCase()}`),

};
