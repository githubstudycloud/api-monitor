package com.yourcompany.monitor.service;

import com.yourcompany.monitor.model.MonitorRecord;
import org.springframework.stereotype.Service;

@Service
public class DataStorageService {

    public void store(MonitorRecord record) {
        // 实现存储逻辑，例如存储到Redis、Kafka等
    }
}
