package com.example.demo.service;

import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItem> getCartItems(User user) {
        return cartItemRepository.findByUser(user);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    @Transactional
    public CartItem addOrUpdateCartItem(User user, Product product, int quantity) {
        int safeQuantity = sanitizeQuantity(quantity);

        Optional<CartItem> existingOpt = cartItemRepository.findByUserAndProduct(user, product);
        if (existingOpt.isPresent()) {
            CartItem item = existingOpt.get();
            item.setQuantity(safeQuantity);
            return cartItemRepository.save(item);
        }

        CartItem newItem = new CartItem();
        newItem.setUser(user);
        newItem.setProduct(product);
        newItem.setQuantity(safeQuantity);
        return cartItemRepository.save(newItem);
    }

    public void removeCartItem(Long cartItemId, User user) {
        CartItem item = cartItemRepository.findById(cartItemId)
            .filter(i -> i.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new RuntimeException("Unauthorized or item not found"));
        cartItemRepository.delete(item);
    }

    private int sanitizeQuantity(int quantity) {
        return Math.max(1, Math.min(quantity, 5));
    }
}