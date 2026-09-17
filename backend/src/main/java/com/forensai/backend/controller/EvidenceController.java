package com.forensai.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.forensai.backend.dto.EvidenceResponse;
import com.forensai.backend.entity.Case;
import com.forensai.backend.entity.Evidence;
import com.forensai.backend.entity.User;
import com.forensai.backend.repository.CaseRepository;
import com.forensai.backend.repository.EvidenceRepository;
import com.forensai.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/evidence")
public class EvidenceController {

    @Autowired
    private EvidenceRepository evidenceRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_TYPES = Set.of("sketch", "photo", "video");

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + username));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> uploadEvidence(
            @RequestParam("caseId") Integer caseId,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) {

        User currentUser = getCurrentUser();

        // Validate type against fixed set — never trust arbitrary client strings for a DB column
        String normalizedType = type.toLowerCase();
        if (!ALLOWED_TYPES.contains(normalizedType)) {
            return ResponseEntity.badRequest().body("Invalid evidence type. Must be one of: " + ALLOWED_TYPES);
        }

        // Confirm the case exists AND belongs to the logged-in investigator
        Case parentCase = caseRepository.findById(caseId).orElse(null);
        if (parentCase == null) {
            return ResponseEntity.badRequest().body("Case not found");
        }
        if (!parentCase.getInvestigatorId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You do not own this case");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            // Build a collision-safe filename
            String originalFilename = file.getOriginalFilename();
            String safeOriginalName = (originalFilename == null) ? "upload" : originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
            String storedFilename = caseId + "_" + normalizedType + "_" + System.currentTimeMillis() + "_" + safeOriginalName;

            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath); // creates the folder(s) if they don't exist yet

            Path targetPath = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Store the relative path in the DB, not an absolute path
            String relativePath = uploadDir + "/" + storedFilename;

            Evidence evidence = new Evidence();
            evidence.setCaseId(caseId);
            evidence.setType(normalizedType);
            evidence.setFilePath(relativePath);

            Evidence saved = evidenceRepository.save(evidence);
            entityManager.refresh(saved);

            return ResponseEntity.ok(new EvidenceResponse(
                    saved.getId(),
                    saved.getCaseId(),
                    saved.getType(),
                    saved.getFilePath(),
                    saved.getUploadedAt()
            ));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to store file: " + e.getMessage());
        }
    }
}