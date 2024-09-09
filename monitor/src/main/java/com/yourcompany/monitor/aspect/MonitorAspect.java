package com.yourcompany.monitor.aspect;

import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.model.RequestInfo;
import com.yourcompany.monitor.model.ResponseInfo;
import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.util.RequestUtil;
import com.yourcompany.monitor.util.ResponseUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;

@Aspect
public class MonitorAspect {

    private final MonitorService monitorService;

    public MonitorAspect(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

//    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    @Around("@within(org.springframework.web.bind.annotation.RestController) || " +
            "@within(org.springframework.stereotype.Controller)")
    public Object monitorMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        long startTime = System.currentTimeMillis();

        Object result = null;
        try {
            result = joinPoint.proceed();
            return result;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();

            RequestInfo requestInfo = RequestUtil.getRequestInfo(request);
            ResponseInfo responseInfo = ResponseUtil.getResponseInfo(response, result);

            monitorService.recordAccess(requestInfo, responseInfo, duration);
        }
    }


//    @Around("@within(org.springframework.web.bind.annotation.RestController) || " +
//            "@within(org.springframework.stereotype.Controller)")
//    public Object monitorMethod(ProceedingJoinPoint joinPoint) throws Throwable {
//        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
//        long startTime = System.currentTimeMillis();
//
//        Object result = null;
//        try {
//            result = joinPoint.proceed();
//            return result;
//        } finally {
//            long duration = System.currentTimeMillis() - startTime;
//            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();
//
//            MonitorRecord record = new MonitorRecord();
//            record.setUrl(request.getRequestURI());
//            record.setMethod(request.getMethod());
//            record.setDuration(duration);
//            record.setStatusCode(response != null ? response.getStatus() : 0);
//            record.setTimestamp(LocalDateTime.now());
//
//            // 只记录请求头，不记录请求体和响应体
//            record.setRequestHeaders(getHeadersAsString(request));
//
//            monitorService.saveRecord(record);
//        }
//    }
//
//    private String getHeadersAsString(HttpServletRequest request) {
//        StringBuilder headers = new StringBuilder();
//        request.getHeaderNames().asIterator().forEachRemaining(headerName ->
//                headers.append(headerName).append(": ").append(request.getHeader(headerName)).append("\n")
//        );
//        return headers.toString();
//    }
}