package com.server.users.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String accessToken;
    private String type;

    public JwtResponse(String token) {
        this.type = "Bearer";
        this.accessToken = token;
    }
}
