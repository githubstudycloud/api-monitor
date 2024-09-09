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

    public List<InterfaceInfo> getAllInterfaceInfo() {
        return interfaceInfoRepository.findAll();
    }
}