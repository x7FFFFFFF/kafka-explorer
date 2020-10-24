package org.kafka.explorer.rest;

import org.apache.kafka.clients.consumer.Consumer;
import org.kafka.explorer.dao.Message;
import org.kafka.explorer.dao.MessagesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping(path = "api", produces = "application/json")
public class MessagesController {
    private final MessagesRepo messagesRepo;
    private final ConsumerFactory<String, String> consumerFactory;

    @Autowired
    public MessagesController(MessagesRepo messagesRepo, ConsumerFactory<String, String> consumerFactory) {
        this.messagesRepo = messagesRepo;
        this.consumerFactory = consumerFactory;
    }

    @GetMapping(value = "/messages", params = {"page", "size", "topic"})
    public Page<Message> findPaginated(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("topic") String topic) {

        final Page<Message> resultPage = messagesRepo.findAllByTopicOrderByCreatedDesc(topic, PageRequest.of(page, size));

        if (page > resultPage.getTotalPages()) {
            throw new RuntimeException("Not found");
        }
        return resultPage;
    }

    @GetMapping(value = "/topics")
    public Set<String> getTopics() {
        try (final Consumer<String, String> consumer = consumerFactory.createConsumer()) {
            return consumer.listTopics().keySet();
        }
    }


}
