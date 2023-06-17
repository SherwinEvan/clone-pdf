package com.access.auth.security.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nimbusds.jose.JOSEException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieAuthorizationFilter extends OncePerRequestFilter {

	private final JwtDecoder jwtDecoder;
	private final JwtAuthenticationConverter jwtAuthenticationConverter;

	public CookieAuthorizationFilter(JwtDecoder jwtDecoder2, JwtAuthenticationConverter jwtAuthenticationConverter2)
			throws JOSEException {
		this.jwtDecoder = jwtDecoder2;
		this.jwtAuthenticationConverter = jwtAuthenticationConverter2;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String token = extractToken(request.getCookies());
		if (token != null) {
			Jwt jwt = jwtDecoder.decode(token);
			Authentication authentication = jwtAuthenticationConverter.convert(jwt);
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		filterChain.doFilter(request, response);
	}

	private String extractToken(Cookie[] cookies) {
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("access_token".equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}
}
