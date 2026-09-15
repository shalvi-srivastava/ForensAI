package com.forensai.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.forensai.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}