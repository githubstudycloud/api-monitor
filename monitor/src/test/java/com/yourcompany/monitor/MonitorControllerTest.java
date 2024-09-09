package com.yourcompany.monitor;

import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.service.StatisticsService;
import com.yourcompany.monitor.controller.MonitorController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MonitorController.class)
public class MonitorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MonitorService monitorService;

    @MockBean
    private StatisticsService statisticsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetAccessCountStatistics() throws Exception {
        when(statisticsService.getAccessCountByEndpoint()).thenReturn(new HashMap<>());

        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testGetAccessCountStatisticsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isForbidden());
    }
}