package org.kafka.explorer.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.kafka.explorer.dao.Message;
import org.kafka.explorer.dao.MessagesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;

@Component
public class KafkaTopicListener {

    private final MessagesRepo messagesRepo;

    @Autowired
    public KafkaTopicListener(MessagesRepo messagesRepo) {
        this.messagesRepo = messagesRepo;
    }

    private Message toMessage(ConsumerRecord<String, String> record) {
        final Message result = new Message();
        result.setCreated(LocalDateTime.ofInstant(Instant.ofEpochMilli(record.timestamp()),
                TimeZone.getDefault().toZoneId()));
        result.setTopic(record.topic());
        result.setMessage(record.value());
        return result;
    }

    @KafkaListener(topics = "#{'${kafka.topics}'.split(',')}", containerFactory = "kafkaListenerContainerFactory")
    public void listenToPartition(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_TIMESTAMP) long created,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_MESSAGE_KEY) String key,
            @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition
    ) {
        final Message result = new Message();
        result.setCreated(LocalDateTime.ofInstant(Instant.ofEpochMilli(created),
                TimeZone.getDefault().toZoneId()));
        result.setTopic(topic);
        result.setMessage(message);
        result.setKey(key);
        result.setPartition(partition);
        messagesRepo.save(result);
    }

}
