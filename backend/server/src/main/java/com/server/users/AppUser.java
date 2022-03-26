package com.server.users;


import com.server.entries.Entry;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.server.roles.ERole;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "app_user")
public class AppUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true)
    private String username;
    @Column(unique=true)
    private String email;
    private String password;
    @OneToMany(targetEntity= Entry.class, mappedBy="user", fetch=FetchType.EAGER)
    private List<Entry> entries = new java.util.ArrayList<>();
    @Enumerated(EnumType.STRING)
    private ERole role;
    private boolean enabled = true;

    public AppUser(String username,
                   String email,
                   ERole role) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.enabled = true;
    }

    public AppUser() {};

    public Long getId() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() {
        return this.password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public List<Entry> getEntries() { return entries; }
    public void setEntries(List<Entry> entries) { this.entries = entries; }

    @Override
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> roles = new ArrayList<>();
        roles.add(new SimpleGrantedAuthority(role.toString()));
        return roles;
    }

    @Override
    public boolean isAccountNonExpired() { return enabled; }

    @Override
    public boolean isAccountNonLocked() { return enabled; }

    @Override
    public boolean isCredentialsNonExpired() { return enabled; }
}