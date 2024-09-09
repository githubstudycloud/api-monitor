package com.yourcompany.monitor.config;

import com.yourcompany.monitor.aspect.MonitorAspect;
import com.yourcompany.monitor.service.MonitorService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ConditionalOnProperty(name = "monitor.enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(MonitorProperties.class)
@Import(MonitorJpaConfig.class)
public class MonitorAutoConfiguration {

    @Bean
    @ConditionalOnProperty(name = "monitor.aop.enabled", havingValue = "true", matchIfMissing = true)
    public MonitorAspect monitorAspect(MonitorService monitorService) {
        return new MonitorAspect(monitorService);
    }
}