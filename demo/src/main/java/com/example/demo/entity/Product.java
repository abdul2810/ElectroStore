package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String brand;

    private Double actualPrice;

    private Double offerPrice;

    private String image;

    private String category;

    @Column(length = 2000)
    private String description;

    private String ram;

    private String storage;

    private boolean inStock;

    private Double rating;

    private LocalDateTime createdAt;
    
    private String displaySize;
    private String camera;
    private String battery;
    private String processor;
    
    private String resolution;
    private String panelType;
    private String smartFeatures;
    private String driverSize;
    private String connectivity;
    private String waterResistance;
    
    private String display;
    private String designBuild;
    private String personalization;
    private String healthMonitoring;
    private String usageCategory;
    private String inputMethod;
    
    private String microphoneCallFeatures;
    private String audioPerformance;
    private String batteryCharging;
    private String durabilityDesign;
    
    private String audioSound;
    private String connectivityPorts;
    private String powerEnergy;
    
    public String getAudioSound() {
		return audioSound;
	}

	public void setAudioSound(String audioSound) {
		this.audioSound = audioSound;
	}

	public String getConnectivityPorts() {
		return connectivityPorts;
	}

	public void setConnectivityPorts(String connectivityPorts) {
		this.connectivityPorts = connectivityPorts;
	}

	public String getPowerEnergy() {
		return powerEnergy;
	}

	public void setPowerEnergy(String powerEnergy) {
		this.powerEnergy = powerEnergy;
	}

	public String getMicrophoneCallFeatures() {
		return microphoneCallFeatures;
	}

	public void setMicrophoneCallFeatures(String microphoneCallFeatures) {
		this.microphoneCallFeatures = microphoneCallFeatures;
	}

	public String getAudioPerformance() {
		return audioPerformance;
	}

	public void setAudioPerformance(String audioPerformance) {
		this.audioPerformance = audioPerformance;
	}

	public String getBatteryCharging() {
		return batteryCharging;
	}

	public void setBatteryCharging(String batteryCharging) {
		this.batteryCharging = batteryCharging;
	}

	public String getDurabilityDesign() {
		return durabilityDesign;
	}

	public void setDurabilityDesign(String durabilityDesign) {
		this.durabilityDesign = durabilityDesign;
	}

	public String getDisplay() {
		return display;
	}

	public void setDisplay(String display) {
		this.display = display;
	}

	public String getDesignBuild() {
		return designBuild;
	}

	public void setDesignBuild(String designBuild) {
		this.designBuild = designBuild;
	}

	public String getPersonalization() {
		return personalization;
	}

	public void setPersonalization(String personalization) {
		this.personalization = personalization;
	}

	public String getHealthMonitoring() {
		return healthMonitoring;
	}

	public void setHealthMonitoring(String healthMonitoring) {
		this.healthMonitoring = healthMonitoring;
	}

	public String getUsageCategory() {
		return usageCategory;
	}

	public void setUsageCategory(String usageCategory) {
		this.usageCategory = usageCategory;
	}

	public String getInputMethod() {
		return inputMethod;
	}

	public void setInputMethod(String inputMethod) {
		this.inputMethod = inputMethod;
	}

	public String getResolution() {
		return resolution;
	}

	public void setResolution(String resolution) {
		this.resolution = resolution;
	}

	public String getPanelType() {
		return panelType;
	}

	public void setPanelType(String panelType) {
		this.panelType = panelType;
	}

	public String getSmartFeatures() {
		return smartFeatures;
	}

	public void setSmartFeatures(String smartFeatures) {
		this.smartFeatures = smartFeatures;
	}

	public String getDriverSize() {
		return driverSize;
	}

	public void setDriverSize(String driverSize) {
		this.driverSize = driverSize;
	}

	public String getConnectivity() {
		return connectivity;
	}

	public void setConnectivity(String connectivity) {
		this.connectivity = connectivity;
	}

	public String getWaterResistance() {
		return waterResistance;
	}

	public void setWaterResistance(String waterResistance) {
		this.waterResistance = waterResistance;
	}

	@ElementCollection
    private List<String> showcaseImages;
    
    
	public List<String> getShowcaseImages() {
		return showcaseImages;
	}

	public void setShowcaseImages(List<String> showcaseImages) {
		this.showcaseImages = showcaseImages;
	}

	// Constructors
    public Product() {}

    // Getters and setters for all fields

    public Long getId() {
        return id;
    }

    public String getDisplaySize() {
		return displaySize;
	}

	public void setDisplaySize(String displaySize) {
		this.displaySize = displaySize;
	}

	public String getCamera() {
		return camera;
	}

	public void setCamera(String camera) {
		this.camera = camera;
	}

	public String getBattery() {
		return battery;
	}

	public void setBattery(String battery) {
		this.battery = battery;
	}

	public String getProcessor() {
		return processor;
	}

	public void setProcessor(String processor) {
		this.processor = processor;
	}

	public void setId(Long id) {
        this.id = id;
    }

    // ... similar getter/setter for other fields ...

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Double getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(Double actualPrice) {
        this.actualPrice = actualPrice;
    }

    public Double getOfferPrice() {
        return offerPrice;
    }

    public void setOfferPrice(Double offerPrice) {
        this.offerPrice = offerPrice;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRam() {
        return ram;
    }

    public void setRam(String ram) {
        this.ram = ram;
    }

    public String getStorage() {
        return storage;
    }

    public void setStorage(String storage) {
        this.storage = storage;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
