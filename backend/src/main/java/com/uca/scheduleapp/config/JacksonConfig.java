package com.uca.scheduleapp.config;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {
    @Bean
    public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
        PropertyNamingStrategy strategy = PropertyNamingStrategies.SNAKE_CASE;
        return new Jackson2ObjectMapperBuilder()
                .propertyNamingStrategy(strategy);
    }
}

