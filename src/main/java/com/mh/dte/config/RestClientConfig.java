package com.mh.dte.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Configuración para clientes HTTP utilizados en el sistema
 */
@Configuration
public class RestClientConfig {

    @Value("${dte.api.base-url}")
    private String mhApiBaseUrl;

    @Value("${dte.signature.service-url}")
    private String signatureServiceUrl;

    @Value("${dte.api.timeout:8000}")
    private int apiTimeout;

    @Value("${dte.signature.timeout:30000}")
    private int signatureTimeout;

    /**
     * Cliente para comunicación con APIs del Ministerio de Hacienda
     */
    @Bean("mhApiWebClient")
    public WebClient mhApiWebClient() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, apiTimeout)
                .responseTimeout(Duration.ofMillis(apiTimeout))
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(apiTimeout, TimeUnit.MILLISECONDS))
                                .addHandlerLast(new WriteTimeoutHandler(apiTimeout, TimeUnit.MILLISECONDS)));

        return WebClient.builder()
                .baseUrl(mhApiBaseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB
                .defaultHeader("User-Agent", "DTE-System/1.0.0")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Cliente para comunicación con servicio de firma electrónica
     */
    @Bean("signatureWebClient")
    public WebClient signatureWebClient() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, signatureTimeout)
                .responseTimeout(Duration.ofMillis(signatureTimeout))
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(signatureTimeout, TimeUnit.MILLISECONDS))
                                .addHandlerLast(new WriteTimeoutHandler(signatureTimeout, TimeUnit.MILLISECONDS)));

        return WebClient.builder()
                .baseUrl(signatureServiceUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader("User-Agent", "DTE-System/1.0.0")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Cliente genérico para otros servicios
     */
    @Bean("genericWebClient")
    public WebClient genericWebClient() {
        return WebClient.builder()
                .defaultHeader("User-Agent", "DTE-System/1.0.0")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(5 * 1024 * 1024)) // 5MB
                .build();
    }
}