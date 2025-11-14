// PlaceRepository.java
package com.backend.domain.place.repository;

import com.backend.domain.place.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    boolean existsByPlaceNameAndAddress(String placeName, String address);
    List<Place> findByCategoryId(int categoryId);

    Place getPlaceById(Long id);

    List<Place> findByCategory_Name(String name);
}