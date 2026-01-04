package com.punct.punct_banking;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain mySecurityRules(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // PUBLIC endpoint
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.POST, "/user").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/atms").permitAll()
                        .requestMatchers(HttpMethod.POST, "/documents/upload").permitAll()
                        .requestMatchers("/register", "/documents/**", "/auth/**").permitAll()

                        //DEV
                        .requestMatchers("/api/dev/**").permitAll()

                        .requestMatchers("/api/notifications/**").authenticated()



                        // ADMIN endpoint
                        .requestMatchers(HttpMethod.GET, "/user").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/user/promote/{username}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/atms").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/atms/**").hasRole("ADMIN")

                        // USER endpoint
                        .requestMatchers("/user/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/user/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/user/{id}").authenticated()

                        .anyRequest().authenticated())
                .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    // This method is automatically called by Spring in Authentication Manager
    // Then it checks if the password saved in the DB is the same as the one the
    // user tries to login with
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public SecretGenerator secretGenerator() {
        return new DefaultSecretGenerator();
    }

    @Bean
    public QrGenerator qrGenerator() {
        return new ZxingPngQrGenerator();
    }

    /* 
    @Bean
    public CodeVerifier codeVerifier() {
        return new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());
    }
    */

    @Bean
    public CodeVerifier codeVerifier() {
        DefaultCodeVerifier verifier =
            new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());

        verifier.setAllowedTimePeriodDiscrepancy(1); // mai adauga 30 de secunde la interval 

    return verifier;
}

}
