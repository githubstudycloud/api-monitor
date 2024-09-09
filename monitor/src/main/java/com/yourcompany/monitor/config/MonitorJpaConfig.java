package com.yourcompany.monitor.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(name = "monitor.datasource.enabled", havingValue = "true")
@EnableJpaRepositories(
        basePackages = "com.yourcompany.monitor.repository",
        entityManagerFactoryRef = "monitorEntityManagerFactory",
        transactionManagerRef = "monitorTransactionManager"
)
//@EntityScan("com.yourcompany.monitor.model")
//@EnableJpaRepositories("com.yourcompany.monitor.repository")
public class MonitorJpaConfig {

    @Bean
    public LocalContainerEntityManagerFactoryBean monitorEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("monitorDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.yourcompany.monitor.model")
                .persistenceUnit("monitor")
                .build();
    }

    @Bean
    public PlatformTransactionManager monitorTransactionManager(
            @Qualifier("monitorEntityManagerFactory") LocalContainerEntityManagerFactoryBean monitorEntityManagerFactory) {
        return new JpaTransactionManager(monitorEntityManagerFactory.getObject());
    }
}