package com.sb.customerservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterCustomerDTO {

    @NotBlank(message = "First name is required")
    @Size(min = 5, max = 50, message = "First name must be between 5 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 5, max = 50, message = "Last name must be between 5 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(min = 8, max = 20, message = "Phone number must be between 8 and 20 characters")
    private String phoneNumber;

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 100, message = "Address must be between 10 and 100 characters")
    private String address;

    @NotBlank(message = "NIC is required")
    @Size(min = 10, max = 12, message = "NIC must be between 10 and 12 characters")
    private String nic;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }
}
