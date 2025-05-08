package com.example.smartshoppingcart.DTO;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Data Transfer Object (DTO) for barcode input.
 * <p>
 * This class is used to transfer barcode data between different layers of the application.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BarcodeInputDTO {

    /**
     * The barcode string.
     * <p>
     * Example: "1234567890123"
     */
    @NotNull
    private String barcode;

}
