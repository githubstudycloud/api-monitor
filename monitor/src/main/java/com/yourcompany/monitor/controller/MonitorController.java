package com.yourcompany.monitor.controller;

import com.yourcompany.monitor.model.InterfaceInfo;
import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.service.InterfaceInfoService;
import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/monitor")
@PreAuthorize("hasRole('ADMIN')")
public class MonitorController {

    private final MonitorService monitorService;
    private final StatisticsService statisticsService;
    private final InterfaceInfoService interfaceInfoService;

    @Autowired
    public MonitorController(MonitorService monitorService, StatisticsService statisticsService, InterfaceInfoService interfaceInfoService) {
        this.monitorService = monitorService;
        this.statisticsService = statisticsService;
        this.interfaceInfoService = interfaceInfoService;
    }

    @GetMapping("/records")
    public ResponseEntity<List<MonitorRecord>> getMonitorRecords(
            @RequestParam(required = false) String url,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        // 实现获取监控记录的逻辑
        List<MonitorRecord> records = monitorService.getRecords(url, startTime, endTime);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/statistics/access-count")
    public ResponseEntity<Map<String, Long>> getAccessCountStatistics() {
        Map<String, Long> accessCounts = statisticsService.getAccessCountByEndpoint();
        return ResponseEntity.ok(accessCounts);
    }

    @GetMapping("/statistics/avg-response-time")
    public ResponseEntity<Map<String, Double>> getAverageResponseTimeStatistics() {
        Map<String, Double> avgResponseTimes = statisticsService.getAverageResponseTimeByEndpoint();
        return ResponseEntity.ok(avgResponseTimes);
    }

    @GetMapping("/interface-info")
    public ResponseEntity<List<InterfaceInfo>> getInterfaceInfo() {
        List<InterfaceInfo> interfaceInfoList = interfaceInfoService.getAllInterfaceInfo();
        return ResponseEntity.ok(interfaceInfoList);
    }

    @PostMapping("/interface-info/refresh")
    public ResponseEntity<Void> refreshInterfaceInfo() {
        interfaceInfoService.generateAndSaveInterfaceInfo();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/statistics/unused-interfaces")
    public ResponseEntity<List<String>> getUnusedInterfaces() {
        List<String> unusedInterfaces = statisticsService.getUnusedInterfaces();
        return ResponseEntity.ok(unusedInterfaces);
    }

    @GetMapping("/statistics/top-accessed")
    public ResponseEntity<List<Map.Entry<String, Long>>> getTopAccessedEndpoints(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map.Entry<String, Long>> topAccessed = statisticsService.getTopAccessedEndpoints(limit);
        return ResponseEntity.ok(topAccessed);
    }


    @GetMapping("/health")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Monitor service is up and running");
    }

}