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