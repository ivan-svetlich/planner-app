package com.server.entries.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class IntervalResponse {
    private Date dueDate;
    private List<EntryResponse> entries;
}
