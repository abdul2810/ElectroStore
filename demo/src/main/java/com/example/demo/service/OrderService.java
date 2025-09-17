package com.example.demo.service;

import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final UserRepository userRepository;

    public OrderService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all orders for a user by username
    public List<OrderDetail> getOrdersByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getOrders();
    }

    // Cancel order by index for a user identified by username
    public void cancelOrderByUsername(String username, int orderIndex) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (orderIndex < 0 || orderIndex >= user.getOrders().size()) {
            throw new RuntimeException("Invalid order index");
        }

        user.getOrders().remove(orderIndex);
        userRepository.save(user);
    }
}
