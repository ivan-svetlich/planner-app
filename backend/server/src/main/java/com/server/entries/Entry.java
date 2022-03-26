package com.server.entries;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.server.users.AppUser;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "entry")
public class Entry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String description;
    private boolean completed;
    private boolean removed;
    @Column(name = "due_date")
    private Date dueDate;
    @Column(name = "created_on")
    @CreationTimestamp
    private Timestamp createdOn;
    @Column(name = "updated_on")
    @UpdateTimestamp
    private Timestamp updatedOn;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private AppUser user;

    public Entry(String description, Date dueDate) {
        this.description = description;
        this.completed = false;
        this.removed = false;
        this.dueDate = dueDate;
    }
}
