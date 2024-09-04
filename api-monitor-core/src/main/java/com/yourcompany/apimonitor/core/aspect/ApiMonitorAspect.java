package com.yourcompany.apimonitor.core.aspect;

import com.yourcompany.apimonitor.core.annotation.MonitorIgnore;
import com.yourcompany.apimonitor.core.config.ApiMonitorProperties;
import com.yourcompany.apimonitor.core.model.ApiAccessLog;
import com.yourcompany.apimonitor.core.service.ApiMonitorService;
import com.yourcompany.apimonitor.core.util.RequestUtil;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Aspect
@Component
@RequiredArgsConstructor
public class ApiMonitorAspect {

    private final ApiMonitorProperties properties;
    private final ApiMonitorService apiMonitorService;

    @Around("@within(org.springframework.web.bind.annotation.RestController) && !@annotation(MonitorIgnore) && !@within(MonitorIgnore)")
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
        return ThreadLocalRandom.current().nextDouble() < properties.getSamplingRate();
    }

    private ApiAccessLog createApiAccessLog(ProceedingJoinPoint joinPoint, Object result, long duration) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String methodName = signature.getMethod().getName();

        ApiAccessLog log = new ApiAccessLog();
        log.setServiceName(properties.getServiceName());
        log.setApiPath(request.getRequestURI());
        log.setMethod(request.getMethod());
        log.setMethodName(methodName);
        log.setRequestHeaders(RequestUtil.getHeadersAsString(request));
        log.setRequestParams(RequestUtil.getParametersAsString(request));
        log.setResponseBody(RequestUtil.getResponseBodyAsString(result, properties.getMaxResponseBodySize()));
        log.setIpAddress(request.getRemoteAddr());
        log.setAccessTime(LocalDateTime.now());
        log.setDuration(duration);

        return log;
    }
}