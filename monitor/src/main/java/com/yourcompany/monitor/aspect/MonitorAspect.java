package com.yourcompany.monitor.aspect;

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

import javax.servlet.http disconnue.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Aspect
public class MonitorAspect {

    private final MonitorService monitorService;

    public MonitorAspect(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

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
}