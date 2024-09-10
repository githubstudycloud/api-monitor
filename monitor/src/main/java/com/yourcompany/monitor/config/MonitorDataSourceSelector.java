package com.yourcompany.monitor.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;

import javax.sql.DataSource;

public class MonitorDataSourceSelector {

    private final DataSource primaryDataSource;
    private final DataSource monitorDataSource;

    @Value("${monitor.datasource.enabled:false}")
    private boolean monitorDataSourceEnabled;

    public MonitorDataSourceSelector(
            @Qualifier("dataSource") DataSource primaryDataSource,
            @Autowired(required = false) @Qualifier("monitorDataSource") DataSource monitorDataSource) {
        this.primaryDataSource = primaryDataSource;
        this.monitorDataSource = monitorDataSource;
    }

    public DataSource getDataSource() {
        return monitorDataSourceEnabled && monitorDataSource != null ? monitorDataSource : primaryDataSource;
    }
}