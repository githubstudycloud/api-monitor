package com.yourcompany.monitor.util;

import com.yourcompany.monitor.model.RequestInfo;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
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
            try {
                byte[] buf = wrapper.getContentAsByteArray();
                if (buf.length > 0) {
//                String payload = new String(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
                    String payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
                    info.setBody(truncateIfNecessary(payload, 1000)); // 限制body大小
                }
            } catch (UnsupportedEncodingException e) {
                info.setBody("Error reading body");
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

    private static String truncateIfNecessary(String input, int maxLength) {
        if (input.length() <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength) + "...";
    }
}