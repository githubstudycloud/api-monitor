package com.yourcompany.monitor;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testAuthenticatedAdminAccess() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testAuthenticatedUserAccess() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isForbidden());
    }
}