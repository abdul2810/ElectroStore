package com.example.demo.repository;

import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    void deleteByUser(User user);

    // ✅ Added for efficient lookup
    Optional<CartItem> findByUserAndProduct(User user, Product product);

    // Optional: for bulk operations or analytics
    long countByUser(User user);
    List<CartItem> findByUserAndProductIn(User user, List<Product> products);
}