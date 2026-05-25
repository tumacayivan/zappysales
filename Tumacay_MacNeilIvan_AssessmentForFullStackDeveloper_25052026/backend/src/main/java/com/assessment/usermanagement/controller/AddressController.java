package com.assessment.usermanagement.controller;

import com.assessment.usermanagement.dto.AddressRequest;
import com.assessment.usermanagement.model.Address;
import com.assessment.usermanagement.service.BaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * /api/users/{userId}/addresses
 *
 * The nested route makes the 1-to-many relationship explicit in the URL
 * and avoids any ambiguity about which user an address belongs to.
 */
@RestController
@RequestMapping("/api/users/{userId}/addresses")
public class AddressController {

    private final BaseService base;

    public AddressController(BaseService base) {
        this.base = base;
    }

    @GetMapping
    public List<Address> list(@PathVariable Long userId) {
        return base.listAddressesForUser(userId);
    }

    @PostMapping
    public ResponseEntity<Address> create(@PathVariable Long userId,
                                          @Valid @RequestBody AddressRequest body) {
        Address created = base.addAddress(userId,
                body.getLabel(), body.getStreet(), body.getCity(),
                body.getState(), body.getPostalCode(), body.getCountry());
        return ResponseEntity
                .created(URI.create("/api/users/" + userId + "/addresses/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{addressId}")
    public Address update(@PathVariable Long userId,
                          @PathVariable Long addressId,
                          @Valid @RequestBody AddressRequest body) {
        return base.updateAddress(userId, addressId,
                body.getLabel(), body.getStreet(), body.getCity(),
                body.getState(), body.getPostalCode(), body.getCountry());
    }

    @DeleteMapping("/{addressId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long userId, @PathVariable Long addressId) {
        base.deleteAddress(userId, addressId);
    }
}
