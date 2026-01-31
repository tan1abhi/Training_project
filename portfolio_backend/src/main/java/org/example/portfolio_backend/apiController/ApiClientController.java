package org.example.portfolio_backend.apiController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiClientController {
    @GetMapping("/hello")
    public String test(){
        return "hello";
    }

}
