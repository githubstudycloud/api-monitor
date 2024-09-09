package com.yourcompany.apimonitor.core.service;

import com.yourcompany.apimonitor.core.model.ApiAccessLog;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiMonitorServiceTest {

    @InjectMocks
    private ApiMonitorService apiMonitorService;

    @Mock
    private Logger logger;

    @Test
    void testSaveAccessLog() {
        ApiAccessLog log = new ApiAccessLog();
        log.setServiceName("TestService");
        log.setApiPath("/test");
        log.setMethod("GET");

        apiMonitorService.saveAccessLog(log);

        verify(logger).info(eq("Saving access log: {}"), eq(log));
    }

    @Test
    void testSaveAccessLogWithNullLog() {
        apiMonitorService.saveAccessLog(null);

        verify(logger).warn(eq("Attempted to save null access log"));
    }
}