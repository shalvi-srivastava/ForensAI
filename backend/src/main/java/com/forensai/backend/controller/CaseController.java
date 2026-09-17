package com.forensai.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

import com.forensai.backend.dto.CaseRequest;
import com.forensai.backend.dto.CaseResponse;
import com.forensai.backend.entity.Case;
import com.forensai.backend.entity.User;
import com.forensai.backend.repository.CaseRepository;
import com.forensai.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/cases")
public class CaseController {
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + username));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createCase(@RequestBody CaseRequest request) {
        User currentUser = getCurrentUser();

        Case newCase = new Case();
        newCase.setTitle(request.getTitle());
        newCase.setInvestigatorId(currentUser.getId());

        Case saved = caseRepository.save(newCase);
        entityManager.refresh(saved);

        return ResponseEntity.ok(new CaseResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getInvestigatorId(),
                saved.getCreatedAt()));
    }

    @GetMapping
    public ResponseEntity<?> getMyCases() {
        User currentUser = getCurrentUser();

        List<CaseResponse> cases = caseRepository.findAll().stream()
                .filter(c -> c.getInvestigatorId().equals(currentUser.getId()))
                .map(c -> new CaseResponse(c.getId(), c.getTitle(), c.getInvestigatorId(), c.getCreatedAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(cases);
    }
}