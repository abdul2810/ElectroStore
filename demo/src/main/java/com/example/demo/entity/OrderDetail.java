package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderDetail {

    private String productName;
    private String productBrand;
    private String productImage;

    private double totalPrice;
    private String address;
    private String paymentMethod;

    private LocalDate orderDate;   // when order placed
    private int deliveryDays;
    
    private LocalDate deliveryDate;// random days (4–7)

    public OrderDetail() {}

    // constructor for quick creation
    public OrderDetail(String productName, String productBrand, String productImage,
                       double totalPrice, String address, String paymentMethod,
                       LocalDate orderDate, int deliveryDays) {
        this.productName = productName;
        this.productBrand = productBrand;
        this.productImage = productImage;
        this.totalPrice = totalPrice;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
        this.deliveryDays = deliveryDays;
    }

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductBrand() {
		return productBrand;
	}

	public void setProductBrand(String productBrand) {
		this.productBrand = productBrand;
	}

	public String getProductImage() {
		return productImage;
	}

	public void setProductImage(String productImage) {
		this.productImage = productImage;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public LocalDate getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDate orderDate) {
		this.orderDate = orderDate;
	}

	public int getDeliveryDays() {
		return deliveryDays;
	}

	public void setDeliveryDays(int deliveryDays) {
		this.deliveryDays = deliveryDays;
	}

	public LocalDate getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(LocalDate deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

    // getters & setters
}
