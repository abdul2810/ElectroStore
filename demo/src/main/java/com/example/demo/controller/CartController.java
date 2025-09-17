package com.example.demo.controller;

import com.example.demo.dto.CartItemResponse;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart/{userId}")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // ✅ Utility method to auto-create anonymous user if not found
    private User getOrCreateAnonymousUser(String userId) {
        return userRepository.findByAnonymousId(userId)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setAnonymousId(userId);
                newUser.setPassword("ANON_" + userId);

                // ✅ Safe substring logic
                String safeUsername = userId.length() >= 8
                    ? userId.substring(0, 8)
                    : String.format("%-8s", userId).replace(' ', '_'); // pad with underscores

                newUser.setUsername("anon_" + safeUsername);
                return userRepository.save(newUser);
            });
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCartItems(@PathVariable String userId) {
        User user = getOrCreateAnonymousUser(userId);
        List<CartItem> items = cartService.getCartItems(user);
        List<CartItemResponse> response = items.stream()
                .map(item -> new CartItemResponse(item.getId(), item.getQuantity(), item.getProduct()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addOrUpdateCartItem(
            @PathVariable String userId,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        User user = getOrCreateAnonymousUser(userId);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (productOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        CartItem updatedItem = cartService.addOrUpdateCartItem(user, productOpt.get(), quantity);
        return ResponseEntity.ok(new CartItemResponse(updatedItem.getId(), updatedItem.getQuantity(), updatedItem.getProduct()));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable String userId, @PathVariable Long cartItemId) {
        User user = getOrCreateAnonymousUser(userId);
        cartService.removeCartItem(cartItemId, user); // ✅ Scoped deletion
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        User user = getOrCreateAnonymousUser(userId);
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }

    // Optional: Global error handler for debugging
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
    }
}