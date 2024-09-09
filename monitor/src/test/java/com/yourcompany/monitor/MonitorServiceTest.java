//package com.yourcompany.monitor;
//
//import com.yourcompany.monitor.model.MonitorRecord;
//import com.yourcompany.monitor.repository.MonitorRepository;
//import com.yourcompany.monitor.service.MonitorService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.time.LocalDateTime;
//import java.util.Arrays;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.when;
//
//public class MonitorServiceTest {
//
//    @InjectMocks
//    private MonitorService monitorService;
//
//    @Mock
//    private MonitorRepository monitorRepository;
//
//    @BeforeEach
//    public void setup() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void testGetRecords() {
//        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
//        LocalDateTime endTime = LocalDateTime.now();
//        List<MonitorRecord> expectedRecords = Arrays.asList(new MonitorRecord(), new MonitorRecord());
//
//        when(monitorRepository.findByTimestampBetween(startTime, endTime)).thenReturn(expectedRecords);
//
//        List<MonitorRecord> actualRecords = monitorService.getRecords(null, startTime, endTime);
//
//        assertEquals(expectedRecords, actualRecords);
//    }
//}