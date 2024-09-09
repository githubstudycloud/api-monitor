package com.yourcompany.monitor.util;

import com.yourcompany.monitor.model.ResponseInfo;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;

public class ResponseUtil {

    public static ResponseInfo getResponseInfo(HttpServletResponse response) {
        ResponseInfo info = new ResponseInfo();
        info.setStatus(response.getStatus());

        if (response instanceof ContentCachingResponseWrapper) {
            ContentCachingResponseWrapper wrapper = (ContentCachingResponseWrapper) response;
            try {
                byte[] buf = wrapper.getContentAsByteArray();
                if (buf.length > 0) {
                    String payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
//                String payload = new String(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
                    info.setBody(truncateIfNecessary(payload, 1000)); // 限制body大小
                }
            } catch (UnsupportedEncodingException e) {
                info.setBody("Error reading body");
            }
        }

        return info;
    }

    private static String truncateIfNecessary(String input, int maxLength) {
        if (input.length() <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength) + "...";
    }
}