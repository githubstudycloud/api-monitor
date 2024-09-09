//package com.yourcompany.monitor;
//
//import com.yourcompany.monitor.model.MonitorRecord;
//import com.yourcompany.monitor.repository.MonitorRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//@DataJpaTest
//public class MonitorRepositoryTest {
//
//    @Autowired
//    private TestEntityManager entityManager;
//
//    @Autowired
//    private MonitorRepository monitorRepository;
//
//    @Test
//    public void testFindByTimestampBetween() {
//        MonitorRecord record1 = new MonitorRecord();
//        record1.setTimestamp(LocalDateTime.now().minusHours(2));
//        MonitorRecord record2 = new MonitorRecord();
//        record2.setTimestamp(LocalDateTime.now().minusHours(1));
//
//        entityManager.persist(record1);
//        entityManager.persist(record2);
//        entityManager.flush();
//
//        LocalDateTime startTime = LocalDateTime.now().minusHours(3);
//        LocalDateTime endTime = LocalDateTime.now();
//
//        List<MonitorRecord> found = monitorRepository.findByTimestampBetween(startTime, endTime);
//
//        assertEquals(2, found.size());
//    }
//}