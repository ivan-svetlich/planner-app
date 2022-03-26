package com.server.entries.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Column;
import java.sql.Date;

@Data
@AllArgsConstructor
public class EntryResponse {
    private Integer id;
    private String description;
    private boolean completed;
    private boolean removed;
    private Date dueDate;
}
