package com.assessment.usermanagement.dto;

import com.assessment.usermanagement.model.Address;
import com.assessment.usermanagement.model.User;

import java.util.List;

/**
 * Aggregate response used by GET /api/users/{id}.
 *
 * Letting the backend assemble the user + addresses payload in one
 * round-trip keeps the React detail page simple (single useEffect
 * instead of fan-out + Promise.all).
 */
public class UserWithAddressesResponse {

    private User user;
    private List<Address> addresses;

    public UserWithAddressesResponse() { }

    public UserWithAddressesResponse(User user, List<Address> addresses) {
        this.user = user;
        this.addresses = addresses;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Address> getAddresses() { return addresses; }
    public void setAddresses(List<Address> addresses) { this.addresses = addresses; }
}
