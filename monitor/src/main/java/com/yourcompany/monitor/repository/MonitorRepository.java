package com.yourcompany.monitor.repository;


import com.yourcompany.monitor.model.MonitorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MonitorRepository extends JpaRepository<MonitorRecord, Long> {
    List<MonitorRecord> findByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT DISTINCT m.url FROM MonitorRecord m")
    List<String> findDistinctUrls();
}