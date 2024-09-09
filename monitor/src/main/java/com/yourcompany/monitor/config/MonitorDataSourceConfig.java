package com.yourcompany.monitor.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class MonitorDataSourceConfig {

    @Bean
    @ConditionalOnMissingBean(name = "monitorDataSource")
    @ConditionalOnProperty(name = "monitor.datasource.enabled", havingValue = "true", matchIfMissing = true)
    @ConfigurationProperties("monitor.datasource")
    public DataSource monitorDataSource() {
        return new HikariDataSource();
    }

    @Bean
    @Primary
    @ConditionalOnMissingBean(name = "dataSource")
    @ConfigurationProperties("spring.datasource")
    public DataSource primaryDataSource() {
        return new HikariDataSource();
    }

    @Bean
    @ConditionalOnMissingBean
    public MonitorDataSourceSelector monitorDataSourceSelector(
            @Qualifier("monitorDataSource") DataSource monitorDataSource,
            @Qualifier("dataSource") DataSource primaryDataSource) {
        return new MonitorDataSourceSelector(monitorDataSource, primaryDataSource);
    }
}
