package com.forensai.backend.repository;
import com.forensai.backend.entity.SearchResult;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SearchResultRepository extends JpaRepository<SearchResult, Integer> {}