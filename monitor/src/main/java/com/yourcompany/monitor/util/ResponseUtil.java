package com.yourcompany.monitor.util;

import com.yourcompany.monitor.model.ResponseInfo;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.http.HttpServletResponse;

public class ResponseUtil {

    public static ResponseInfo getResponseInfo(HttpServletResponse response, Object result) {
        ResponseInfo info = new ResponseInfo();
        info.setStatus(response.getStatus());

        if (response instanceof ContentCachingResponseWrapper) {
            ContentCachingResponseWrapper wrapper = (ContentCachingResponseWrapper) response;
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) {
                String payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
                info.setBody(payload);
            }
        } else if (result != null) {
            info.setBody(result.toString());
        }

        return info;
    }
}