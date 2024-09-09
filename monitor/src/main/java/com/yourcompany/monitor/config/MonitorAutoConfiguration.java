package com.yourcompany.monitor.config;

import com.yourcompany.monitor.aspect.MonitorAspect;
import com.yourcompany.monitor.filter.MonitorFilter;
import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.config.MonitorJpaConfig;
import com.yourcompany.monitor.config.MonitorProperties;
import com.yourcompany.monitor.config.MonitorSecurityConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.Ordered;




@Configuration
@ConditionalOnProperty(name = "monitor.enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(MonitorProperties.class)
@Import({MonitorJpaConfig.class, MonitorSecurityConfig.class,MonitorDataSourceConfig.class})
public class MonitorAutoConfiguration {

    @Bean
    @ConditionalOnProperty(name = "monitor.aop.enabled", havingValue = "true", matchIfMissing = true)
    public MonitorAspect monitorAspect(MonitorService monitorService) {
        return new MonitorAspect(monitorService);
    }

    @Bean
    @ConditionalOnProperty(name = "monitor.filter.enabled", havingValue = "true", matchIfMissing = true)
    public MonitorFilter monitorFilter(MonitorService monitorService) {
        return new MonitorFilter(monitorService);
    }

//    @Bean
//    public FilterRegistrationBean<MonitorFilter> monitorFilter(MonitorService monitorService) {
//        FilterRegistrationBean<MonitorFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new MonitorFilter(monitorService));
//        registrationBean.addUrlPatterns("/*");
//        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//        return registrationBean;
//    }


    @Bean
    @ConditionalOnProperty(name = "monitor.whitelist.enabled", havingValue = "true")
    public MonitorWhitelistConfig monitorWhitelistConfig() {
        return new MonitorWhitelistConfig();
    }

    @Bean
    @ConditionalOnProperty(name = "monitor.blacklist.enabled", havingValue = "true")
    public MonitorBlacklistConfig monitorBlacklistConfig() {
        return new MonitorBlacklistConfig();
    }
}