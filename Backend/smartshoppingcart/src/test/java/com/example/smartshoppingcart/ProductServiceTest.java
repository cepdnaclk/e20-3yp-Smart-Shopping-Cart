package com.example.smartshoppingcart;

import com.example.smartshoppingcart.DTO.AddProductDTO;
import com.example.smartshoppingcart.DTO.BarcodeInputDTO;
import com.example.smartshoppingcart.DTO.BarcodeResponseDTO;
import com.example.smartshoppingcart.DTO.DeleteProductDTO;
import com.example.smartshoppingcart.DTO.UpdateProductDTO;
import com.example.smartshoppingcart.DTO.ViewProductDTO;
import com.example.smartshoppingcart.Model.Products;
import com.example.smartshoppingcart.Repository.ProductsRepository;
import com.example.smartshoppingcart.Service.ProductServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductsRepository productsRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    // --- scanBarcode Tests ---

    @Test
    void testScanBarcodeExists() {
        String barcode = "12345";
        BarcodeInputDTO dto = new BarcodeInputDTO();
        dto.setBarcode(barcode);
        Products existingProduct = Products.builder().barcode(barcode).build();

        when(productsRepository.findByBarcode(barcode))
                .thenReturn(Optional.of(existingProduct));

        BarcodeResponseDTO response = productService.scanBarcode(dto);
        assertEquals("Barcode already exists.", response.getMessage());
    }

    @Test
    void testScanBarcodeNotExists() {
        String barcode = "54321";
        BarcodeInputDTO dto = new BarcodeInputDTO();
        dto.setBarcode(barcode);

        when(productsRepository.findByBarcode(barcode))
                .thenReturn(Optional.empty());

        BarcodeResponseDTO response = productService.scanBarcode(dto);
        assertEquals("Barcode scanned successfully. Add item details.", response.getMessage());
    }

    // --- addProduct Tests ---
    //
    // Note: The addProduct method calls findByBarcode using addProductDTO.getName().
    // For the purposes of this test, we assume name and barcode are identical.

    @Test
    void testAddProductSuccess() throws Exception {
        // Use reflection to set tempBarcode since it's private
        Field tempBarcodeField = ProductServiceImpl.class.getDeclaredField("tempBarcode");
        tempBarcodeField.setAccessible(true);
        tempBarcodeField.set(productService, "123456789");

        AddProductDTO dto = AddProductDTO.builder()
                .name("TestProduct")
                .description("Test Description")
                .price(10.0)
                .stock(5)
                .category("TestCategory")
                .brand("TestBrand")
                .weight(1.0)
                .discount(0.0)
                .build();

        // Simulate that no product exists for the given barcode
        when(productsRepository.findByBarcode("123456789"))
                .thenReturn(Optional.empty());

        // Prepare a product as it would be saved
        Products productToSave = Products.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .category(dto.getCategory().toLowerCase()) // Ensuring lowercase category
                .brand(dto.getBrand())
                .weight(dto.getWeight())
                .barcode("123456789") // Ensure barcode is set correctly
                .discount(dto.getDiscount())
                .build();

        when(productsRepository.save(any(Products.class)))
                .thenReturn(productToSave);

        Products savedProduct = productService.addProduct(dto);

        assertNotNull(savedProduct);
        assertEquals("TestProduct", savedProduct.getName());
        assertEquals("testcategory", savedProduct.getCategory());
        assertEquals("123456789", savedProduct.getBarcode()); // Ensure barcode is correctly assigned

        // Ensure tempBarcode is cleared after successful addition
        assertNull(tempBarcodeField.get(productService));
    }


    // --- updateProduct Tests ---

    @Test
    void testUpdateProductSuccess() {
        String barcode = "updateBarcode";
        Products existingProduct = Products.builder()
                .name("OldName")
                .description("OldDesc")
                .price(20.0)
                .stock(10)
                .category("oldcategory")
                .brand("OldBrand")
                .weight(2.0)
                .barcode(barcode)
                .discount(5.0)
                .build();

        when(productsRepository.findByBarcode(barcode))
                .thenReturn(Optional.of(existingProduct));

        UpdateProductDTO dto = UpdateProductDTO.builder()
                .barcode(barcode)
                .name("NewName")
                .description("NewDesc")
                .price(25.0)
                .stock(15)
                .discount(10.0)
                .weight(2.5)
                .build();

        when(productsRepository.save(any(Products.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Products updatedProduct = productService.updateProduct(dto);
        assertEquals("NewName", updatedProduct.getName());
        assertEquals("NewDesc", updatedProduct.getDescription());
        assertEquals(25.0, updatedProduct.getPrice());
        assertEquals(15, updatedProduct.getStock());
        assertEquals(10.0, updatedProduct.getDiscount());
        assertEquals(2.5, updatedProduct.getWeight());
        // Ensure unchanged fields remain the same.
        assertEquals("oldcategory", updatedProduct.getCategory());
        assertEquals("OldBrand", updatedProduct.getBrand());
        assertEquals(barcode, updatedProduct.getBarcode());
    }

    @Test
    void testUpdateProductNotFound() {
        String barcode = "nonexistent";
        when(productsRepository.findByBarcode(barcode))
                .thenReturn(Optional.empty());

        UpdateProductDTO dto = UpdateProductDTO.builder()
                .barcode(barcode)
                .build();

        Exception exception = assertThrows(IllegalStateException.class,
                () -> productService.updateProduct(dto));

        assertTrue(exception.getMessage().contains("Product not found with barcode: " + barcode));
    }

    // --- deleteProduct Tests ---

    @Test
    void testDeleteProductSuccess() {
        String barcode = "deleteBarcode";
        Products existingProduct = Products.builder().barcode(barcode).build();

        when(productsRepository.findByBarcode(barcode))
                .thenReturn(Optional.of(existingProduct));

        productService.deleteProduct(new DeleteProductDTO(barcode));
        verify(productsRepository, times(1)).delete(existingProduct);
    }

    @Test
    void testDeleteProductNotFound() {
        String barcode = "deleteNotFound";
        when(productsRepository.findByBarcode(barcode))
                .thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalStateException.class,
                () -> productService.deleteProduct(new DeleteProductDTO(barcode)));

        assertTrue(exception.getMessage().contains("Product not found with barcode: " + barcode));
    }

    // --- viewProduct by Identifier Tests ---

    @Test
    void testViewProductByIdFound() {
        Long id = 1L;
        Products product = Products.builder()
                .name("Product1")
                .barcode("barcode1")
                .build();

        when(productsRepository.findById(id))
                .thenReturn(Optional.of(product));

        ViewProductDTO dto = productService.viewProduct(id);
        assertEquals("Product1", dto.getName());
    }

    @Test
    void testViewProductByBarcodeFound() {
        Long id = 2L;
        Products product = Products.builder()
                .name("Product2")
                // barcode is set as string "2" to match String.valueOf(id)
                .barcode("2")
                .build();

        when(productsRepository.findById(id))
                .thenReturn(Optional.empty());
        when(productsRepository.findByBarcode("2"))
                .thenReturn(Optional.of(product));

        ViewProductDTO dto = productService.viewProduct(id);
        assertEquals("Product2", dto.getName());
    }

    @Test
    void testViewProductByIdentifierNotFound() {
        Long id = 3L;
        when(productsRepository.findById(id))
                .thenReturn(Optional.empty());
        when(productsRepository.findByBarcode("3"))
                .thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalStateException.class,
                () -> productService.viewProduct(id));

        assertTrue(exception.getMessage().contains("Product not found with identifier: " + id));
    }

    // --- viewProduct by Name and Category Test ---

    @Test
    void testViewProductByNameAndCategory() {
        String name = "TestProduct";
        String category = "TestCategory";
        // Assume the repository returns a product when queried with the lowercase inputs.
        Products product = Products.builder()
                .name(name)
                .category(category.toLowerCase())
                .build();

        when(productsRepository.findByNameContainingIgnoreCaseAndCategory(
                name.toLowerCase(), category.toLowerCase()))
                .thenReturn(List.of(product));

        List<ViewProductDTO> dtos = productService.viewProduct(name, category);
        assertFalse(dtos.isEmpty());
        assertEquals(name, dtos.getFirst().getName());
    }

    // --- viewProduct by Name, Category, and Brand Test ---

    @Test
    void testViewProductByNameCategoryAndBrand() {
        String name = "TestProduct";
        String category = "TestCategory";
        String brand = "TestBrand";

        Products product = Products.builder()
                .name(name)
                .category(category.toLowerCase())
                .brand(brand)
                .build();

        when(productsRepository.findByNameContainingIgnoreCaseAndCategory(
                name.toLowerCase(), category.toLowerCase()))
                .thenReturn(List.of(product));

        List<ViewProductDTO> dtos = productService.viewProduct(name, category, brand);
        assertFalse(dtos.isEmpty());
        assertEquals(name, dtos.getFirst().getName());

        // Test that if the brand does not match, no products are returned.
        List<ViewProductDTO> dtosNoMatch = productService.viewProduct(name, category, "NonMatchingBrand");
        assertTrue(dtosNoMatch.isEmpty());
    }

    // --- Other Getter Methods Tests (They return empty lists) ---

    @Test
    void testGetAllProducts() {
        List<Products> products = productService.getAllProducts();
        assertNotNull(products);
        assertTrue(products.isEmpty());
    }

    @Test
    void testGetProductsByCategory() {
        List<Products> products = productService.getProductsByCategory("any");
        assertNotNull(products);
        assertTrue(products.isEmpty());
    }

    @Test
    void testGetProductsByPriceLessThan() {
        List<Products> products = productService.getProductsByPriceLessThan(100.0);
        assertNotNull(products);
        assertTrue(products.isEmpty());
    }

    @Test
    void testGetProductsByPriceGreaterThan() {
        List<Products> products = productService.getProductsByPriceGreaterThan(100.0);
        assertNotNull(products);
        assertTrue(products.isEmpty());
    }

    @Test
    void testGetProductsByPriceBetween() {
        List<Products> products = productService.getProductsByPriceBetween(50.0, 150.0);
        assertNotNull(products);
        assertTrue(products.isEmpty());
    }

    @Test
    void testGetProductsByStockLessThan() {
        List<Products> products = productService.getProductsByStockLessThan(10);
        assertNotNull(products);
        assertTrue(products.isEmpty());
    }
}
