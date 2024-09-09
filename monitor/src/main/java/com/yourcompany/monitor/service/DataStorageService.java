package com.yourcompany.monitor.service;

import com.yourcompany.monitor.model.MonitorRecord;
import org.springframework.stereotype.Service;

@Service
public class DataStorageService {

    public void store(MonitorRecord record) {
        // 实现存储逻辑，例如存储到Redis、Kafka等
        // 这里可以根据配置决定存储到哪些中间件
    }

    // 其他方法...
}