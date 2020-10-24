package org.kafka.explorer.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessagesRepo extends JpaRepository<Message, Long> {

    Page<Message> findAllByTopicOrderByCreatedDesc(String topic, Pageable page);
}
