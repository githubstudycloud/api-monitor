package com.yourcompany.apimonitor.core.config;

import com.yourcompany.apimonitor.core.aspect.ApiMonitorAspect;
import com.yourcompany.apimonitor.core.service.ApiMonitorService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "api-monitor", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(ApiMonitorProperties.class)
public class ApiMonitorAutoConfiguration {

    @Bean
    public ApiMonitorAspect apiMonitorAspect(ApiMonitorProperties properties, ApiMonitorService apiMonitorService) {
        return new ApiMonitorAspect(properties, apiMonitorService);
    }

    @Bean
    public ApiMonitorService apiMonitorService() {
        return new ApiMonitorService();
    }
}