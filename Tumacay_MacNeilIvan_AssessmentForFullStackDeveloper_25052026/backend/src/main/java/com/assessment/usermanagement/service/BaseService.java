package com.assessment.usermanagement.service;

import com.assessment.usermanagement.exception.NotFoundException;
import com.assessment.usermanagement.model.Address;
import com.assessment.usermanagement.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/**
 * The "Base Service" referenced in the brief.
 *
 * Holds Users and Addresses in two in-memory lists, keeps the
 * 1-to-many invariant (each Address.userId references an existing User),
 * and exposes CRUD primitives that the controllers wrap as REST endpoints.
 *
 * No database is wired up so the project boots in a single command.
 */
@Service
public class BaseService {

    private final List<User> users = new ArrayList<>();
    private final List<Address> addresses = new ArrayList<>();

    private final AtomicLong userIdSeq = new AtomicLong(0);
    private final AtomicLong addressIdSeq = new AtomicLong(0);

    @PostConstruct
    void seed() {
        User alice = createUser("alice.nguyen@example.com", "Alice", "Nguyen");
        User ben   = createUser("ben.carter@example.com",   "Ben",   "Carter");
        User chloe = createUser("chloe.park@example.com",   "Chloe", "Park");

        addAddress(alice.getId(), "Home",
                "221B Baker Street", "London", "", "NW1 6XE", "United Kingdom");
        addAddress(alice.getId(), "Work",
                "1 Infinite Loop", "Cupertino", "CA", "95014", "United States");

        addAddress(ben.getId(), "Home",
                "742 Evergreen Terrace", "Springfield", "OR", "97477", "United States");

        // Chloe starts with no addresses — useful empty-state for the UI.
    }

    // ---------- Users ----------

    public List<User> listUsers() {
        return users.stream()
                .sorted(Comparator.comparing(User::getId))
                .toList();
    }

    public User getUser(Long id) {
        return findUser(id).orElseThrow(
                () -> new NotFoundException("User " + id + " not found"));
    }

    public User createUser(String email, String firstName, String lastName) {
        User u = new User(userIdSeq.incrementAndGet(), email, firstName, lastName);
        users.add(u);
        return u;
    }

    public User updateUser(Long id, String email, String firstName, String lastName) {
        User u = getUser(id);
        u.setEmail(email);
        u.setFirstName(firstName);
        u.setLastName(lastName);
        return u;
    }

    public void deleteUser(Long id) {
        User u = getUser(id);
        addresses.removeIf(a -> a.getUserId().equals(u.getId()));
        users.remove(u);
    }

    private Optional<User> findUser(Long id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    // ---------- Addresses ----------

    public List<Address> listAddressesForUser(Long userId) {
        getUser(userId); // 404 if user does not exist
        return addresses.stream()
                .filter(a -> a.getUserId().equals(userId))
                .sorted(Comparator.comparing(Address::getId))
                .toList();
    }

    public Address addAddress(Long userId, String label, String street,
                              String city, String state, String postalCode, String country) {
        getUser(userId);
        Address a = new Address(addressIdSeq.incrementAndGet(),
                userId, label, street, city, state, postalCode, country);
        addresses.add(a);
        return a;
    }

    public Address updateAddress(Long userId, Long addressId, String label, String street,
                                 String city, String state, String postalCode, String country) {
        Address a = findAddress(userId, addressId);
        a.setLabel(label);
        a.setStreet(street);
        a.setCity(city);
        a.setState(state);
        a.setPostalCode(postalCode);
        a.setCountry(country);
        return a;
    }

    public void deleteAddress(Long userId, Long addressId) {
        Address a = findAddress(userId, addressId);
        addresses.remove(a);
    }

    private Address findAddress(Long userId, Long addressId) {
        return addresses.stream()
                .filter(a -> a.getUserId().equals(userId) && a.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(
                        "Address " + addressId + " for user " + userId + " not found"));
    }
}
