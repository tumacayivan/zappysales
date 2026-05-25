package com.assessment.usermanagement.controller;

import com.assessment.usermanagement.dto.UserRequest;
import com.assessment.usermanagement.dto.UserWithAddressesResponse;
import com.assessment.usermanagement.model.User;
import com.assessment.usermanagement.service.BaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * /api/users
 *
 * GET    /api/users         — list (used by the User List page)
 * GET    /api/users/{id}    — single user + addresses (used by detail page)
 * POST   /api/users         — create
 * PUT    /api/users/{id}    — update
 * DELETE /api/users/{id}    — remove (cascades addresses)
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final BaseService base;

    public UserController(BaseService base) {
        this.base = base;
    }

    @GetMapping
    public List<User> list() {
        return base.listUsers();
    }

    @GetMapping("/{id}")
    public UserWithAddressesResponse get(@PathVariable Long id) {
        return new UserWithAddressesResponse(
                base.getUser(id),
                base.listAddressesForUser(id)
        );
    }

    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody UserRequest body) {
        User created = base.createUser(body.getEmail(), body.getFirstName(), body.getLastName());
        return ResponseEntity
                .created(URI.create("/api/users/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @Valid @RequestBody UserRequest body) {
        return base.updateUser(id, body.getEmail(), body.getFirstName(), body.getLastName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        base.deleteUser(id);
    }
}
