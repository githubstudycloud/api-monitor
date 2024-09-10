package com.yourcompany.monitor.config;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Primary
    @Bean(name = "dataSource")
    @ConfigurationProperties("spring.datasource")
    public DataSource primaryDataSource() {
        return new BasicDataSource();
    }

    @Bean(name = "monitorDataSource")
    @ConditionalOnProperty(name = "monitor.datasource.enabled", havingValue = "true")
    @ConfigurationProperties("monitor.datasource")
    public DataSource monitorDataSource() {
        return new BasicDataSource();
    }

    @Bean
    public MonitorDataSourceSelector monitorDataSourceSelector(
            @Qualifier("dataSource") DataSource primaryDataSource,
            @Autowired(required = false) @Qualifier("monitorDataSource") DataSource monitorDataSource) {
        return new MonitorDataSourceSelector(primaryDataSource, monitorDataSource);
    }
}