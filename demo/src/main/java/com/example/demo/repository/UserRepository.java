package com.example.demo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
  @Query("SELECT u.addresses FROM User u WHERE u.id = :userId")
  List<String> findAddressesByUserId(@Param("userId") Long userId);
  Optional<User> findByEmail(String email);
  Optional<User> findByAnonymousId(String anonymousId);

}