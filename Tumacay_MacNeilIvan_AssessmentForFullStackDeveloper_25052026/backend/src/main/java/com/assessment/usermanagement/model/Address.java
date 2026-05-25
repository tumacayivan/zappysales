package com.assessment.usermanagement.model;

import java.util.Objects;

/**
 * Address entity. Each address belongs to exactly one User.
 *
 * Kept as a plain POJO (no JPA) so the project runs without a database.
 */
public class Address {

    private Long id;
    private Long userId;
    private String label;        // e.g. "Home", "Work", "Shipping"
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    public Address() { }

    public Address(Long id, Long userId, String label, String street,
                   String city, String state, String postalCode, String country) {
        this.id = id;
        this.userId = userId;
        this.label = label;
        this.street = street;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Address address)) return false;
        return Objects.equals(id, address.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
