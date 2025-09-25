package com.mh.dte.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de prueba para verificar que la aplicación funciona
 */
@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> publicEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Endpoint público funcionando");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "OK");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/protected")
    public ResponseEntity<Map<String, Object>> protectedEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Endpoint protegido funcionando");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "OK");
        response.put("authenticated", true);
        
        return ResponseEntity.ok(response);
    }
}