package com.mh.dte.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mh.dte.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar por username
    Optional<User> findByUsername(String username);

    // Buscar por NIT
    Optional<User> findByNit(String nit);

    // Buscar por username o NIT
    @Query("SELECT u FROM User u WHERE u.username = :login OR u.nit = :login")
    Optional<User> findByUsernameOrNit(@Param("login") String login);

    // Buscar usuarios activos
    List<User> findByActiveTrue();

    // Buscar por email
    Optional<User> findByEmail(String email);

    // Verificar si existe username
    boolean existsByUsername(String username);

    // Verificar si existe NIT
    boolean existsByNit(String nit);

    // Actualizar último login
    @Modifying
    @Query("UPDATE User u SET u.lastLogin = :loginTime WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);

    // Incrementar intentos fallidos
    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.id = :userId")
    void incrementFailedLoginAttempts(@Param("userId") Long userId);

    // Resetear intentos fallidos
    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0 WHERE u.id = :userId")
    void resetFailedLoginAttempts(@Param("userId") Long userId);

    // Bloquear cuenta
    @Modifying
    @Query("UPDATE User u SET u.accountLockedUntil = :lockUntil WHERE u.id = :userId")
    void lockAccount(@Param("userId") Long userId, @Param("lockUntil") LocalDateTime lockUntil);

    // Desbloquear cuenta
    @Modifying
    @Query("UPDATE User u SET u.accountLockedUntil = NULL, u.failedLoginAttempts = 0 WHERE u.id = :userId")
    void unlockAccount(@Param("userId") Long userId);

    // Buscar cuentas bloqueadas que ya pueden ser desbloqueadas
    @Query("SELECT u FROM User u WHERE u.accountLockedUntil IS NOT NULL AND u.accountLockedUntil < :now")
    List<User> findAccountsToUnlock(@Param("now") LocalDateTime now);
}