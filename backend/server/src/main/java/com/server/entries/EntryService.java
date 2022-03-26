package com.server.entries;

import com.server.entries.dto.response.EntryResponse;
import com.server.entries.dto.response.IntervalResponse;
import com.server.entries.mapper.EntryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.server.entries.repository.EntryRepository;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntryService {

    private final EntryRepository entryRepository;
    @Autowired
    EntryMapper entryMapper;

    //POST
    public Entry saveEntry(Entry entry) {
        return entryRepository.save(entry);
    }

    //GET
    public List<IntervalResponse> getEntriesByInterval(long userId, Date startDate, Date endDate) {
        List<Entry> entries = entryRepository.findByInterval(userId, startDate, endDate);
        List<IntervalResponse> response = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        Calendar c = Calendar.getInstance();
        c.setTime(startDate); // Now use today date.

        while(c.getTime().compareTo(endDate) <= 0) {
            List<EntryResponse> entriesForTheDay = entries.stream()
                    .filter(entry -> sdf.format(entry.getDueDate()).equals(sdf.format(c.getTime())))
                    .map(entryMapper::entryToEntryResponse)
                    .collect(Collectors.toList());
            response.add(new IntervalResponse(c.getTime(), entriesForTheDay));
            c.add(Calendar.DATE, 1); // Adding 5 days
        }
        return response;
    }
    public Entry getEntryById(int id) {
        return entryRepository.findById(id).orElse(null);
    }

    //PUT
    public Entry updateEntry(Entry entry) {
        Entry existingEntry = entryRepository.findById(entry.getId()).orElse(null);
        existingEntry.setCompleted(entry.isCompleted());
        existingEntry.setRemoved(entry.isRemoved());
        return entryRepository.save(existingEntry);
    }

    //DELETE
    public String deleteEntry(Entry entry) {
        int id = entry.getId();
        entryRepository.deleteById(id);
        return id + " id -> entry removed";
    }

}