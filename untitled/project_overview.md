# Project Structure

```
monitor/
    pom.xml
    src/
        main/
            java/
                com/
                    yourcompany/
                        App.java
                        monitor/
                            MonitorApplication.java
                            annotation/
                                EnableMonitor.java
                            aspect/
                                MonitorAspect.java
                            config/
                                DataSourceConfig.java
                                MonitorAutoConfiguration.java
                                MonitorBlacklistConfig.java
                                MonitorConfig.java
                                MonitorDataSourceConfig.java
                                MonitorJpaConfig.java
                                MonitorProperties.java
                                MonitorSecurityConfig.java
                                MonitorWhitelistConfig.java
                            controller/
                                MonitorController.java
                            filter/
                                MonitorFilter.java
                            model/
                                InterfaceInfo.java
                                MonitorRecord.java
                                RequestInfo.java
                                ResponseInfo.java
                            repository/
                                InterfaceInfoRepository.java
                                MonitorRepository.java
                            service/
                                DataStorageService.java
                                InterfaceInfoService.java
                                MonitorService.java
                                StatisticsService.java
                            task/
                                StatisticsTask.java
                            util/
                                ReflectionUtil.java
                                RequestUtil.java
                                ResponseUtil.java
            resources/
                application.yml
                META-INF/
                    spring.factories
                templates/
                    login.html
        test/
            java/
                com/
                    yourcompany/
                        AppTest.java
                        monitor/
                            MonitorControllerTest.java
                            MonitorIntegrationTest.java
                            MonitorRepositoryTest.java
                            MonitorServiceTest.java
                            SecurityConfigTest.java
            resources/
```

# File Contents

## pom.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.18</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.yourcompany</groupId>
    <artifactId>monitor</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>monitor</name>
    <description>API Monitoring System</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>

        <!-- Database -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
            <scope>runtime</scope>
        </dependency>

        <!-- MyBatis -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.2</version>
        </dependency>

        <!-- Connection Pool -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-dbcp2</artifactId>
        </dependency>

        <!-- Utilities -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <classifier>exec</classifier>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>

```

## App.java

```
package com.yourcompany;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        System.out.println( "Hello World!" );
    }
}

```

## MonitorApplication.java

```
package com.yourcompany.monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@SpringBootApplication
@EnableScheduling
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(MonitorApplication.class, args);
    }
}
```

## EnableMonitor.java

```
package com.yourcompany.monitor.annotation;


import com.yourcompany.monitor.config.MonitorAutoConfiguration;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(MonitorAutoConfiguration.class)
public @interface EnableMonitor {
}


```

## MonitorAspect.java

```
package com.yourcompany.monitor.aspect;

import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.model.RequestInfo;
import com.yourcompany.monitor.model.ResponseInfo;
import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.util.RequestUtil;
import com.yourcompany.monitor.util.ResponseUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;

@Aspect
public class MonitorAspect {

    private final MonitorService monitorService;

    public MonitorAspect(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

//    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
//            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    @Around("@within(org.springframework.web.bind.annotation.RestController) || " +
            "@within(org.springframework.stereotype.Controller)")
    public Object monitorMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        long startTime = System.currentTimeMillis();

        Object result = null;
        try {
            result = joinPoint.proceed();
            return result;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();

            RequestInfo requestInfo = RequestUtil.getRequestInfo(request);
            ResponseInfo responseInfo = ResponseUtil.getResponseInfo(response, result);

            monitorService.recordAccess(requestInfo, responseInfo, duration);
        }
    }


