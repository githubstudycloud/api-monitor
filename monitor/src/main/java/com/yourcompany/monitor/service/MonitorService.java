package com.yourcompany.monitor.service;

import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.model.RequestInfo;
import com.yourcompany.monitor.model.ResponseInfo;
import com.yourcompany.monitor.repository.MonitorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final DataStorageService dataStorageService;

    public MonitorService(MonitorRepository monitorRepository, DataStorageService dataStorageService) {
        this.monitorRepository = monitorRepository;
        this.dataStorageService = dataStorageService;
    }

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

        monitorRepository.save(record);
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
}