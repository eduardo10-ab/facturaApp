package com.mh.dte.config;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * Utilidad para manejar tokens JWT
 */
 
@Component
public class JwtTokenUtil {

private Key getSigningKey() {
    byte[] keyBytes;
    try {
        // Intentar decodificar como Base64
        keyBytes = Base64.getDecoder().decode(secret);
    } catch (IllegalArgumentException e) {
        // Si no es Base64 válido, usar como string directo
        keyBytes = secret.getBytes();
    }
    
    // Verificar que tenga al menos 64 bytes para HS512
    if (keyBytes.length < 64) {
        throw new RuntimeException("JWT secret debe tener al menos 64 bytes para HS512");
    }
    
    return new SecretKeySpec(keyBytes, "HmacSHA512");
}
    @Value("${dte.security.jwt.secret}")
    private String secret;

    @Value("${dte.security.jwt.expiration}")
    private Long expiration;

    // Recuperar username del token JWT
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // Recuperar fecha de expiración del token JWT
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // Para recuperar cualquier información del token necesitaremos la secret key
 private Claims getAllClaimsFromToken(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
}

    // Verificar si el token ha expirado
    private Boolean isTokenExpired(String token) {
        final Date expirationDate = getExpirationDateFromToken(token);
        return expirationDate.before(new Date());
    }

    // Generar token para usuario
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    // Crear el token
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Validar token
    public Boolean validateToken(String token, String username) {
        final String tokenUsername = getUsernameFromToken(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }
}