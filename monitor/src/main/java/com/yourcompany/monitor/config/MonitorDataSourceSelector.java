package com.yourcompany.monitor.config;

import org.springframework.beans.factory.annotation.Value;

import javax.sql.DataSource;

public class MonitorDataSourceSelector {

    private final DataSource monitorDataSource;
    private final DataSource primaryDataSource;

    @Value("${monitor.datasource.enabled:true}")
    private boolean monitorDataSourceEnabled;

    public MonitorDataSourceSelector(DataSource monitorDataSource, DataSource primaryDataSource) {
        this.monitorDataSource = monitorDataSource;
        this.primaryDataSource = primaryDataSource;
    }

    public DataSource getDataSource() {
        return monitorDataSourceEnabled ? monitorDataSource : primaryDataSource;
    }
}