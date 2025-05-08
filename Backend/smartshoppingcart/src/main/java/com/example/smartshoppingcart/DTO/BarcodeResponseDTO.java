package com.example.smartshoppingcart.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) for barcode response.
 * <p>
 * This class is used to transfer barcode response data between different layers of the application.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BarcodeResponseDTO {

    /**
     * The message associated with the barcode response.
     * <p>
     * Example: "Barcode processed successfully."
     */
    private String message;
}
