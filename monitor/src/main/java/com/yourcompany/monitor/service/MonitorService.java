package com.yourcompany.monitor.service;

import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.model.RequestInfo;
import com.yourcompany.monitor.model.ResponseInfo;
import com.yourcompany.monitor.repository.MonitorRepository;
import com.yourcompany.monitor.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final DataStorageService dataStorageService;

    @Autowired
    public MonitorService(MonitorRepository monitorRepository, DataStorageService dataStorageService) {
        this.monitorRepository = monitorRepository;
        this.dataStorageService = dataStorageService;
    }

    @Async
    public void recordAccess(RequestInfo requestInfo, ResponseInfo responseInfo, long duration) {
        MonitorRecord record = new MonitorRecord();
        record.setUrl(requestInfo.getUrl());
        record.setMethod(requestInfo.getMethod());
        record.setRequestHeaders(convertMapToString(requestInfo.getHeaders()));
        record.setRequestBody(requestInfo.getBody());
        record.setRequestParameters(convertMapToString(requestInfo.getParameters()));
        record.setResponseBody(responseInfo.getBody());
        record.setStatusCode(responseInfo.getStatus());
        record.setDuration(duration);
        record.setTimestamp(LocalDateTime.now());

        // 存储到数据库
        monitorRepository.save(record);

        // 存储到其他中间件（如果需要）
        dataStorageService.store(record);
    }

    private String convertMapToString(Map<String, ?> map) {
        if (map == null) return null;
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, ?> entry : map.entrySet()) {
            sb.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
        }
        return sb.toString();
    }

    // 其他方法...
    public List<MonitorRecord> getRecords(String url, LocalDateTime startTime, LocalDateTime endTime) {
        // 实现根据条件查询监控记录的逻辑
        // 这里需要添加相应的 Repository 方法
        return null;
    }
}