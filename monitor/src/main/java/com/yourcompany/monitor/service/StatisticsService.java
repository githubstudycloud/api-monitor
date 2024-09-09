package com.yourcompany.monitor.service;

import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.repository.MonitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final MonitorRepository monitorRepository;

    @Autowired
    public StatisticsService(MonitorRepository monitorRepository) {
        this.monitorRepository = monitorRepository;
    }

    public Map<String, Long> getAccessCountByEndpoint() {
        List<MonitorRecord> records = monitorRepository.findAll();
        return records.stream()
                .collect(Collectors.groupingBy(
                        MonitorRecord::getUrl,
                        Collectors.counting()
                ));
    }


    public Map<String, Double> getAverageResponseTimeByEndpoint() {
        List<MonitorRecord> records = monitorRepository.findAll();
        return records.stream()
                .collect(Collectors.groupingBy(
                        MonitorRecord::getUrl,
                        Collectors.averagingLong(MonitorRecord::getDuration)
                ));
    }

    // 其他统计方法...
    // 实现获取未使用接口的逻辑
    public List<String> getUnusedInterfaces() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        List<MonitorRecord> recentRecords = monitorRepository.findByTimestampAfter(oneMonthAgo);
        List<String> allUrls = monitorRepository.findDistinctUrls();

        Set<String> usedUrls = recentRecords.stream()
                .map(MonitorRecord::getUrl)
                .collect(Collectors.toSet());

        return allUrls.stream()
                .filter(url -> !usedUrls.contains(url))
                .collect(Collectors.toList());
    }



    public List<Map.Entry<String, Long>> getTopAccessedEndpoints(int limit) {
        Map<String, Long> accessCounts = getAccessCountByEndpoint();
        return accessCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
}