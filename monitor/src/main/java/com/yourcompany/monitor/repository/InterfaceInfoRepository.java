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