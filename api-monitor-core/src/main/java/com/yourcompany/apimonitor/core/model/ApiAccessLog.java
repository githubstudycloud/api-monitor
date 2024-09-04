package com.yourcompany.apimonitor.core.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApiAccessLog {
    private String serviceName;
    private String apiPath;
    private String method;
    private String methodName;
    private String requestHeaders;
    private String requestParams;
    private String responseBody;
    private String ipAddress;
    private LocalDateTime accessTime;
    private long duration;
}