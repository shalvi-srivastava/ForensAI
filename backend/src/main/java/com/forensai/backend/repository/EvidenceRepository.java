package com.forensai.backend.repository;
import com.forensai.backend.entity.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
public interface EvidenceRepository extends JpaRepository<Evidence, Integer> {}