package com.access.auth.models;

import lombok.Data;

@Data
public class PasswordModel {

	private String userName;

	private String oldPassword;

	private String newPassword;

	private String oldToken;
}
