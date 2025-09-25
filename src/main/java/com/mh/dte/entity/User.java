package com.mh.dte.entity;

import java.time.LocalDateTime;

import com.mh.dte.config.UserRoleConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_nit", columnList = "nit"),
    @Index(name = "idx_users_username", columnList = "username"),
    @Index(name = "idx_users_active", columnList = "active")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "nit", unique = true, length = 14)
    private String nit;

    @NotBlank
    @Column(name = "username", unique = true, length = 50)
    private String username;

    @NotBlank
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @NotBlank
    @Column(name = "company_name", length = 255)
    private String companyName;

    @Email
    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "active")
    private Boolean active = true;

    @Convert(converter = UserRoleConverter.class)
    @Column(name = "role")
    private UserRole role = UserRole.CONTRIBUTOR;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

    // Constructores
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public User(String nit, String username, String passwordHash, String companyName) {
        this();
        this.nit = nit;
        this.username = username;
        this.passwordHash = passwordHash;
        this.companyName = companyName;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNit() { return nit; }
    public void setNit(String nit) { this.nit = nit; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public Integer getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(Integer failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }

    public LocalDateTime getAccountLockedUntil() { return accountLockedUntil; }
    public void setAccountLockedUntil(LocalDateTime accountLockedUntil) { this.accountLockedUntil = accountLockedUntil; }

    // Métodos de utilidad
    public boolean isAccountLocked() {
        return accountLockedUntil != null && accountLockedUntil.isAfter(LocalDateTime.now());
    }

    public void lockAccount(int minutes) {
        this.accountLockedUntil = LocalDateTime.now().plusMinutes(minutes);
    }

    public void unlockAccount() {
        this.accountLockedUntil = null;
        this.failedLoginAttempts = 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum UserRole {
        ADMIN,
        CONTRIBUTOR,
        VIEWER
    }
}