package com.yourcompany.apimonitor.core.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class RequestUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String getHeadersAsString(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.put(headerName, request.getHeader(headerName));
        }
        try {
            return objectMapper.writeValueAsString(headers);
        } catch (Exception e) {
            return "Error serializing headers";
        }
    }

    public static String getParametersAsString(HttpServletRequest request) {
        return request.getQueryString();
    }

    public static String getResponseBodyAsString(Object response, long maxSize) {
        if (response == null) {
            return null;
        }
        try {
            String json = objectMapper.writeValueAsString(response);
            if (json.length() > maxSize) {
                return StringUtils.truncate(json, (int) maxSize) + "... (truncated)";
            }
            return json;
        } catch (Exception e) {
            return "Error serializing response";
        }
    }
}