package com.example.backend.model;

import jakarta.persistence.*;
import static com.example.backend.model.DomainEnums.*;

@Entity
@Table(name = "locations", uniqueConstraints = @UniqueConstraint(name = "uk_location_parent_slug", columnNames = {"parent_id", "slug"}), indexes = @Index(name = "idx_location_parent", columnList = "parent_id"))
public class Location {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 120) private String name;
    @Column(nullable = false, length = 140) private String slug;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private LocationType type;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "parent_id") private Location parent;
    @Column(nullable = false) private boolean active = true;
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; } public void setSlug(String slug) { this.slug = slug; }
    public LocationType getType() { return type; } public void setType(LocationType type) { this.type = type; }
    public Location getParent() { return parent; } public void setParent(Location parent) { this.parent = parent; }
    public boolean isActive() { return active; } public void setActive(boolean active) { this.active = active; }
}
