package com.server.users.dto.request;

import com.server.roles.ERole;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class NewUserRequest {
    @NotBlank
    private String username;
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String rePassword;
    private ERole role;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRePassword() { return rePassword; }


    public ERole getRole() { return role; }

    public void setRole(ERole role) { this.role = role; }

}
