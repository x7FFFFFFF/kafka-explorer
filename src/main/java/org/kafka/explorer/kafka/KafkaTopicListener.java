package org.kafka.explorer.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.kafka.explorer.dao.Message;
import org.kafka.explorer.dao.MessagesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.PartitionOffset;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.net.UnknownHostException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;

@Component
public class KafkaTopicListener {

    private final MessagesRepo messagesRepo;

    @Autowired
    public KafkaTopicListener(MessagesRepo messagesRepo) throws UnknownHostException {

        this.messagesRepo = messagesRepo;


    }/*

    @Async
    public void kafkaConsumer() {
        try(final KafkaConsumer<String, String> consumer = new KafkaConsumer<>(config)){
            final Map<String, List<PartitionInfo>> topics = consumer.listTopics();
            consumer.subscribe(topics.keySet());
            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Integer.MAX_VALUE);
                for (ConsumerRecord<String, String> record : records) {
                    messagesRepo.save(toMessage(record));
                }
                consumer.commitSync();
            }
        }
    }
*/

    private Message toMessage(ConsumerRecord<String, String> record) {
        final Message result = new Message();
        result.setCreated(LocalDateTime.ofInstant(Instant.ofEpochMilli(record.timestamp()),
                TimeZone.getDefault().toZoneId()));
        result.setTopic(record.topic());
        result.setMessage(record.value());
        return result;
    }

/*    @KafkaListener(*//*topics = "#{'${kafka.topics}'.split(',')}"*//*topicPartitions = {
            @TopicPartition(topic = "lunda_stocks", partitionOffsets = {@PartitionOffset(partition = "0", initialOffset = "1")})},
            containerFactory = "kafkaListenerContainerFactory")
    public void receive(ConsumerRecord<String, String> consumerRecord,
                        Acknowledgment acknowledgment) {


        messagesRepo.save(toMessage(consumerRecord));
        acknowledgment.acknowledge();
    }*/

   @KafkaListener(topics = "#{'${kafka.topics}'.split(',')}", containerFactory = "kafkaListenerContainerFactory")
   /*@KafkaListener(*//*topics = "#{'${kafka.topics}'.split(',')}"*//*topicPartitions = {
           @TopicPartition(topic = "lunda_stocks", partitionOffsets = {@PartitionOffset(partition = "0", initialOffset = "1")})},
           containerFactory = "kafkaListenerContainerFactory")*/
    public void listenToPartition(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_TIMESTAMP) long created, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        final Message result = new Message();
        result.setCreated(LocalDateTime.ofInstant(Instant.ofEpochMilli(created),
                TimeZone.getDefault().toZoneId()));
        result.setTopic(topic);
        result.setMessage(message);
        messagesRepo.save(result);
    }

}
