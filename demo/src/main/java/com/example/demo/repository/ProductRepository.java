package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryIgnoreCase(String category);
    @Query("SELECT p FROM Product p WHERE " +
    	       "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +  // Category match
    	       "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +     // Brand match
    	       "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")           // Product name match
    	List<Product> searchProducts(@Param("keyword") String keyword);

}
