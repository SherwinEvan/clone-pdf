package com.access.auth.security.config;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;

import com.access.auth.entities.UserEntity;
import com.access.auth.repositories.UserRepo;
import com.access.auth.rsa.Jwks;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	/*@Autowired
    private UserDetailsService userDetailsService;
	*/
	private static RSAKey rsaKeys;
	
	private static final String[] WHITE_LIST_URL = {
			"/auth/**",
			"/signup/**",
			"/login/**",
			"/logout/**"
	};

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(WHITE_LIST_URL).permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                                .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                                .accessDeniedHandler(new BearerTokenAccessDeniedHandler())
                )
                .addFilterAfter(new CookieAuthorizationFilter(jwtDecoder(), new JwtAuthenticationConverter()), SecurityContextPersistenceFilter.class)
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(11);
    }


    @Bean
    JWKSource<SecurityContext> jwkSource() {
        rsaKeys = Jwks.generateRsa();
        JWKSet jwkSet = new JWKSet(rsaKeys);
        return (jwkSelector, securityContext) -> jwkSelector.select(jwkSet);
    }
	
	@Bean
	JwtDecoder jwtDecoder() throws JOSEException {
        return NimbusJwtDecoder.withPublicKey(rsaKeys.toRSAPublicKey()).build();
	}
	
	@Bean
	JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwks) {
        return new NimbusJwtEncoder(jwks);
    }
	
	@Bean
    AuthenticationManager authManager(UserDetailsService userDetailsService) {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        return new ProviderManager(authProvider);
    }
	
	
	/*
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder(11));
    }*/
	
	@Bean
	UserDetailsService user(UserRepo userRepository) {
	    return username -> {
	        Optional<UserEntity> userEntity = Optional.ofNullable(userRepository.findByUserName(username));
	        if (userEntity.isPresent()) {
	            UserEntity user = userEntity.get();
	            List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
	            return User.builder()
	                    .username(user.getUserName())
	                    .password("{noop}"+user.getPassword())
	                    .authorities(authorities)
	                    .build();
	        } else {
	            throw new UsernameNotFoundException("UserEntity not found: " + username);
	        }
	    };
	}
}
