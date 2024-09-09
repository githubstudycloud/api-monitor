package com.yourcompany.monitor.task;

import com.yourcompany.monitor.service.StatisticsService;
import com.yourcompany.monitor.service.InterfaceInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class StatisticsTask {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsTask.class);

    private final StatisticsService statisticsService;
    private final InterfaceInfoService interfaceInfoService;

    @Autowired
    public StatisticsTask(StatisticsService statisticsService, InterfaceInfoService interfaceInfoService) {
        this.statisticsService = statisticsService;
        this.interfaceInfoService = interfaceInfoService;
    }

    @Scheduled(cron = "0 0 * * * *") // 每小时执行一次
    public void hourlyStatistics() {
        logger.info("开始执行每小时统计任务");

        // 统计访问次数
        Map<String, Long> accessCounts = statisticsService.getAccessCountByEndpoint();
        logger.info("访问次数统计: {}", accessCounts);

        // 统计平均响应时间
        Map<String, Double> avgResponseTimes = statisticsService.getAverageResponseTimeByEndpoint();
        logger.info("平均响应时间统计: {}", avgResponseTimes);

        // 其他统计...

        logger.info("每小时统计任务执行完成");
    }

    @Scheduled(cron = "0 0 0 * * *") // 每天午夜执行一次
    public void dailyStatistics() {
        logger.info("开始执行每日统计任务");

        // 生成接口信息
        interfaceInfoService.generateAndSaveInterfaceInfo();
        logger.info("接口信息已更新");

        // 执行更详细的统计分析
        // ...

        logger.info("每日统计任务执行完成");
    }

    @Scheduled(cron = "0 0 0 * * 1") // 每周一午夜执行一次
    public void weeklyStatistics() {
        logger.info("开始执行每周统计任务");

        // 执行周度统计分析
        // ...

        logger.info("每周统计任务执行完成");
    }
}