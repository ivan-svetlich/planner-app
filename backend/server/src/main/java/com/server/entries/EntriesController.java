package com.server.entries;

import com.server.entries.dto.request.EntryRequest;
import com.server.entries.mapper.EntryMapper;
import com.server.errors.HttpError;
import com.server.users.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Objects;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/entries")
@ComponentScan
public class EntriesController {
    @Autowired
    EntryService entryService;
    @Autowired
    EntryMapper entryMapper;
    //POST
    @PostMapping("/")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> addEntry(@RequestBody EntryRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Entry entry = new Entry(request.getDescription(), request.getDueDate());
            entry.setUser((AppUser) auth.getPrincipal());
            entryService.saveEntry(entry);
            return new ResponseEntity<>(entryMapper.entryToEntryResponse(entry), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                            new Date(), "Internal server error. Try again later."));
        }
    }

    //PUT
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateEntry(@PathVariable int id,
                                                     @RequestBody EntryRequest entryRequest) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Entry entry = entryService.getEntryById(id);
            if(entry == null) {
                return ResponseEntity
                        .badRequest()
                        .body(new HttpError(HttpStatus.BAD_REQUEST.toString(),
                                new Date(), "Invalid entry ID"));
            }
            AppUser user = (AppUser) auth.getPrincipal();
            if(!Objects.equals(user.getId(), entry.getUser().getId())) {
                return new ResponseEntity<>(new HttpError(HttpStatus.UNAUTHORIZED.toString(),
                        new Date(), "Unauthorized"), HttpStatus.UNAUTHORIZED);
            }
            entry.setCompleted(entryRequest.isCompleted());
            entry.setRemoved(entryRequest.isRemoved());
            entryService.saveEntry(entry);
            return new ResponseEntity<>(entryMapper.entryToEntryResponse(entry), HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                            new Date(), "Internal server error. Try again later."));
        }
    }
    //DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteEntry(@PathVariable int id) {
        try {
            Entry entry = entryService.getEntryById(id);
            if(entry == null) {
                return new ResponseEntity<>(new HttpError(HttpStatus.NOT_FOUND.toString(),
                        new Date(), "Entry not found"), HttpStatus.NOT_FOUND);
            }
            String removed = entryService.deleteEntry(entry);
            return new ResponseEntity<>(removed, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                            new Date(), "Internal server error. Try again later."));
        }
    }
    //GET
    @GetMapping("/")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getEntriesByInterval(
            @RequestParam(name = "start_date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(name = "end_date") @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            AppUser user = (AppUser) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();

            return ResponseEntity.ok(entryService.getEntriesByInterval(user.getId(),
                    new java.sql.Date(startDate.getTime()),
                    new java.sql.Date(endDate.getTime())));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                            new Date(), "Internal server error. Try again later."));
        }
    }

}