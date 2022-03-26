package com.server.users.mapper;

import com.server.roles.Role;
import com.server.users.dto.request.NewUserRequest;
import com.server.users.dto.response.UserView;
import org.springframework.stereotype.Service;
import com.server.roles.ERole;
import com.server.users.AppUser;

@Service
public class UserMapper {
    public AppUser newUserRequestToAppUser(NewUserRequest request) {
        if (request.getRole() == null) {
            request.setRole(ERole.valueOf(Role.ROLE_USER));
        }

        return new AppUser(
                request.getUsername(),
                request.getEmail(),
                request.getRole());
    }
    public UserView appUserToUserView(AppUser user) {

        return new UserView(
                Long.toString(user.getId()),
                user.getUsername(),
                user.getEmail());
    }
}
