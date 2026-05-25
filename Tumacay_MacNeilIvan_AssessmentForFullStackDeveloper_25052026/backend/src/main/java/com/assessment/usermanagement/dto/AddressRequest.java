package com.assessment.usermanagement.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload accepted on POST/PUT /api/users/{id}/addresses.
 * The userId is derived from the URL path, not from the body.
 */
public class AddressRequest {

    @NotBlank
    private String label;

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    private String state;

    @NotBlank
    private String postalCode;

    @NotBlank
    private String country;

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
}
