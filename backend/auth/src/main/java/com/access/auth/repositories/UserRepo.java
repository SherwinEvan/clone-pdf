package com.access.auth.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.access.auth.entities.UserEntity;

public interface UserRepo extends JpaRepository<UserEntity, Long> {

	UserEntity findByEmail(String email);

	UserEntity findByUserName(String username);

	@Query("SELECT u.email FROM UserEntity u WHERE u.userName = :userName")
    String findEmailByuserName(@Param("userName") String userName);

}
