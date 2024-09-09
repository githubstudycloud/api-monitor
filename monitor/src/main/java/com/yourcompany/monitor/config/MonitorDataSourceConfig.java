package com.yourcompany.monitor.config;


import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(name = "monitor.datasource.enabled", havingValue = "true")
@EnableConfigurationProperties(MonitorProperties.class)
public class MonitorDataSourceConfig {

//    @Bean
//    public DataSource monitorDataSource(MonitorProperties properties) {
//        HikariDataSource dataSource = new HikariDataSource();
//        MonitorProperties.DataSourceConfig config = properties.getDataSource();
//
//        dataSource.setJdbcUrl(config.getUrl());
//        dataSource.setUsername(config.getUsername());
//        dataSource.setPassword(config.getPassword());
//        dataSource.setDriverClassName(config.getDriverClassName());
//
//        dataSource.setMaximumPoolSize(config.getMaxPoolSize());
//        dataSource.setMinimumIdle(config.getMinIdle());
//        dataSource.setConnectionTimeout(config.getConnectionTimeout());
//
//        return dataSource;
//    }
    @Bean
    @ConfigurationProperties("monitor.datasource")
    public DataSourceProperties monitorDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource monitorDataSource() {
        return monitorDataSourceProperties().initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }
}