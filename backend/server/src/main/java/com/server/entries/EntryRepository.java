package com.server.entries.repository;

import com.server.entries.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Integer> {

    List<Entry> findAllById(long id);

    @Query( "SELECT e FROM Entry e WHERE e.user.id = :userId AND e.dueDate BETWEEN :startDate AND :endDate")
    List<Entry> findByInterval(@Param("userId") long userId,
                                  @Param("startDate") Date startDate,
                                  @Param("endDate") Date endDate);
}