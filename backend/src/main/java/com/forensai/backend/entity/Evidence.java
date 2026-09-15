package com.forensai.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "evidence")
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "case_id", nullable = false)
    private Integer caseId;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "uploaded_at", insertable = false, updatable = false)
    private LocalDateTime uploadedAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCaseId() {
        return caseId;
    }

    public void setCaseId(Integer caseId) {
        this.caseId = caseId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}