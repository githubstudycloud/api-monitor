package com.yourcompany.monitor.model;


import lombok.Data;
import java.util.Map;

@Data
public class RequestInfo {
    private String url;
    private String method;
    private Map<String, String> headers;
    private String body;
    private Map<String, String[]> parameters;
}