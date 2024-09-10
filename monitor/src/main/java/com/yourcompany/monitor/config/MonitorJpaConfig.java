package com.yourcompany.monitor.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@ConditionalOnProperty(name = "monitor.jpa.enabled", havingValue = "true", matchIfMissing = true)
@EnableJpaRepositories(
        basePackages = "com.yourcompany.monitor.repository",
        entityManagerFactoryRef = "monitorEntityManagerFactory",
        transactionManagerRef = "monitorTransactionManager"
)
public class MonitorJpaConfig {

    @Autowired
    private MonitorDataSourceSelector dataSourceSelector;

    @Bean
    public LocalContainerEntityManagerFactoryBean monitorEntityManagerFactory(EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(dataSourceSelector.getDataSource())
                .packages("com.yourcompany.monitor.model")
                .persistenceUnit("monitor")
                .build();
    }

    @Bean
    public PlatformTransactionManager monitorTransactionManager(
            LocalContainerEntityManagerFactoryBean monitorEntityManagerFactory) {
        return new JpaTransactionManager(monitorEntityManagerFactory.getObject());
    }
}