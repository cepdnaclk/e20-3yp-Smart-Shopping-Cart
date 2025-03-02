package com.example.smartshoppingcart.DTO;

/**
 * Data Transfer Object (DTO) for cart information.
 * <p>
 * This class is used to transfer cart data between different layers of the application.
 */
public class CartDTO {
    /**
     * The unique identifier of the cart item.
     * <p>
     * Example: 1
     */
    private Long id;

    /**
     * The name of the cart item.
     * <p>
     * Example: "Apple"
     */
    private String name;

    /**
     * The quantity of the cart item.
     * <p>
     * Example: 3
     */
    private int quantity;

    /**
     * The price of the cart item.
     * <p>
     * Example: 1.99
     */
    private double price;

    /**
     * Default constructor.
     */
    public CartDTO() {
    }

    /**
     * Parameterized constructor.
     *
     * @param id       the unique identifier of the cart item
     * @param name     the name of the cart item
     * @param quantity the quantity of the cart item
     * @param price    the price of the cart item
     */
    public CartDTO(Long id, String name, int quantity, double price) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    /**
     * Gets the unique identifier of the cart item.
     *
     * @return the unique identifier of the cart item
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the cart item.
     *
     * @param id the unique identifier of the cart item
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the name of the cart item.
     *
     * @return the name of the cart item
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the cart item.
     *
     * @param name the name of the cart item
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the quantity of the cart item.
     *
     * @return the quantity of the cart item
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * Sets the quantity of the cart item.
     *
     * @param quantity the quantity of the cart item
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * Gets the price of the cart item.
     *
     * @return the price of the cart item
     */
    public double getPrice() {
        return price;
    }

    /**
     * Sets the price of the cart item.
     *
     * @param price the price of the cart item
     */
    public void setPrice(double price) {
        this.price = price;
    }
}
