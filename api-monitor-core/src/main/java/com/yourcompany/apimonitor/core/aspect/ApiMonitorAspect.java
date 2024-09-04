package com.yourcompany.apimonitor.core.aspect;

import com.yourcompany.apimonitor.core.config.ApiMonitorProperties;
import com.yourcompany.apimonitor.core.model.ApiAccessLog;
import com.yourcompany.apimonitor.core.service.ApiMonitorService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@RequiredArgsConstructor
public class ApiMonitorAspect {

    private final ApiMonitorProperties properties;
    private final ApiMonitorService apiMonitorService;

    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    public Object monitorApi(ProceedingJoinPoint joinPoint) throws Throwable {
        if (!shouldMonitor()) {
            return joinPoint.proceed();
        }

        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - startTime;

        ApiAccessLog log = createApiAccessLog(joinPoint, result, duration);
        apiMonitorService.saveAccessLog(log);

        return result;
    }

    private boolean shouldMonitor() {
        return Math.random() < properties.getSamplingRate();
    }

    private ApiAccessLog createApiAccessLog(ProceedingJoinPoint joinPoint, Object result, long duration) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        ApiAccessLog log = new ApiAccessLog();
        log.setServiceName(properties.getServiceName());
        log.setApiPath(request.getRequestURI());
        log.setMethod(request.getMethod());
        log.setRequestHeaders(getHeadersAsString(request));
        log.setRequestParams(getParametersAsString(request));
        log.setResponseBody(getResponseBodyAsString(result));
        log.setIpAddress(request.getRemoteAddr());
        log.setAccessTime(LocalDateTime.now());
        log.setDuration(duration);

        return log;
    }

    // Implement getHeadersAsString, getParametersAsString, and getResponseBodyAsString methods
    // ...
}