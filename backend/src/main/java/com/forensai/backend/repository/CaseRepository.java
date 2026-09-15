package com.forensai.backend.repository;

import com.forensai.backend.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, Integer> {
}