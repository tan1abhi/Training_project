package org.example.portfolio_backend.services;

import org.example.portfolio_backend.model.DataReciever;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class YFinanceClientService {

    private final RestClient restClient;

    public YFinanceClientService(RestClient restClient) {
        this.restClient = restClient;
    }

    public DataReciever fetchStockData(String ticker) {

        String url = "http://127.0.0.1:5000/stock/" + ticker;

        return restClient.get()
                .uri(url)
                .header("Accept-Encoding", "identity")
                .retrieve()
                .body(DataReciever.class);
    }
}
