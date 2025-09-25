package com.mh.dte.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.mh.dte.entity.User;
import com.mh.dte.service.auth.UserService;

/**
 * Inicialización de usuarios de prueba
 * Solo se ejecuta en perfil 'dev'
 */
@Component
@Profile("dev")
public class UserDataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        initializeTestUsers();
    }

    private void initializeTestUsers() {
        try {
            // Verificar si ya existen usuarios
            if (!userService.findActiveUsers().isEmpty()) {
                System.out.println("Usuarios ya inicializados, omitiendo creación...");
                return;
            }

            System.out.println("Inicializando usuarios de prueba...");

            // Usuario administrador
            createUserIfNotExists(
                "06140506901013", 
                "admin", 
                "admin123", 
                "Administrador Sistema DTE", 
                "admin@dte.gob.sv",
                User.UserRole.ADMIN
            );

            // Usuarios contribuyentes de prueba
            createUserIfNotExists(
                "11111111111114", 
                "empresa01", 
                "password123", 
                "Empresa Ejemplo 1", 
                "empresa01@example.com",
                User.UserRole.CONTRIBUTOR
            );

            createUserIfNotExists(
                "22222222222225", 
                "empresa02", 
                "password123", 
                "Empresa Ejemplo 2", 
                "empresa02@example.com",
                User.UserRole.CONTRIBUTOR
            );

            createUserIfNotExists(
                "33333333333336", 
                "facturador01", 
                "password123", 
                "Facturador Principal", 
                "facturador@example.com",
                User.UserRole.CONTRIBUTOR
            );

            System.out.println("Usuarios de prueba inicializados correctamente.");
            System.out.println("Credenciales de prueba:");
            System.out.println("- admin / admin123");
            System.out.println("- empresa01 / password123");
            System.out.println("- empresa02 / password123");
            System.out.println("- facturador01 / password123");

        } catch (Exception e) {
            System.err.println("Error inicializando usuarios: " + e.getMessage());
        }
    }

    private void createUserIfNotExists(String nit, String username, String password, 
                                     String companyName, String email, User.UserRole role) {
        try {
            if (userService.findByUsernameOrNit(username).isEmpty()) {
                User user = userService.createUser(nit, username, password, companyName, email);
                user.setRole(role);
                System.out.println("Usuario creado: " + username + " (" + role + ")");
            }
        } catch (Exception e) {
            System.err.println("Error creando usuario " + username + ": " + e.getMessage());
        }
    }
}