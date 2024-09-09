package com.yourcompany.monitor.util;

import com.yourcompany.monitor.model.RequestInfo;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class RequestUtil {

    public static RequestInfo getRequestInfo(HttpServletRequest request) {
        RequestInfo info = new RequestInfo();
        info.setMethod(request.getMethod());
        info.setUrl(request.getRequestURL().toString());
        info.setHeaders(getHeadersInfo(request));
        info.setParameters(request.getParameterMap());

        if (request instanceof ContentCachingRequestWrapper) {
            ContentCachingRequestWrapper wrapper = (ContentCachingRequestWrapper) request;
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                String payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
                info.setBody(payload);
            }
        }

        return info;
    }

    private static Map<String, String> getHeadersInfo(HttpServletRequest request) {
        Map<String, String> map = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        return map;
    }
}