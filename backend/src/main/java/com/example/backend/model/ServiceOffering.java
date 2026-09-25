package com.example.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "service_offerings", indexes = {@Index(name = "idx_service_category", columnList = "category_id"), @Index(name = "idx_service_supplier", columnList = "supplier_id")})
public class ServiceOffering {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "supplier_id", nullable = false) private Supplier supplier;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "category_id", nullable = false) private ServiceCategory category;
    @Column(nullable = false, length = 160) private String name;
    @Column(length = 1500) private String description;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal price;
    @Column(precision = 12, scale = 2) private BigDecimal originalPrice;
    @Column(nullable = false) private int durationMinutes;
    @Column(length = 600) private String imageUrl;
    @Column(nullable = false) private boolean active = true;
    @Column(nullable = false, columnDefinition = "boolean default false") private boolean featured = false;
    @Column(length = 500) private String highlightText;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Supplier getSupplier() { return supplier; } public void setSupplier(Supplier supplier) { this.supplier = supplier; }
    public ServiceCategory getCategory() { return category; } public void setCategory(ServiceCategory category) { this.category = category; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; } public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOriginalPrice() { return originalPrice; } public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }
    public int getDurationMinutes() { return durationMinutes; } public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isActive() { return active; } public void setActive(boolean active) { this.active = active; }
    public boolean isFeatured() { return featured; } public void setFeatured(boolean featured) { this.featured = featured; }
    public String getHighlightText() { return highlightText; } public void setHighlightText(String highlightText) { this.highlightText = highlightText; }
}
