package com.example.backend.service;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    public ProductService(ProductRepository productRepository) { this.productRepository = productRepository; }
    public List<Product> findAll() { return productRepository.findAll(); }
    public Product findById(Long id) { return productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id)); }
    public Product create(Product product) { product.setId(null); return productRepository.save(product); }
    public Product update(Long id, Product product) { Product existing = findById(id); existing.setName(product.getName()); existing.setPrice(product.getPrice()); return productRepository.save(existing); }
    public void delete(Long id) { productRepository.delete(findById(id)); }
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class ProductNotFoundException extends RuntimeException { public ProductNotFoundException(Long id) { super("Product " + id + " was not found."); } }
}
