package com.access.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.access.auth.models.UserModel;
import com.access.auth.signupservice.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/logout")
public class LogoutController {

	@Autowired
	private UserService userService;

	@GetMapping("/")
	public String logout(HttpServletRequest request, HttpServletResponse response) {
		// Delete the HttpOnly cookie by setting an empty value and an expiration date
		// in the past
		Cookie jwtCookie = new Cookie("access_token", "");
		jwtCookie.setMaxAge(0);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setPath("/");
		response.addCookie(jwtCookie);

		// Perform any other necessary cleanup
		request.getSession().invalidate();
		SecurityContextHolder.clearContext();

		Cookie jsessionidCookie = new Cookie("JSESSIONID", "");
		jsessionidCookie.setMaxAge(0);
		jsessionidCookie.setPath("/");
		response.addCookie(jsessionidCookie);

		log.info("logging out");

		return "Logged out!";
	}

	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteUser(@RequestBody UserModel userModal) {
		boolean deletionSuccess = userService.deleteUserByUsername(userModal.getUserName());

		if (deletionSuccess) {
			return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
		}
		return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
	}
}
