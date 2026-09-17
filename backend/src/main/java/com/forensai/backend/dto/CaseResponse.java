package com.forensai.backend.dto;

import java.time.LocalDateTime;

public class CaseResponse {
    private Integer id;
    private String title;
    private Integer investigatorId;
    private LocalDateTime createdAt;

    public CaseResponse(Integer id, String title, Integer investigatorId, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.investigatorId = investigatorId;
        this.createdAt = createdAt;
    }

    public Integer getId() { return id; }
    public String getTitle() { return title; }
    public Integer getInvestigatorId() { return investigatorId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}