package org.kafka.explorer.dao;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(indexes = {@Index(name = "IDX_TOPIC", columnList = "topic"),
        @Index(name = "IDX_TIMESTAMP", columnList = "created"),
        /* @Index(name = "IDX_MESSAGE", columnList = "message")*/
})
@SequenceGenerator(name = "seq", initialValue = 100)
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq")
    private long id;
    @Column(nullable = false)
    private String topic;
    @Column(nullable = false)
    private LocalDateTime created;
    @Column(nullable = false)
    @Lob
    private String message;
    @Column(nullable = false)
    private String key;
    @Column(nullable = false)
    private int partition;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getPartition() {
        return partition;
    }

    public void setPartition(int partition) {
        this.partition = partition;
    }
}
