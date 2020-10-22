package org.kafka.explorer.rest;

import org.kafka.explorer.dao.Message;
import org.kafka.explorer.dao.MessagesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "api")
public class MessagesController {
    private final MessagesRepo messagesRepo;

    @Autowired
    public MessagesController(MessagesRepo messagesRepo) {
        this.messagesRepo = messagesRepo;
    }

    @GetMapping(value = "/messages", params = {"page", "size", "topic"}, produces = "application/json")
    public Page<Message> findPaginated(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("topic") String topic) {

        final Page<Message> resultPage = messagesRepo.findAllByTopic(topic, PageRequest.of(page, size));

        /*if (page > resultPage.getTotalPages()) {
            throw new RuntimeException("Not found");
        }*/
        return resultPage;
    }


}
