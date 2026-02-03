import axios from 'axios';

// Base URL for your Spring Boot Backend
const BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const api = {
    // GET /balance
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
    analyzeRisk: (portfolioData) => apiClient.post('/portfolio/analyze-risk', portfolioData)
};