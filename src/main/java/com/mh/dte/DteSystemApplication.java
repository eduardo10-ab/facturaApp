package com.mh.dte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Aplicación principal del Sistema de Documentos Tributarios Electrónicos
 * 
 * @author Sistema DTE
 * @version 1.0.0
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
public class DteSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(DteSystemApplication.class, args);
    }
}