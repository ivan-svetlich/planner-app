package com.server.errors;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class HttpError {
    private String status;
    private Date timestamp;
    private String message;
}
