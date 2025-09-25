package com.mh.dte.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mh.dte.entity.User;
import com.mh.dte.repository.UserRepository;

/**
 * Controlador temporal para debug del login
 * ELIMINAR EN PRODUCCIÓN
 */
@RestController
@RequestMapping("/debug")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/test-password")
    public Map<String, Object> testPassword(
            @RequestParam String user,
            @RequestParam String pwd) {
        
        Map<String, Object> result = new HashMap<>();
        
        // 1. Buscar usuario
        Optional<User> userOpt = userRepository.findByUsernameOrNit(user);
        result.put("userFound", userOpt.isPresent());
        
        if (userOpt.isPresent()) {
            User dbUser = userOpt.get();
            result.put("username", dbUser.getUsername());
            result.put("nit", dbUser.getNit());
            result.put("active", dbUser.getActive());
            result.put("role", dbUser.getRole());
            result.put("failedAttempts", dbUser.getFailedLoginAttempts());
            result.put("isLocked", dbUser.isAccountLocked());
            result.put("storedHash", dbUser.getPasswordHash());
            
            // 2. Probar el hash
            boolean passwordMatches = passwordEncoder.matches(pwd, dbUser.getPasswordHash());
            result.put("passwordMatches", passwordMatches);
            
            // 3. Generar nuevo hash para comparar
            String newHash = passwordEncoder.encode(pwd);
            result.put("newHashGenerated", newHash);
            result.put("newHashMatches", passwordEncoder.matches(pwd, newHash));
            
        } else {
            result.put("error", "Usuario no encontrado");
        }
        
        return result;
    }

    @GetMapping("/generate-hash")
    public Map<String, Object> generateHash(@RequestParam String password) {
        Map<String, Object> result = new HashMap<>();
        String hash = passwordEncoder.encode(password);
        result.put("password", password);
        result.put("hash", hash);
        result.put("verification", passwordEncoder.matches(password, hash));
        return result;
    }
}