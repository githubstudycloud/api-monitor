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

