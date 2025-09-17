package com.example.demo.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(unique = true)
  private String anonymousId;
  
  @Column(unique = true, nullable = false)
  private String username;

  @Column(nullable = false)
  private String password;

  private String firstName;
  private String lastName;
  private String email;
  private String mobile;
  
  @ElementCollection
  @CollectionTable(
      name = "user_addresses",
      joinColumns = @JoinColumn(name = "user_id")
  )
  @Column(name = "address", length = 1000)
  private List<String> addresses = new ArrayList<>();
  
  @ElementCollection
  @CollectionTable(
      name = "user_orders",
      joinColumns = @JoinColumn(name = "user_id")
  )
  private List<OrderDetail> orders = new ArrayList<>();
  
public List<OrderDetail> getOrders() {
	return orders;
}
public void setOrders(List<OrderDetail> orders) {
	this.orders = orders;
}
public List<String> getAddresses() {
	return addresses;
}
public void setAddresses(List<String> addresses) {
	this.addresses = addresses;
}
public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
public String getUsername() {
	return username;
}
public void setUsername(String username) {
	this.username = username;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}
public String getFirstName() {
	return firstName;
}
public void setFirstName(String firstName) {
	this.firstName = firstName;
}
public String getLastName() {
	return lastName;
}
public void setLastName(String lastName) {
	this.lastName = lastName;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getMobile() {
	return mobile;
}
public void setMobile(String mobile) {
	this.mobile = mobile;
}
public String getAnonymousId() {
	return anonymousId;
}
public void setAnonymousId(String anonymousId) {
	this.anonymousId = anonymousId;
}


  
}