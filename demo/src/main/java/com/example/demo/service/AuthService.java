package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.entity.Admin;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.User;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.UserRepository;

import java.time.LocalDate;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ===== LOGIN =====
    public User loginUserAndGetDetails(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() &&
            passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt.get();
        }
        return null;
    }

    public Admin loginAdminAndGetDetails(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent() &&
            passwordEncoder.matches(password, adminOpt.get().getPassword())) {
            return adminOpt.get();
        }
        return null;
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public Admin findAdminByUsername(String username) {
        return adminRepository.findByUsername(username).orElse(null);
    }

    // ===== REGISTER =====
    public String registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }

    public String registerAdmin(Admin admin) {
        if (adminRepository.findByUsername(admin.getUsername()).isPresent()) {
            return "Username already exists";
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepository.save(admin);
        return "Admin registered successfully";
    }

    // ===== ADDRESS MANAGEMENT =====
    public List<String> getUserAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getAddresses();
    }

    public void addUserAddress(Long userId, String address) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getAddresses() == null) {
            user.setAddresses(new ArrayList<>());
        }
        user.getAddresses().add(address);
        userRepository.save(user);
    }

    public void updateUserAddresses(Long userId, List<String> addresses) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAddresses(addresses);
        userRepository.save(user);
    }

    public void deleteUserAddress(Long userId, String address) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getAddresses() != null) {
            user.getAddresses().remove(address);
            userRepository.save(user);
        }
    }

    // ===== USER ORDER METHODS =====
    public void addOrder(Long userId, OrderDetail orderDetail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        orderDetail.setOrderDate(today);

        int deliveryDays = new Random().nextInt(4) + 4; // 4–7 days
        orderDetail.setDeliveryDays(deliveryDays);
        orderDetail.setDeliveryDate(today.plusDays(deliveryDays));

        if (user.getOrders() == null) {
            user.setOrders(new ArrayList<>());
        }
        user.getOrders().add(orderDetail);
        userRepository.save(user);
    }

    public List<OrderDetail> getOrdersForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getOrders() != null ? user.getOrders() : new ArrayList<>();
    }

    public void cancelUserOrder(Long userId, int orderIndex) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getOrders() == null || orderIndex < 0 || orderIndex >= user.getOrders().size()) {
            throw new RuntimeException("Invalid order index");
        }
        user.getOrders().remove(orderIndex);
        userRepository.save(user);
    }

    // ===== ADMIN ORDER METHODS =====
//    public Map<String, Object> getAllOrdersForAdmin() {
//        List<User> users = userRepository.findAll();
//        double totalRevenue = 0;
//        List<Map<String, Object>> ordersList = new ArrayList<>();
//
//        for (User user : users) {
//            List<OrderDetail> orders = user.getOrders() != null ? user.getOrders() : new ArrayList<>();
//            for (OrderDetail order : orders) {
//                totalRevenue += order.getTotalPrice();
//            }
//            Map<String, Object> entry = new HashMap<>();
//            entry.put("userId", user.getId());
//            entry.put("username", user.getUsername());
//            entry.put("orders", orders);
//            ordersList.add(entry);
//        }
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("totalRevenue", totalRevenue);
//        result.put("orders", ordersList);
//        return result;
//    }

 // ===== ADMIN ORDER METHODS =====
    public Map<String, Object> getAllOrdersForAdmin() {
        List<User> users = userRepository.findAll();
        double totalRevenue = 0;
        List<Map<String, Object>> ordersList = new ArrayList<>();

        for (User user : users) {
            // Skip anonymous users or users with no orders
            if (user.getUsername() == null || user.getUsername().startsWith("anon_")) {
                continue; // Skip anonymous users
            }
            List<OrderDetail> orders = user.getOrders() != null ? user.getOrders() : new ArrayList<>();
            if (orders.isEmpty()) {
                continue; // Skip users with no orders
            }

            for (OrderDetail order : orders) {
                totalRevenue += order.getTotalPrice();
            }
            Map<String, Object> entry = new HashMap<>();
            entry.put("userId", user.getId());
            entry.put("username", user.getUsername());
            entry.put("orders", orders);
            ordersList.add(entry);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("orders", ordersList);
        return result;
    }

    public void clearAllOrders() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getOrders() != null) {
                user.getOrders().clear();
                userRepository.save(user);
            }
        }
    }
}
