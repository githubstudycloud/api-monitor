package com.yourcompany.apimonitor.core.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@Data
@ConfigurationProperties(prefix = "api-monitor")
public class ApiMonitorProperties {
    private boolean enabled = true;
    private String serviceName = "default-service";
    private double samplingRate = 1.0;
    private List<String> includePatterns = new ArrayList<>();
    private List<String> excludePatterns = new ArrayList<>();
    private long maxRequestBodySize = 1024 * 1024; // 1MB
    private long maxResponseBodySize = 1024 * 1024; // 1MB
    private boolean logLargePayloads = false;
}