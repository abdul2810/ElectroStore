package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // 🔹 Add categories manually via API (bulk insert)
    @PostMapping("/add")
    public ResponseEntity<String> addCategories(@RequestBody List<String> categoryNames) {
        List<Category> categories = categoryNames.stream()
                .map(name -> {
                    Category category = new Category();
                    category.setName(name);
                    return category;
                })
                .toList();

        categoryRepository.saveAll(categories);
        return ResponseEntity.ok("Categories added successfully");
    }
}
