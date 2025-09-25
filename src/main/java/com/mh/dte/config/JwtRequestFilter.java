package com.mh.dte.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro para validar tokens JWT en cada request
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal( @NonNull HttpServletRequest request, 
                                     @NonNull HttpServletResponse response, 
                                     @NonNull FilterChain chain) throws ServletException, IOException {
        
        final String requestTokenHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwtToken = null;
        
        // El token JWT está en el formato "Bearer token"
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                logger.warn("Unable to get JWT Token");
            } catch (ExpiredJwtException e) {
                logger.warn("JWT Token has expired");
            } catch (MalformedJwtException e) {
                logger.warn("JWT Token is malformed");
            } catch (Exception e) {
                logger.warn("JWT Token validation error");
            }
        } else {
            logger.debug("JWT Token does not begin with Bearer String");
        }
        
        // Una vez obtenemos el token, validamos
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            if (jwtTokenUtil.validateToken(jwtToken, username)) {
                
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        username, null, 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                    
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        chain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // No filtrar endpoints públicos
        return path.startsWith("/api/v1/auth/") ||
               path.startsWith("/actuator/health") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/swagger-ui");
    }
}