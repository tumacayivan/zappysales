package com.assessment.usermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the User Management Base Service.
 *
 * Exposes a REST API for managing users and their addresses (1-to-many).
 * Data is held in-memory via a runtime list, seeded with sample records.
 */
@SpringBootApplication
public class UserManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserManagementApplication.class, args);
    }
}
