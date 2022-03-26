package com.server.users;

import com.server.errors.HttpError;
import com.server.users.dto.response.JwtResponse;
import com.server.users.dto.response.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.server.security.JwtUtils;
import com.server.users.dto.request.LoginRequest;
import com.server.users.dto.request.NewUserRequest;
import com.server.users.dto.response.MessageResponse;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class UsersController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            }
            catch (AuthenticationException ex) {
                ex.printStackTrace();
                return new ResponseEntity(new HttpError(HttpStatus.UNAUTHORIZED.toString(),
                        new Date(),
                        "Wrong username or password!"), HttpStatus.UNAUTHORIZED);
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            AppUser userDetails = (AppUser) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            JwtResponse jwtResponse = new JwtResponse(jwt);

            return ResponseEntity.ok(new LoginResponse(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles,
                    jwtResponse));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                            new Date(), "Internal server error. Try again later."));
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody NewUserRequest signUpRequest) {
        try {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body(new HttpError(HttpStatus.BAD_REQUEST.toString(),
                                new Date(), "Username is already taken!"));
            }
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new HttpError(HttpStatus.BAD_REQUEST.toString(),
                                new Date(), "Email is already in use!"));
            }
            if (!Objects.equals(signUpRequest.getPassword(), signUpRequest.getRePassword())) {
                return ResponseEntity
                        .badRequest()
                        .body(new HttpError(HttpStatus.BAD_REQUEST.toString(),
                                new Date(), "Passwords don't match!"));
            }

            return ResponseEntity.ok(userService.create(signUpRequest));
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