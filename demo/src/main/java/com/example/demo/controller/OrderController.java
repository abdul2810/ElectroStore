package com.example.demo.controller;

import com.example.demo.entity.OrderDetail;
import com.example.demo.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Get all orders for the authenticated user
    @GetMapping("/my")
    public List<OrderDetail> getMyOrders(Authentication authentication) {
        String username = authentication.getName(); // get logged-in username
        return orderService.getOrdersByUsername(username);
    }

    // Cancel order by index for authenticated user
    @DeleteMapping("/my/{orderIndex}")
    public ResponseEntity<?> cancelMyOrder(Authentication authentication,
                                           @PathVariable int orderIndex) {
        String username = authentication.getName();
        orderService.cancelOrderByUsername(username, orderIndex);
        return ResponseEntity.ok("Order cancelled successfully");
    }
}
