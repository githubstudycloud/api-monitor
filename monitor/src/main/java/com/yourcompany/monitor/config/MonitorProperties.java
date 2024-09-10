package com.yourcompany.monitor.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Data
@ConfigurationProperties(prefix = "monitor")
public class MonitorProperties {
    private boolean enabled = true;
    private AopConfig aop = new AopConfig();
    private FilterConfig filter = new FilterConfig();
    private DataSourceConfig dataSource = new DataSourceConfig();
    private JpaConfig jpa = new JpaConfig();
    private ListConfig whitelist = new ListConfig();
    private ListConfig blacklist = new ListConfig();

    @Data
    public static class AopConfig {
        private boolean enabled = true;
    }

    @Data
    public static class FilterConfig {
        private boolean enabled = true;
    }

    @Data
    public static class DataSourceConfig {
        private boolean enabled = false;
        private String url;
        private String jdbcUrl;
        private String username;
        private String password;
        private String driverClassName;
        // 添加连接池相关配置
        private int maximumPoolSize = 10;
        private int minimumIdle = 5;
        private long connectionTimeout = 30000;
    }

    @Data
    public static class JpaConfig {
        private boolean enabled = true;
    }

    @Data
    public static class ListConfig {
        private boolean enabled = false;
        private List<String> paths;
    }


}
