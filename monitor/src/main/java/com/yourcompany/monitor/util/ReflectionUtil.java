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
