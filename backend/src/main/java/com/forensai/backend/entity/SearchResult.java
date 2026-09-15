package com.forensai.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "search_results")
public class SearchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "evidence_id", nullable = false)
    private Integer evidenceId;

    @Column(name = "candidate_photo_id", nullable = false)
    private Integer candidatePhotoId;

    @Column(nullable = false)
    private Float score;

    @Column(name = "`rank`", nullable = false)
    private Integer rank;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getEvidenceId() {
        return evidenceId;
    }

    public void setEvidenceId(Integer evidenceId) {
        this.evidenceId = evidenceId;
    }

    public Integer getCandidatePhotoId() {
        return candidatePhotoId;
    }

    public void setCandidatePhotoId(Integer candidatePhotoId) {
        this.candidatePhotoId = candidatePhotoId;
    }

    public Float getScore() {
        return score;
    }

    public void setScore(Float score) {
        this.score = score;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}