//    @Around("@within(org.springframework.web.bind.annotation.RestController) || " +
//            "@within(org.springframework.stereotype.Controller)")
//    public Object monitorMethod(ProceedingJoinPoint joinPoint) throws Throwable {
//        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
//        long startTime = System.currentTimeMillis();
//
//        Object result = null;
//        try {
//            result = joinPoint.proceed();
//            return result;
//        } finally {
//            long duration = System.currentTimeMillis() - startTime;
//            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();
//
//            MonitorRecord record = new MonitorRecord();
//            record.setUrl(request.getRequestURI());
//            record.setMethod(request.getMethod());
//            record.setDuration(duration);
//            record.setStatusCode(response != null ? response.getStatus() : 0);
//            record.setTimestamp(LocalDateTime.now());
//
//            // 只记录请求头，不记录请求体和响应体
//            record.setRequestHeaders(getHeadersAsString(request));
//
//            monitorService.saveRecord(record);
//        }
//    }
//
//    private String getHeadersAsString(HttpServletRequest request) {
//        StringBuilder headers = new StringBuilder();
//        request.getHeaderNames().asIterator().forEachRemaining(headerName ->
//                headers.append(headerName).append(": ").append(request.getHeader(headerName)).append("\n")
//        );
//        return headers.toString();
//    }
}
```

## DataSourceConfig.java

```
package com.yourcompany.monitor.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean
    @Qualifier("monitorDataSource")
    @ConditionalOnProperty(name = "monitor.datasource.enabled", havingValue = "true")
    @ConfigurationProperties(prefix = "monitor.datasource")
    public DataSource monitorDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }
}
```

## MonitorAutoConfiguration.java

```
package com.yourcompany.monitor.config;

import com.yourcompany.monitor.aspect.MonitorAspect;
import com.yourcompany.monitor.filter.MonitorFilter;
import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.config.MonitorJpaConfig;
import com.yourcompany.monitor.config.MonitorProperties;
import com.yourcompany.monitor.config.MonitorSecurityConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.Ordered;

@Configuration
@ConditionalOnProperty(name = "monitor.enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(MonitorProperties.class)
@Import({MonitorJpaConfig.class, MonitorSecurityConfig.class,MonitorDataSourceConfig.class})
public class MonitorAutoConfiguration {

    @Bean
    @ConditionalOnProperty(name = "monitor.aop.enabled", havingValue = "true", matchIfMissing = true)
    public MonitorAspect monitorAspect(MonitorService monitorService) {
        return new MonitorAspect(monitorService);
    }

    @Bean
    @ConditionalOnProperty(name = "monitor.filter.enabled", havingValue = "true", matchIfMissing = true)
    public MonitorFilter monitorFilter(MonitorService monitorService) {
        return new MonitorFilter(monitorService);
    }

//    @Bean
//    public FilterRegistrationBean<MonitorFilter> monitorFilter(MonitorService monitorService) {
//        FilterRegistrationBean<MonitorFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new MonitorFilter(monitorService));
//        registrationBean.addUrlPatterns("/*");
//        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//        return registrationBean;
//    }


    @Bean
    @ConditionalOnProperty(name = "monitor.whitelist.enabled", havingValue = "true")
    public MonitorWhitelistConfig monitorWhitelistConfig() {
        return new MonitorWhitelistConfig();
    }

    @Bean
    @ConditionalOnProperty(name = "monitor.blacklist.enabled", havingValue = "true")
    public MonitorBlacklistConfig monitorBlacklistConfig() {
        return new MonitorBlacklistConfig();
    }
}
```

## MonitorBlacklistConfig.java

```
package com.yourcompany.monitor.config;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "monitor.blacklist")
public class MonitorBlacklistConfig {
    private List<String> paths;

    public List<String> getPaths() {
        return paths;
    }

    public void setPaths(List<String> paths) {
        this.paths = paths;
    }
}

```

## MonitorConfig.java

```
//package com.yourcompany.monitor.config;
//
//
//import com.yourcompany.monitor.aspect.MonitorAspect;
//import com.yourcompany.monitor.filter.MonitorFilter;
//import com.yourcompany.monitor.service.MonitorService;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.Ordered;
//
//@Configuration
//@ConditionalOnProperty(name = "monitor.enabled", havingValue = "true", matchIfMissing = true)
//public class MonitorConfig {
//
//    @Bean
//    public MonitorAspect monitorAspect(MonitorService monitorService) {
//        return new MonitorAspect(monitorService);
//    }
//
//    @Bean
//    public FilterRegistrationBean<MonitorFilter> monitorFilter(MonitorService monitorService) {
//        FilterRegistrationBean<MonitorFilter> registrationBean = new FilterRegistrationBean<>();
//        registrationBean.setFilter(new MonitorFilter(monitorService));
//        registrationBean.addUrlPatterns("/*");
//        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//        return registrationBean;
//    }
//
//    @Bean
//    @ConditionalOnProperty(name = "monitor.whitelist.enabled", havingValue = "true")
//    public MonitorWhitelistConfig monitorWhitelistConfig() {
//        return new MonitorWhitelistConfig();
//    }
//
//    @Bean
//    @ConditionalOnProperty(name = "monitor.blacklist.enabled", havingValue = "true")
//    public MonitorBlacklistConfig monitorBlacklistConfig() {
//        return new MonitorBlacklistConfig();
//    }
//}
```

## MonitorDataSourceConfig.java

```
package com.yourcompany.monitor.config;


