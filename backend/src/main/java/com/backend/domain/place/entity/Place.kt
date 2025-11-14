package com.backend.domain.place.entity;

import com.backend.domain.category.entity.Category;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String placeName;

    private String address;

    @Column(length = 50)
    private String gu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private long ratingSum = 0L;

    @Column(nullable = false)
    private int  ratingCount = 0;

    @Column(nullable = false)
    private double ratingAvg = 0.0;

    @Version private Long version; // 동시성 대비(낙관적 락)

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public void update(String placeName, String address, String gu, String description) {
        this.placeName = placeName;
        this.address = address;
        this.gu = gu;
        this.description = description;
    }


}