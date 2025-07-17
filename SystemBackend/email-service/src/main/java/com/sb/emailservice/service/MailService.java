package com.sb.emailservice.service;


public interface MailService {

    void sendLoginDetails(String email, String username, String password);

}
