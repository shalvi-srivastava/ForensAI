package com.forensai.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "investigator_feedback")
public class InvestigatorFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "search_result_id", nullable = false)
    private Integer searchResultId;

    @Column(name = "marked_relevant", nullable = false)
    private Boolean markedRelevant;

    @Column(name = "feedback_at", insertable = false, updatable = false)
    private LocalDateTime feedbackAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSearchResultId() {
        return searchResultId;
    }

    public void setSearchResultId(Integer searchResultId) {
        this.searchResultId = searchResultId;
    }

    public Boolean getMarkedRelevant() {
        return markedRelevant;
    }

    public void setMarkedRelevant(Boolean markedRelevant) {
        this.markedRelevant = markedRelevant;
    }

    public LocalDateTime getFeedbackAt() {
        return feedbackAt;
    }
}