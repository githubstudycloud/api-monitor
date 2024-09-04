package com.yourcompany.apimonitor.core.service;

import com.yourcompany.apimonitor.core.model.ApiAccessLog;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ApiMonitorService {

    @Async
    public void saveAccessLog(ApiAccessLog log) {
        // TODO: Implement actual saving logic (e.g., to database or message queue)
        System.out.println("Saving access log: " + log);
    }
}