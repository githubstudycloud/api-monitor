package com.yourcompany.monitor.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "monitor")
public class MonitorProperties {
    private boolean enabled = true;
    private AopConfig aop = new AopConfig();
    private DataSourceConfig dataSource = new DataSourceConfig();

    @Data
    public static class AopConfig {
        private boolean enabled = true;
    }

    @Data
    public static class DataSourceConfig {
        private boolean enabled = false;
        private String url;
        private String username;
        private String password;
    }
}