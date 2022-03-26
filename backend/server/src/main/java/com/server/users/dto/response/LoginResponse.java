package com.server.users.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoginResponse {
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private JwtResponse jwt;

    public LoginResponse(Long id, String username, String email, List<String> roles, JwtResponse jwt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.jwt = jwt;
    }
}
