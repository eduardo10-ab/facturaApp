package com.mh.dte.service.auth;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mh.dte.entity.User;
import com.mh.dte.repository.UserRepository;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCK_TIME_MINUTES = 30;

    /**
     * Crear un nuevo usuario
     */
    public User createUser(String nit, String username, String password, String companyName, String email) {
        // Verificar que no existan duplicados
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }
        
        if (userRepository.existsByNit(nit)) {
            throw new RuntimeException("El NIT ya está registrado");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setNit(nit);
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setCompanyName(companyName);
        user.setEmail(email);
        user.setActive(true);
        user.setRole(User.UserRole.CONTRIBUTOR);

        return userRepository.save(user);
    }

    /**
     * Autenticar usuario
     */
    public Optional<User> authenticateUser(String login, String password) {
        Optional<User> userOpt = userRepository.findByUsernameOrNit(login);
        
        if (!userOpt.isPresent()) {
            return Optional.empty();
        }

        User user = userOpt.get();

        // Verificar si la cuenta está activa
        if (!user.getActive()) {
            throw new RuntimeException("Cuenta desactivada");
        }

        // Verificar si la cuenta está bloqueada
        if (user.isAccountLocked()) {
            throw new RuntimeException("Cuenta bloqueada temporalmente. Intente más tarde.");
        }

        // Verificar contraseña
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            // Login exitoso
            handleSuccessfulLogin(user);
            return Optional.of(user);
        } else {
            // Login fallido
            handleFailedLogin(user);
            return Optional.empty();
        }
    }

    /**
     * Manejar login exitoso
     */
    private void handleSuccessfulLogin(User user) {
        user.setLastLogin(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        userRepository.save(user);
    }

    /**
     * Manejar login fallido
     */
    private void handleFailedLogin(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            user.lockAccount(LOCK_TIME_MINUTES);
        }

        userRepository.save(user);
    }

    /**
     * Cambiar contraseña
     */
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Buscar usuario por username o NIT
     */
    public Optional<User> findByUsernameOrNit(String login) {
        return userRepository.findByUsernameOrNit(login);
    }

    /**
     * Buscar usuario por ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Obtener todos los usuarios activos
     */
    public List<User> findActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    /**
     * Activar/Desactivar usuario
     */
    public void toggleUserActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setActive(!user.getActive());
        userRepository.save(user);
    }

    /**
     * Desbloquear cuenta manualmente
     */
    public void unlockAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.unlockAccount();
        userRepository.save(user);
    }

    /**
     * Validar credenciales para el sistema (método utilizado por JWT)
     */
    public boolean validateCredentials(String login, String password) {
        return authenticateUser(login, password).isPresent();
    }

    /**
     * Obtener usuario autenticado por login
     */
    public User getAuthenticatedUser(String login, String password) {
        return authenticateUser(login, password)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
    }
}