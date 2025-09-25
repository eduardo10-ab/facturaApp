package com.mh.dte.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mh.dte.config.JwtTokenUtil;
import com.mh.dte.entity.User;
import com.mh.dte.service.auth.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador de autenticación - CORREGIDO PARA CONTEXT PATH
 */
@RestController
@RequestMapping("/auth") // SIN /api/v1 porque ya está en context-path
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:3000", "http://127.0.0.1:8080", "http://localhost:5500", "http://127.0.0.1:5500"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestParam String user,
            @RequestParam String pwd) {
        
        logger.info("Intento de login para usuario: {}", user);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Autenticar usuario contra la base de datos
            User authenticatedUser = userService.getAuthenticatedUser(user, pwd);
            
            // Generar token JWT
            String token = jwtTokenUtil.generateToken(authenticatedUser.getUsername());
            
            logger.info("Login exitoso para usuario: {}", user);
            
            // Preparar respuesta exitosa
            Map<String, Object> bodyData = new HashMap<>();
            bodyData.put("user", authenticatedUser.getUsername());
            bodyData.put("nit", authenticatedUser.getNit());
            bodyData.put("companyName", authenticatedUser.getCompanyName());
            bodyData.put("token", "Bearer " + token);
            bodyData.put("tokenType", "Bearer");
            bodyData.put("role", authenticatedUser.getRole().name());
            
            Map<String, Object> roleInfo = new HashMap<>();
            roleInfo.put("nombre", authenticatedUser.getRole().name());
            roleInfo.put("codigo", "ROLE_" + authenticatedUser.getRole().name());
            roleInfo.put("descripcion", getRoleDescription(authenticatedUser.getRole()));
            roleInfo.put("activo", true);
            
            bodyData.put("rol", roleInfo);
            
            response.put("status", "OK");
            response.put("body", bodyData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error en login para usuario: {}, Error: {}", user, e.getMessage());
            
            // Login fallido
            response.put("status", "ERROR");
            response.put("error", "Unauthorized");
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestParam String nit,
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String companyName,
            @RequestParam(required = false) String email) {
        
        logger.info("Intento de registro para usuario: {}", username);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Crear nuevo usuario
            User newUser = userService.createUser(nit, username, password, companyName, email);
            
            logger.info("Usuario registrado exitosamente: {}", username);
            
            response.put("status", "OK");
            response.put("message", "Usuario creado exitosamente");
            response.put("userId", newUser.getId());
            response.put("username", newUser.getUsername());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error en registro para usuario: {}, Error: {}", username, e.getMessage());
            
            response.put("status", "ERROR");
            response.put("error", "Registration Failed");
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(response);
        }
    }

    private String getRoleDescription(User.UserRole role) {
        switch (role) {
            case ADMIN:
                return "Administrador del sistema";
            case CONTRIBUTOR:
                return "Contribuyente emisor de DTE";
            case VIEWER:
                return "Usuario solo lectura";
            default:
                return "Usuario";
        }
    }
}