import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(name = "monitor.datasource.enabled", havingValue = "true")
@EnableConfigurationProperties(MonitorProperties.class)
public class MonitorDataSourceConfig {

//    @Bean
//    public DataSource monitorDataSource(MonitorProperties properties) {
//        HikariDataSource dataSource = new HikariDataSource();
//        MonitorProperties.DataSourceConfig config = properties.getDataSource();
//
//        dataSource.setJdbcUrl(config.getUrl());
//        dataSource.setUsername(config.getUsername());
//        dataSource.setPassword(config.getPassword());
//        dataSource.setDriverClassName(config.getDriverClassName());
//
//        dataSource.setMaximumPoolSize(config.getMaxPoolSize());
//        dataSource.setMinimumIdle(config.getMinIdle());
//        dataSource.setConnectionTimeout(config.getConnectionTimeout());
//
//        return dataSource;
//    }
    @Bean
    @ConfigurationProperties("monitor.datasource")
    public DataSourceProperties monitorDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource monitorDataSource() {
        return monitorDataSourceProperties().initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }
}
```

## MonitorJpaConfig.java

```
package com.yourcompany.monitor.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(name = "monitor.datasource.enabled", havingValue = "true")
@EnableJpaRepositories(
        basePackages = "com.yourcompany.monitor.repository",
        entityManagerFactoryRef = "monitorEntityManagerFactory",
        transactionManagerRef = "monitorTransactionManager"
)
//@EntityScan("com.yourcompany.monitor.model")
//@EnableJpaRepositories("com.yourcompany.monitor.repository")
public class MonitorJpaConfig {

    @Bean
    public LocalContainerEntityManagerFactoryBean monitorEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("monitorDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.yourcompany.monitor.model")
                .persistenceUnit("monitor")
                .build();
    }

    @Bean
    public PlatformTransactionManager monitorTransactionManager(
            @Qualifier("monitorEntityManagerFactory") LocalContainerEntityManagerFactoryBean monitorEntityManagerFactory) {
        return new JpaTransactionManager(monitorEntityManagerFactory.getObject());
    }
}
```

## MonitorProperties.java

```
package com.yourcompany.monitor.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Data
@ConfigurationProperties(prefix = "monitor")
public class MonitorProperties {
    private boolean enabled = true;
    private AopConfig aop = new AopConfig();
    private FilterConfig filter = new FilterConfig();
    private DataSourceConfig dataSource = new DataSourceConfig();
    private ListConfig whitelist = new ListConfig();
    private ListConfig blacklist = new ListConfig();

    @Data
    public static class AopConfig {
        private boolean enabled = true;
    }

    @Data
    public static class FilterConfig {
        private boolean enabled = true;
    }

    @Data
    public static class DataSourceConfig {
        private boolean enabled = false;
        private String url;
        private String username;
        private String password;
        private String driverClassName;
        // 添加连接池相关配置
        private int maxPoolSize = 10;
        private int minIdle = 5;
        private long connectionTimeout = 30000;
    }

    @Data
    public static class ListConfig {
        private boolean enabled = false;
        private List<String> paths;
    }
}

