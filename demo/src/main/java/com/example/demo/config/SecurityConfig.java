package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/", "/index.html", "/static/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/users/**").authenticated()
                .requestMatchers("/api/cart/**").permitAll()
                .requestMatchers("/api/wishlist/**").permitAll()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
