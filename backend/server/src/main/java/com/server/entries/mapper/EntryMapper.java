package com.server.entries.mapper;

import com.server.entries.Entry;
import org.springframework.stereotype.Service;
import com.server.entries.dto.response.EntryResponse;

import java.text.SimpleDateFormat;

@Service
public class EntryMapper {
    public EntryResponse entryToEntryResponse(Entry entry) {
        return new EntryResponse(
                entry.getId(),
                entry.getDescription(),
                entry.isCompleted(),
                entry.isRemoved(),
                entry.getDueDate()
        );
    }
}
