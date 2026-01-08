package com.uca.scheduleapp.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ResetPasswordRequest {

    @JsonProperty("token")
    private String token; // This will hold your 6-digit OTP
    @JsonProperty("newPassword")
    private String newPassword;

    public ResetPasswordRequest() {}

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
