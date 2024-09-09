package com.yourcompany.apimonitor.core.aspect;

import com.yourcompany.apimonitor.core.config.ApiMonitorProperties;
import com.yourcompany.apimonitor.core.model.ApiAccessLog;
import com.yourcompany.apimonitor.core.service.ApiMonitorService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiMonitorAspectTest {

    @Mock
    private ApiMonitorProperties properties;

    @Mock
    private ApiMonitorService apiMonitorService;

    @Mock
    private ProceedingJoinPoint joinPoint;

    private ApiMonitorAspect aspect;

    @BeforeEach
    void setUp() {
        aspect = new ApiMonitorAspect(properties, apiMonitorService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        when(properties.isEnabled()).thenReturn(true);
        when(properties.getSamplingRate()).thenReturn(1.0);
        when(properties.getServiceName()).thenReturn("TestService");
    }

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void testMonitorApi() throws Throwable {
        when(joinPoint.proceed()).thenReturn("Test Result");

        Object result = aspect.monitorApi(joinPoint);

        verify(apiMonitorService, times(1)).saveAccessLog(any(ApiAccessLog.class));
        assertThat(result).isEqualTo("Test Result");
    }

    @Test
    void testMonitorApiWithSampling() throws Throwable {
        when(properties.getSamplingRate()).thenReturn(0.5);
        when(joinPoint.proceed()).thenReturn("Test Result");

        int sampledCount = 0;
        int totalCalls = 1000;
        for (int i = 0; i < totalCalls; i++) {
            aspect.monitorApi(joinPoint);
            if (verify(apiMonitorService, atMost(1)).saveAccessLog(any(ApiAccessLog.class))) {
                sampledCount++;
            }
            reset(apiMonitorService);
        }

        double actualRate = (double) sampledCount / totalCalls;
        assertThat(actualRate).isBetween(0.45, 0.55);
    }

    @Test
    void testMonitorApiWhenDisabled() throws Throwable {
        when(properties.isEnabled()).thenReturn(false);
        when(joinPoint.proceed()).thenReturn("Test Result");

        Object result = aspect.monitorApi(joinPoint);

        verify(apiMonitorService, never()).saveAccessLog(any(ApiAccessLog.class));
        assertThat(result).isEqualTo("Test Result");
    }
}