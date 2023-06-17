package com.access.auth.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.access.auth.entities.PasswordResetToken;

public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken, Long> {

	PasswordResetToken findByToken(String token);

}