```

## MonitorSecurityConfig.java

```
package com.yourcompany.monitor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class MonitorSecurityConfig {

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf().disable()
//                .authorizeRequests()
//                .antMatchers("/api/monitor/**").hasRole("ADMIN")
//                .anyRequest().authenticated()
//                .and()
//                .httpBasic();
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/monitor/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
                .httpBasic();
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("adminPassword"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## MonitorWhitelistConfig.java

```
package com.yourcompany.monitor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "monitor.whitelist")
public class MonitorWhitelistConfig {
    private List<String> paths;

    public List<String> getPaths() {
        return paths;
    }

    public void setPaths(List<String> paths) {
        this.paths = paths;
    }
}
```

## MonitorController.java

```
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
```

## MonitorFilter.java

```
package com.yourcompany.monitor.filter;
import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.util.RequestUtil;
import com.yourcompany.monitor.util.ResponseUtil;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MonitorFilter extends OncePerRequestFilter {

    private final MonitorService monitorService;

    public MonitorFilter(MonitorService monitorService) {
        this.monitorService = monitorService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        long startTime = System.currentTimeMillis();

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            monitorService.recordAccess(
                    RequestUtil.getRequestInfo(wrappedRequest),
                    ResponseUtil.getResponseInfo(wrappedResponse),
                    duration
            );

            // 复制响应内容到原始响应
            wrappedResponse.copyBodyToResponse();
        }
    }
}
```

## InterfaceInfo.java

```
package com.yourcompany.monitor.model;

import lombok.Data;
import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "interface_info")
public class InterfaceInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false)
    private String className;

    @Column(nullable = false)
    private String methodName;

    @ElementCollection
    private List<String> parameters;

    @Column(nullable = false)
    private String returnType;
}
```

## MonitorRecord.java

```
package com.yourcompany.monitor.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "monitor_records")
public class MonitorRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String method;

    @Column(columnDefinition = "TEXT")
    private String requestHeaders;

    @Column(columnDefinition = "TEXT")
    private String requestParameters;

    @Column(columnDefinition = "TEXT")
    private String requestBody;

    @Column(columnDefinition = "TEXT")
    private String responseBody;

    @Column(nullable = false)
    private int statusCode;

    @Column(nullable = false)
    private long duration;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
```

## RequestInfo.java

```
package com.yourcompany.monitor.model;


import lombok.Data;
import java.util.Map;

@Data
public class RequestInfo {
    private String url;
    private String method;
    private Map<String, String> headers;
    private String body;
    private Map<String, String[]> parameters;
}
```

## ResponseInfo.java

```
package com.yourcompany.monitor.model;
import lombok.Data;

@Data
public class ResponseInfo {
    private int status;
    private String body;
}
```

## InterfaceInfoRepository.java

```
package com.yourcompany.monitor.repository;

import com.yourcompany.monitor.model.InterfaceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterfaceInfoRepository extends JpaRepository<InterfaceInfo, Long> {
    List<InterfaceInfo> findByUrlContaining(String url);
    InterfaceInfo findByUrlAndMethod(String url, String method);
}
```

## MonitorRepository.java

```
package com.yourcompany.monitor.repository;

import com.yourcompany.monitor.model.MonitorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MonitorRepository extends JpaRepository<MonitorRecord, Long> {
    List<MonitorRecord> findByRequestInfoUrlContaining(String url);
    List<MonitorRecord> findByTimestampBetween(long startTime, long endTime);
    List<MonitorRecord> findByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT DISTINCT m.url FROM MonitorRecord m")
    List<String> findDistinctUrls();
}
```

## DataStorageService.java

```
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
```

## InterfaceInfoService.java

```
package com.yourcompany.monitor.service;

import com.yourcompany.monitor.model.InterfaceInfo;
import com.yourcompany.monitor.repository.InterfaceInfoRepository;
import com.yourcompany.monitor.util.ReflectionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InterfaceInfoService {

    private final InterfaceInfoRepository interfaceInfoRepository;
    private final RequestMappingHandlerMapping handlerMapping;

    @Autowired
    public InterfaceInfoService(InterfaceInfoRepository interfaceInfoRepository, RequestMappingHandlerMapping handlerMapping) {
        this.interfaceInfoRepository = interfaceInfoRepository;
        this.handlerMapping = handlerMapping;
    }

    public void generateAndSaveInterfaceInfo() {
        List<InterfaceInfo> interfaceInfoList = new ArrayList<>();

        Map<RequestMappingInfo, HandlerMethod> handlerMethods = handlerMapping.getHandlerMethods();
        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            RequestMappingInfo mappingInfo = entry.getKey();
            HandlerMethod handlerMethod = entry.getValue();

            InterfaceInfo interfaceInfo = new InterfaceInfo();
            interfaceInfo.setUrl(mappingInfo.getPatternsCondition().toString());
            interfaceInfo.setMethod(mappingInfo.getMethodsCondition().toString());
            interfaceInfo.setClassName(handlerMethod.getBeanType().getName());
            interfaceInfo.setMethodName(handlerMethod.getMethod().getName());
            interfaceInfo.setParameters(ReflectionUtil.getParameterInfo(handlerMethod.getMethod()));
            interfaceInfo.setReturnType(handlerMethod.getMethod().getReturnType().getName());

            interfaceInfoList.add(interfaceInfo);
        }

        interfaceInfoRepository.saveAll(interfaceInfoList);
    }

    // 其他方法...
    public List<InterfaceInfo> getAllInterfaceInfo() {
        return interfaceInfoRepository.findAll();
    }
}
```

## MonitorService.java

```
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
```

## StatisticsService.java

```
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
```

## StatisticsTask.java

```
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
```

## ReflectionUtil.java

```
package com.yourcompany.monitor.util;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.List;

public class ReflectionUtil {

    public static List<String> getParameterInfo(Method method) {
        List<String> parameterInfo = new ArrayList<>();
        Parameter[] parameters = method.getParameters();
        for (Parameter parameter : parameters) {
            parameterInfo.add(parameter.getType().getSimpleName() + " " + parameter.getName());
        }
        return parameterInfo;
    }

    public static String getReturnTypeInfo(Method method) {
        return method.getReturnType().getSimpleName();
    }
}

```

## RequestUtil.java

```
package com.yourcompany.monitor.util;

import com.yourcompany.monitor.model.RequestInfo;
import org.springframework.web.util.ContentCachingRequestWrapper;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class RequestUtil {

    public static RequestInfo getRequestInfo(HttpServletRequest request) {
        RequestInfo info = new RequestInfo();
        info.setMethod(request.getMethod());
        info.setUrl(request.getRequestURL().toString());
        info.setHeaders(getHeadersInfo(request));
        info.setParameters(request.getParameterMap());

        if (request instanceof ContentCachingRequestWrapper) {
            ContentCachingRequestWrapper wrapper = (ContentCachingRequestWrapper) request;
            try {
                byte[] buf = wrapper.getContentAsByteArray();
                if (buf.length > 0) {
//                String payload = new String(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
                    String payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
                    info.setBody(truncateIfNecessary(payload, 1000)); // 限制body大小
                }
            } catch (UnsupportedEncodingException e) {
                info.setBody("Error reading body");
            }
        }

        return info;
    }

    private static Map<String, String> getHeadersInfo(HttpServletRequest request) {
        Map<String, String> map = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        return map;
    }

    private static String truncateIfNecessary(String input, int maxLength) {
        if (input.length() <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength) + "...";
    }
}
```

## ResponseUtil.java

```
package com.yourcompany.monitor.util;

import com.yourcompany.monitor.model.ResponseInfo;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;

public class ResponseUtil {

    public static ResponseInfo getResponseInfo(HttpServletResponse response) {
        ResponseInfo info = new ResponseInfo();
        info.setStatus(response.getStatus());

        if (response instanceof ContentCachingResponseWrapper) {
            ContentCachingResponseWrapper wrapper = (ContentCachingResponseWrapper) response;
            try {
                byte[] buf = wrapper.getContentAsByteArray();
                if (buf.length > 0) {
                    String payload = new String(buf, 0, buf.length, wrapper.getCharacterEncoding());
//                String payload = new String(wrapper.getContentAsByteArray(), wrapper.getCharacterEncoding());
                    info.setBody(truncateIfNecessary(payload, 1000)); // 限制body大小
                }
            } catch (UnsupportedEncodingException e) {
                info.setBody("Error reading body");
            }
        }

        return info;
    }

    public static ResponseInfo getResponseInfo(HttpServletResponse response, Object result) {
        ResponseInfo info = getResponseInfo(response);
        if (info.getBody() == null && result != null) {
            info.setBody(result.toString());
        }
        return info;
    }

    private static String truncateIfNecessary(String input, int maxLength) {
        if (input.length() <= maxLength) {
            return input;
        }
        return input.substring(0, maxLength) + "...";
    }
}
```

## application.yml

```
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/monitor_db
    jdbc-url: jdbc:mysql://localhost:3306/monitor_db
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

monitor:
  enabled: true
  aop:
    enabled: true
  filter:
    enabled: true
  datasource:
    enabled: false
    url: jdbc:mysql://localhost:3306/separate_monitor_db
    jdbc-url: jdbc:mysql://localhost:3306/separate_monitor_db
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    max-pool-size: 10
    min-idle: 5
    connection-timeout: 30000
  whitelist:
    enabled: false
    paths:
      - /api/public/**
      - /health
  blacklist:
    enabled: false
    paths:
      - /api/admin/**
      - /internal/**

logging:
  level:
    com.example.monitor: DEBUG

server:
  port: 8080
```

## spring.factories

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.yourcompany.monitor.config.MonitorAutoConfiguration
```

## login.html

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitor Service Login</title>
</head>
<body>
<h2>Login to Monitor Service</h2>
<form action="/login" method="post">
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
    </div>
    <div>
        <button type="submit">Login</button>
    </div>
</form>
</body>
</html>
```

## AppTest.java

```
package com.yourcompany;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple App.
 */
public class AppTest 
    extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AppTest( String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( AppTest.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp()
    {
        assertTrue( true );
    }
}

```

## MonitorControllerTest.java

```
package com.yourcompany.monitor;

import com.yourcompany.monitor.service.MonitorService;
import com.yourcompany.monitor.service.StatisticsService;
import com.yourcompany.monitor.controller.MonitorController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MonitorController.class)
public class MonitorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MonitorService monitorService;

    @MockBean
    private StatisticsService statisticsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetAccessCountStatistics() throws Exception {
        when(statisticsService.getAccessCountByEndpoint()).thenReturn(new HashMap<>());

        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testGetAccessCountStatisticsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isForbidden());
    }
}
```

## MonitorIntegrationTest.java

```
package com.yourcompany.monitor;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MonitorIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetAccessCountStatistics() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testGetAccessCountStatisticsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isForbidden());
    }
}
```

## MonitorRepositoryTest.java

```
package com.yourcompany.monitor;

import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.repository.MonitorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
public class MonitorRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MonitorRepository monitorRepository;

    @Test
    public void testFindByTimestampBetween() {
        MonitorRecord record1 = new MonitorRecord();
        record1.setTimestamp(LocalDateTime.now().minusHours(2));
        MonitorRecord record2 = new MonitorRecord();
        record2.setTimestamp(LocalDateTime.now().minusHours(1));

        entityManager.persist(record1);
        entityManager.persist(record2);
        entityManager.flush();

        LocalDateTime startTime = LocalDateTime.now().minusHours(3);
        LocalDateTime endTime = LocalDateTime.now();

        List<MonitorRecord> found = monitorRepository.findByTimestampBetween(startTime, endTime);

        assertEquals(2, found.size());
    }
}
```

## MonitorServiceTest.java

```
package com.yourcompany.monitor;

import com.yourcompany.monitor.model.MonitorRecord;
import com.yourcompany.monitor.repository.MonitorRepository;
import com.yourcompany.monitor.service.MonitorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class MonitorServiceTest {

    @InjectMocks
    private MonitorService monitorService;

    @Mock
    private MonitorRepository monitorRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetRecords() {
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();
        List<MonitorRecord> expectedRecords = Arrays.asList(new MonitorRecord(), new MonitorRecord());

        when(monitorRepository.findByTimestampBetween(startTime, endTime)).thenReturn(expectedRecords);

        List<MonitorRecord> actualRecords = monitorService.getRecords(null, startTime, endTime);

        assertEquals(expectedRecords, actualRecords);
    }
}
```

## SecurityConfigTest.java

```
package com.yourcompany.monitor;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testAuthenticatedAdminAccess() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void testAuthenticatedUserAccess() throws Exception {
        mockMvc.perform(get("/api/monitor/statistics/access-count"))
                .andExpect(status().isForbidden());
    }
}
```

