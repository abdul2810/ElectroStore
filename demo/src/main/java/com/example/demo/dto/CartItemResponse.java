// src/main/java/com/example/demo/dto/CartItemResponse.java
package com.example.demo.dto;

import com.example.demo.entity.Product;

public class CartItemResponse {
    private Long id;
    private int quantity;
    private Product product;

    public CartItemResponse(Long id, int quantity, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.product = product;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
