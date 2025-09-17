package com.example.demo.controller;

import com.example.demo.entity.Admin;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.User;
import com.example.demo.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ===== Request DTOs =====
    public record LoginRequest(String username, String password, String type) {}
    public record RegisterUserRequest(String username, String password,
                                       String firstName, String lastName,
                                       String email, String mobile) {}
    public record RegisterAdminRequest(String username, String password, String fullName) {}

    // ===== Response DTOs =====
    public record UserResponse(Long id, String username, String firstName,
                                String lastName, String email, String mobile) {}
    public record AdminResponse(String username, String fullName) {}

    // ===== LOGIN =====
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(request.username(), request.password());

            Authentication auth = authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Store authentication in session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext()
            );

            // Return user or admin info
            if ("user".equalsIgnoreCase(request.type())) {
                User user = authService.findUserByUsername(request.username());
                return ResponseEntity.ok(new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getMobile()
                ));
            } else if ("admin".equalsIgnoreCase(request.type())) {
                Admin admin = authService.findAdminByUsername(request.username());
                return ResponseEntity.ok(new AdminResponse(admin.getUsername(), admin.getFullName()));
            }

            return ResponseEntity.badRequest().body("Invalid login type");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    // ===== REGISTER USER =====
    @PostMapping("/register/user")
    public ResponseEntity<String> registerUser(@RequestBody RegisterUserRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(request.password());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setMobile(request.mobile());

        String result = authService.registerUser(user);
        if (result.contains("already")) {
            return ResponseEntity.status(409).body(result);
        }
        return ResponseEntity.ok(result);
    }

    // ===== REGISTER ADMIN =====
    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody RegisterAdminRequest request) {
        Admin admin = new Admin();
        admin.setUsername(request.username());
        admin.setPassword(request.password());
        admin.setFullName(request.fullName());

        String result = authService.registerAdmin(admin);
        if (result.contains("already")) {
            return ResponseEntity.status(409).body(result);
        }
        return ResponseEntity.ok(result);
    }

    // ===== LOGOUT =====
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }

    // ===== CURRENT USER =====
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        String username = auth.getName();
        User user = authService.findUserByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getMobile()
            ));
        }
        return ResponseEntity.status(401).body("User not found");
    }

    // ===== ADDRESS MANAGEMENT =====
    @GetMapping("/users/{userId}/addresses")
    public ResponseEntity<List<String>> getAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.getUserAddresses(userId));
    }

    @PostMapping("/users/{userId}/addresses")
    public ResponseEntity<String> addAddress(@PathVariable Long userId, @RequestBody String address) {
        authService.addUserAddress(userId, address);
        return ResponseEntity.ok("Address added successfully");
    }

    @PutMapping("/users/{userId}/addresses")
    public ResponseEntity<String> updateAddresses(@PathVariable Long userId, @RequestBody List<String> addresses) {
        authService.updateUserAddresses(userId, addresses);
        return ResponseEntity.ok("Addresses updated successfully");
    }

    @DeleteMapping("/users/{userId}/addresses")
    public ResponseEntity<String> deleteAddress(@PathVariable Long userId, @RequestBody String address) {
        authService.deleteUserAddress(userId, address);
        return ResponseEntity.ok("Address deleted successfully");
    }

    // ===== USER ORDER MANAGEMENT =====
    @GetMapping("/users/{userId}/orders")
    public List<OrderDetail> getOrders(@PathVariable Long userId) {
        return authService.getOrdersForUser(userId);
    }

    @PostMapping("/users/{userId}/orders")
    public ResponseEntity<String> placeOrder(@PathVariable Long userId, @RequestBody OrderDetail orderDetail) {
        authService.addOrder(userId, orderDetail);
        return ResponseEntity.ok("Order placed successfully");
    }

    @DeleteMapping("/users/{userId}/orders/{orderIndex}")
    public ResponseEntity<String> cancelOrder(@PathVariable Long userId, @PathVariable int orderIndex) {
        authService.cancelUserOrder(userId, orderIndex);
        return ResponseEntity.ok("Order cancelled successfully");
    }

    // ===== ADMIN ORDER MANAGEMENT =====
    @GetMapping("/admin/orders")
    public Map<String, Object> getAllOrdersForAdmin() {
        return authService.getAllOrdersForAdmin();
    }

    @DeleteMapping("/admin/orders/clear")
    public ResponseEntity<String> clearAllOrders() {
        authService.clearAllOrders();
        return ResponseEntity.ok("All orders cleared successfully");
    }
}
