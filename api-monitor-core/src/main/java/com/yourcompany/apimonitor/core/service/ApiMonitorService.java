package com.yourcompany.apimonitor.core.service;

import com.yourcompany.apimonitor.core.model.ApiAccessLog;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ApiMonitorService {

    @Async
    public void saveAccessLog(ApiAccessLog log) {
        // Implement the logic to save the log (to be implemented in the storage module)
        System.out.println("Saving access log: " + log);
    }
}