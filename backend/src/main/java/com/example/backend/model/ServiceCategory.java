package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "service_categories", indexes = @Index(name = "idx_category_slug", columnList = "slug", unique = true))
public class ServiceCategory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 80) private String slug;
    @Column(nullable = false, length = 120) private String name;
    @Column(length = 500) private String description;
    @Column(length = 600) private String imageUrl;
    @Column(nullable = false) private boolean active = true;
    @Column(nullable = false) private int displayOrder = 0;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getSlug() { return slug; } public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isActive() { return active; } public void setActive(boolean active) { this.active = active; }
    public int getDisplayOrder() { return displayOrder; } public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
}
