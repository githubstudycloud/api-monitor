# api-monitor
api-monitor
api-monitor-core/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── yourcompany/
│   │   │           └── apimonitor/
│   │   │               └── core/
│   │   │                   ├── annotation/
│   │   │                   │   └── MonitorIgnore.java
│   │   │                   ├── aspect/
│   │   │                   │   └── ApiMonitorAspect.java
│   │   │                   ├── config/
│   │   │                   │   ├── ApiMonitorAutoConfiguration.java
│   │   │                   │   └── ApiMonitorProperties.java
│   │   │                   ├── model/
│   │   │                   │   └── ApiAccessLog.java
│   │   │                   ├── service/
│   │   │                   │   └── ApiMonitorService.java
│   │   │                   └── util/
│   │   │                       └── RequestUtil.java
│   │   └── resources/
│   │       └── META-INF/
│   │           └── spring.factories
│   └── test/
│       └── java/
│           └── com/
│               └── yourcompany/
│                   └── apimonitor/
│                       └── core/
│                           ├── aspect/
│                           │   └── ApiMonitorAspectTest.java
│                           └── service/
│                               └── ApiMonitorServiceTest.java
└── pom.xml


模块划分：
a. api-monitor-core：核心监控模块
b. api-monitor-storage：数据存储模块
c. api-monitor-analysis：统计分析模块
d. api-monitor-visualization：可视化模块
e. api-monitor-example：示例项目
api-monitor/
├── api-monitor-core/
│   ├── src/main/java/com/yourcompany/apimonitor/core/
│   │   ├── annotation/
│   │   ├── aspect/
│   │   ├── config/
│   │   ├── model/
│   │   └── util/
│   └── pom.xml
├── api-monitor-storage/
│   ├── src/main/java/com/yourcompany/apimonitor/storage/
│   │   ├── config/
│   │   ├── repository/
│   │   └── service/
│   └── pom.xml
├── api-monitor-analysis/
│   ├── src/main/java/com/yourcompany/apimonitor/analysis/
│   │   ├── service/
│   │   └── task/
│   └── pom.xml
├── api-monitor-visualization/
│   ├── src/main/java/com/yourcompany/apimonitor/visualization/
│   │   ├── controller/
│   │   └── service/
│   ├── src/main/resources/
│   │   └── templates/
│   └── pom.xml
├── api-monitor-example/
│   ├── src/main/java/com/yourcompany/apimonitor/example/
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
└── pom.xml