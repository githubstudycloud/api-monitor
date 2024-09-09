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