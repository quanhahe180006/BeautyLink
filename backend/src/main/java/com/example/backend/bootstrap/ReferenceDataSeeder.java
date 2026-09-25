package com.example.backend.bootstrap;

import com.example.backend.model.Location;
import com.example.backend.model.ServiceCategory;
import com.example.backend.repository.LocationRepository;
import com.example.backend.repository.ServiceCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.example.backend.model.DomainEnums.LocationType.PROVINCE_CITY;

/** Essential catalog choices required in every environment, including production. */
@Component
@Order(1)
public class ReferenceDataSeeder implements CommandLineRunner {
    private final LocationRepository locations;
    private final ServiceCategoryRepository categories;

    public ReferenceDataSeeder(LocationRepository locations, ServiceCategoryRepository categories) {
        this.locations = locations;
        this.categories = categories;
    }

    @Override
    @Transactional
    public void run(String... args) {
        city("Thành phố Hồ Chí Minh", "ho-chi-minh");
        city("Hà Nội", "ha-noi");

        category("makeup", "Trang điểm", "Makeup cá nhân, cô dâu và sự kiện theo phong cách riêng.",
                "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=85", 1);
        category("hair", "Làm tóc", "Cắt, nhuộm, uốn và tạo kiểu bởi stylist được xác minh.",
                "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85", 2);
        category("spa", "Spa & Massage", "Liệu trình thư giãn và phục hồi cơ thể.",
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85", 3);
        category("nails", "Nail", "Chăm sóc móng và thiết kế nail theo xu hướng.",
                "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85", 4);
        category("skincare", "Chăm sóc da", "Liệu trình da mặt được cá nhân hóa.",
                "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85", 5);
    }

    private void city(String name, String slug) {
        Location city = locations.findBySlug(slug).orElseGet(Location::new);
        city.setName(name);
        city.setSlug(slug);
        city.setType(PROVINCE_CITY);
        city.setParent(null);
        city.setActive(true);
        locations.save(city);
    }

    private void category(String slug, String name, String description, String imageUrl, int displayOrder) {
        ServiceCategory category = categories.findBySlug(slug).orElseGet(ServiceCategory::new);
        category.setSlug(slug);
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        category.setDisplayOrder(displayOrder);
        category.setActive(true);
        categories.save(category);
    }
}
