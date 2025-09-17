package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository; // ✅ Injected for order cancel

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // ------------------- PRODUCT METHODS -------------------
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String categoryName) {
        return productRepository.findByCategoryIgnoreCase(categoryName);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(updatedProduct.getName());
            existing.setBrand(updatedProduct.getBrand());
            existing.setActualPrice(updatedProduct.getActualPrice());
            existing.setOfferPrice(updatedProduct.getOfferPrice());
            existing.setImage(updatedProduct.getImage());
            existing.setShowcaseImages(updatedProduct.getShowcaseImages());
            existing.setCategory(updatedProduct.getCategory());
            existing.setDescription(updatedProduct.getDescription());
            existing.setRam(updatedProduct.getRam());
            existing.setStorage(updatedProduct.getStorage());
            existing.setInStock(updatedProduct.isInStock());
            existing.setRating(updatedProduct.getRating());
            existing.setCreatedAt(updatedProduct.getCreatedAt());

            // Smartwatch fields
            existing.setDisplay(updatedProduct.getDisplay());
            existing.setDesignBuild(updatedProduct.getDesignBuild());
            existing.setPersonalization(updatedProduct.getPersonalization());
            existing.setHealthMonitoring(updatedProduct.getHealthMonitoring());
            existing.setUsageCategory(updatedProduct.getUsageCategory());
            existing.setInputMethod(updatedProduct.getInputMethod());

            // Earphones fields
            existing.setMicrophoneCallFeatures(updatedProduct.getMicrophoneCallFeatures());
            existing.setAudioPerformance(updatedProduct.getAudioPerformance());
            existing.setBatteryCharging(updatedProduct.getBatteryCharging());
            existing.setDurabilityDesign(updatedProduct.getDurabilityDesign());

            // Television fields
            existing.setPowerEnergy(updatedProduct.getPowerEnergy());
            existing.setConnectivityPorts(updatedProduct.getConnectivityPorts());

            // Other fields
            existing.setDisplaySize(updatedProduct.getDisplaySize());
            existing.setCamera(updatedProduct.getCamera());
            existing.setBattery(updatedProduct.getBattery());
            existing.setProcessor(updatedProduct.getProcessor());
            existing.setResolution(updatedProduct.getResolution());
            existing.setPanelType(updatedProduct.getPanelType());
            existing.setSmartFeatures(updatedProduct.getSmartFeatures());
            existing.setDriverSize(updatedProduct.getDriverSize());
            existing.setConnectivity(updatedProduct.getConnectivity());
            existing.setWaterResistance(updatedProduct.getWaterResistance());

            return productRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }


    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return productRepository.findAll();
        }
        String searchTerm = keyword.trim();
        List<Product> results = productRepository.searchProducts(searchTerm);

        boolean isCategorySearch = results.stream()
                .anyMatch(p -> p.getCategory() != null &&
                               p.getCategory().equalsIgnoreCase(searchTerm));

        if (isCategorySearch) {
            Collections.shuffle(results);
        }
        return results;
    }
}
