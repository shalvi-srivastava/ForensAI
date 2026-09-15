package com.forensai.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "reference_photos")
public class ReferencePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "identity_label", nullable = false, length = 100)
    private String identityLabel;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIdentityLabel() {
        return identityLabel;
    }

    public void setIdentityLabel(String identityLabel) {
        this.identityLabel = identityLabel;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}