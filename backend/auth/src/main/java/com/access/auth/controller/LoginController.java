package com.access.auth.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.access.auth.entities.UserEntity;
import com.access.auth.loginservice.TokenService;
import com.access.auth.models.UserModel;
import com.access.auth.repositories.UserRepo;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/login")
public class LoginController {

	private final TokenService tokenService;

	private final UserRepo userRepo;

	private final AuthenticationManager authenticationManager;

	public LoginController(TokenService tokenService, AuthenticationManager authenticationManager, UserRepo userRepo,
			PasswordEncoder passwordEncoder) {
		this.tokenService = tokenService;
		this.authenticationManager = authenticationManager;
		this.userRepo = userRepo;
	}

	@PostMapping("/")
	public ResponseEntity<?> token(@RequestBody UserModel loginUser, HttpServletResponse response) throws Exception {

		UserEntity userEntity = userRepo.findByUserName(loginUser.getUserName());
		if (userEntity.getUserName() != null) {
			if (!userEntity.isEnabled())
				return ResponseEntity.ok("Activate your account!");

			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(userEntity.getUserName(), userEntity.getPassword()));

			String accessToken = tokenService.generateToken(authentication);

			Cookie cookie = new Cookie("access_token", accessToken);
			cookie.setMaxAge(864000); // Set cookie to expire in 1 Day
			cookie.setPath("/");
			cookie.setHttpOnly(true);
			response.addCookie(cookie);

			return ResponseEntity.ok("Login successful");

		}
		return ResponseEntity.ok("Invalid Credentials!");
	}
	

	@GetMapping("/")
	public String home(Principal principal) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.isAuthenticated()) {
			// User is authenticated
			log.info("Authenticated!");
			String currentUserName = authentication.getName();
			return currentUserName;
		} else {
			// User is not authenticated
			log.info("Not Authenticated!");
		}

		return "Not logged in!";
	}
	
	@GetMapping("/email")
	public String email(Principal principal) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.isAuthenticated()) {
			// User is authenticated
			log.info("Authenticated!");
			String currentUserName = authentication.getName();
			return userRepo.findEmailByuserName(currentUserName);
		} else {
			// User is not authenticated
			log.info("Not Authenticated!");
		}

		return "Not logged in!";
	}
}
