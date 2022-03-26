package com.server.entries.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
public class EntryRequest {
    private String description;
    private boolean completed;
    private boolean removed;
    private Date dueDate;
}