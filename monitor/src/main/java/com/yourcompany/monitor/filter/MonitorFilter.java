package com.yourcompany.monitor.filter;
import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.util.RequestUtil;
import com.yourcompany.monitor.util.ResponseUtil;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MonitorFilter extends OncePerRequestFilter {

    private final MonitorService monitorService;

    public MonitorFilter(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long startTime = System.currentTimeMillis();

        // 包装请求和响应以捕获内容
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            monitorService.recordAccess(
                    RequestUtil.getRequestInfo(wrappedRequest),
                    ResponseUtil.getResponseInfo(wrappedResponse),
                    duration
            );

            // 复制响应内容到原始响应
            wrappedResponse.copyBodyToResponse();
        }
    }
}