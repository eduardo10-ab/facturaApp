package com.mh.dte.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mh.dte.entity.User;
import com.mh.dte.service.auth.UserService;

/**
 * Controlador para gestión de usuarios (solo para administradores)
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@CrossOrigin(origins = "*")
public class UserManagementController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> listUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> users = userService.findActiveUsers();
            
            List<Map<String, Object>> userList = users.stream()
                .map(this::convertUserToResponse)
                .collect(Collectors.toList());
            
            response.put("status", "OK");
            response.put("users", userList);
            response.put("total", userList.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createUser(
            @RequestParam String nit,
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String companyName,
            @RequestParam(required = false) String email) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User newUser = userService.createUser(nit, username, password, companyName, email);
            
            response.put("status", "OK");
            response.put("message", "Usuario creado exitosamente");
            response.put("user", convertUserToResponse(newUser));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", "User Creation Failed");
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/{userId}/toggle-active")
    public ResponseEntity<Map<String, Object>> toggleUserActive(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            userService.toggleUserActive(userId);
            
            response.put("status", "OK");
            response.put("message", "Estado del usuario actualizado");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/{userId}/unlock")
    public ResponseEntity<Map<String, Object>> unlockAccount(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            userService.unlockAccount(userId);
            
            response.put("status", "OK");
            response.put("message", "Cuenta desbloqueada exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            response.put("status", "OK");
            response.put("user", convertUserToDetailedResponse(user));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        }
    }

    // Método para convertir User a respuesta básica
    private Map<String, Object> convertUserToResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("nit", user.getNit());
        userMap.put("username", user.getUsername());
        userMap.put("companyName", user.getCompanyName());
        userMap.put("email", user.getEmail());
        userMap.put("active", user.getActive());
        userMap.put("role", user.getRole().name());
        userMap.put("createdAt", user.getCreatedAt());
        userMap.put("lastLogin", user.getLastLogin());
        return userMap;
    }

    // Método para convertir User a respuesta detallada
    private Map<String, Object> convertUserToDetailedResponse(User user) {
        Map<String, Object> userMap = convertUserToResponse(user);
        userMap.put("phone", user.getPhone());
        userMap.put("updatedAt", user.getUpdatedAt());
        userMap.put("failedLoginAttempts", user.getFailedLoginAttempts());
        userMap.put("isAccountLocked", user.isAccountLocked());
        userMap.put("accountLockedUntil", user.getAccountLockedUntil());
        return userMap;
    }
}
