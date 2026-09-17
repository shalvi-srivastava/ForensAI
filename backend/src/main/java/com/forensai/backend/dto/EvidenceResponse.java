package com.forensai.backend.dto;

import java.time.LocalDateTime;

public class EvidenceResponse {
    private Integer id;
    private Integer caseId;
    private String type;
    private String filePath;
    private LocalDateTime uploadedAt;

    public EvidenceResponse(Integer id, Integer caseId, String type, String filePath, LocalDateTime uploadedAt) {
        this.id = id;
        this.caseId = caseId;
        this.type = type;
        this.filePath = filePath;
        this.uploadedAt = uploadedAt;
    }

    public Integer getId() { return id; }
    public Integer getCaseId() { return caseId; }
    public String getType() { return type; }
    public String getFilePath() { return filePath; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
}