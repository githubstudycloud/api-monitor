//package com.yourcompany.monitor.config;
//
//
//import com.yourcompany.monitor.aspect.MonitorAspect;
//import com.yourcompany.monitor.filter.MonitorFilter;
//import com.yourcompany.monitor.service.MonitorService;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.Ordered;
//
//@Configuration
//@ConditionalOnProperty(name = "monitor.enabled", havingValue = "true", matchIfMissing = true)
//public class MonitorConfig {
//
//    @Bean
//    public MonitorAspect monitorAspect(MonitorService monitorService) {
//        return new MonitorAspect(monitorService);
//    }
//
//    @Bean
//    public FilterRegistrationBean<MonitorFilter> monitorFilter(MonitorService monitorService) {
//        FilterRegistrationBean<MonitorFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new MonitorFilter(monitorService));
//        registrationBean.addUrlPatterns("/*");
//        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//        return registrationBean;
//    }
//
//    @Bean
//    @ConditionalOnProperty(name = "monitor.whitelist.enabled", havingValue = "true")
//    public MonitorWhitelistConfig monitorWhitelistConfig() {
//        return new MonitorWhitelistConfig();
//    }
//
//    @Bean
//    @ConditionalOnProperty(name = "monitor.blacklist.enabled", havingValue = "true")
//    public MonitorBlacklistConfig monitorBlacklistConfig() {
//        return new MonitorBlacklistConfig();
//    }
//}