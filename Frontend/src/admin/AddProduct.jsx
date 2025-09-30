import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Save, Plus } from 'lucide-react';

export function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    brand: '',
    actualPrice: '',
    offerPrice: '',
    image: '', // Primary Image
    description: '',
    inStock: true,
    ram: '',
    storage: '',
    displaySize: '',
    camera: '',
    battery: '',
    processor: '',
    resolution: '',
    panelType: '',
    smartFeatures: '',
    driverSize: '',
    connectivity: '',
    waterResistance: '',
    display: '',
    designBuild: '',
    personalization: '',
    healthMonitoring: '',
    usageCategory: '',
    inputMethod: '',
    microphoneCallFeatures: '',
    audioPerformance: '',
    batteryCharging: '',
    durabilityDesign: '',

    // Televisions new fields:
    audioSound: '',
    connectivityPorts: '',
    powerEnergy: '',
  });
  const [showcaseImages, setShowcaseImages] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8087/api/categories')
      .then((res) => { setCategories(res.data); })
      .catch((err) => { console.error('Error fetching categories:', err); });
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleShowcaseImageChange = (index, value) => {
    const updated = [...showcaseImages];
    updated[index] = value;
    setShowcaseImages(updated);
  };

  const addShowcaseImageField = () => {
    setShowcaseImages([...showcaseImages, '']);
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.category) newErrors.push('Category is required');
    if (!formData.name.trim()) newErrors.push('Product name is required');
    if (!formData.image.trim()) newErrors.push('Primary image is required');
    if (!formData.actualPrice || parseFloat(formData.actualPrice) <= 0) {
      newErrors.push('Valid actual price is required');
    }
    if (
      formData.offerPrice &&
      parseFloat(formData.offerPrice) >= parseFloat(formData.actualPrice)
    ) {
      newErrors.push('Offer price must be less than actual price');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const calculateDiscount = () => {
    if (formData.actualPrice && formData.offerPrice) {
      const actual = parseFloat(formData.actualPrice);
      const offer = parseFloat(formData.offerPrice);
      return Math.round(((actual - offer) / actual) * 100);
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const newProduct = {
      ...formData,
      actualPrice: parseFloat(formData.actualPrice),
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
      showcaseImages: showcaseImages.filter((url) => url.trim() !== ''),
      rating: 4.0 + Math.random(),
      createdAt: new Date().toISOString()
    };
    axios.post('http://localhost:8087/api/products', newProduct)
      .then(() => {
        setIsSubmitting(false);
        setSuccessMessage('Product added successfully!');
        setFormData({
          category: '',
          name: '',
          brand: '',
          actualPrice: '',
          offerPrice: '',
          image: '',
          description: '',
          inStock: true,
          ram: '',
          storage: '',
          displaySize: '',
          camera: '',
          battery: '',
          processor: '',
          resolution: '',
          panelType: '',
          smartFeatures: '',
          driverSize: '',
          connectivity: '',
          waterResistance: '',
          display: '',
          designBuild: '',
          personalization: '',
          healthMonitoring: '',
          usageCategory: '',
          inputMethod: '',
          microphoneCallFeatures: '',
          audioPerformance: '',
          batteryCharging: '',
          durabilityDesign: '',
          audioSound: '',
          connectivityPorts: '',
          powerEnergy: '',
        });
        setShowcaseImages(['']);
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(err => {
        console.error('Error adding product:', err);
        setIsSubmitting(false);
        setErrors(['Failed to add product. Please try again.']);
      });
  };

  // ==== CATEGORY-SPECIFIC FIELDS with updated Televisions fields ====
  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case 'Smart Watches':
        return (
          <>
            <Field label="Display" value={formData.display} onChange={(v) => handleInputChange('display', v)} placeholder="e.g., 1.69-inch HD, 550 nits brightness" />
            <Field label="Connectivity" value={formData.connectivity} onChange={(v) => handleInputChange('connectivity', v)} placeholder="e.g., Bluetooth Calling" />
            <Field label="Design & Build" value={formData.designBuild} onChange={(v) => handleInputChange('designBuild', v)} placeholder="e.g., Curved touch, Black strap, IP68" />
            <Field label="Personalization" value={formData.personalization} onChange={(v) => handleInputChange('personalization', v)} placeholder="e.g., 150+ watch faces" />
            <Field label="Health Monitoring" value={formData.healthMonitoring} onChange={(v) => handleInputChange('healthMonitoring', v)} placeholder="e.g., Heart rate, SpO2, Sleep" />
            <Field label="Usage Category" value={formData.usageCategory} onChange={(v) => handleInputChange('usageCategory', v)} placeholder="e.g., Fitness & Everyday" />
            <Field label="Input Method" value={formData.inputMethod} onChange={(v) => handleInputChange('inputMethod', v)} placeholder="e.g., Full touch screen, side button" />
          </>
        );
      case 'Mobiles':
        return (
          <>
            <Field label="RAM" value={formData.ram} onChange={(v) => handleInputChange('ram', v)} placeholder="e.g., 8GB" />
            <Field label="Internal Storage" value={formData.storage} onChange={(v) => handleInputChange('storage', v)} placeholder="e.g., 128GB" />
            <Field label="Display Size" value={formData.displaySize} onChange={(v) => handleInputChange('displaySize', v)} placeholder="e.g., 6.5-inch AMOLED" />
            <Field label="Camera" value={formData.camera} onChange={(v) => handleInputChange('camera', v)} placeholder="e.g., 108MP + 12MP" />
            <Field label="Battery" value={formData.battery} onChange={(v) => handleInputChange('battery', v)} placeholder="e.g., 5000mAh" />
            <Field label="Processor" value={formData.processor} onChange={(v) => handleInputChange('processor', v)} placeholder="e.g., Snapdragon 8 Gen 2" />
          </>
        );
      case 'Laptops':
        return (
          <>
            <Field label="Processor" value={formData.processor} onChange={(v) => handleInputChange('processor', v)} placeholder="e.g., Intel i7" />
            <Field label="RAM" value={formData.ram} onChange={(v) => handleInputChange('ram', v)} placeholder="e.g., 16GB" />
            <Field label="Storage" value={formData.storage} onChange={(v) => handleInputChange('storage', v)} placeholder="e.g., 1TB SSD" />
            <Field label="Display Size" value={formData.displaySize} onChange={(v) => handleInputChange('displaySize', v)} placeholder="e.g., 15.6-inch" />
            <Field label="Battery" value={formData.battery} onChange={(v) => handleInputChange('battery', v)} placeholder="e.g., 8 hours" />
          </>
        );
      case 'Televisions':
        return (
          <>
            <Field label="Display & Screen" value={formData.displaySize} onChange={(v) => handleInputChange('displaySize', v)} placeholder="e.g., 55-inch LED" />
            <Field label="Audio & Sound" value={formData.audioSound} onChange={(v) => handleInputChange('audioSound', v)} placeholder="e.g., Dolby Atmos, 20W output" />
            <Field label="Smart Features" value={formData.smartFeatures} onChange={(v) => handleInputChange('smartFeatures', v)} placeholder="e.g., Android TV, Google Assistant" />
            <Field label="Connectivity & Ports" value={formData.connectivityPorts} onChange={(v) => handleInputChange('connectivityPorts', v)} placeholder="e.g., HDMI, USB, WiFi" />
            <Field label="Power & Energy" value={formData.powerEnergy} onChange={(v) => handleInputChange('powerEnergy', v)} placeholder="e.g., 100W Power Consumption" />
            <Field label="Design & Build" value={formData.designBuild} onChange={(v) => handleInputChange('designBuild', v)} placeholder="e.g., Slim bezel, Aluminum frame" />
          </>
        );
      case 'Earphones':
        return (
          <>
            <Field label="Microphone & Call Features" value={formData.microphoneCallFeatures} onChange={(v) => handleInputChange('microphoneCallFeatures', v)} placeholder="e.g., Noise cancellation, call support" />
            <Field label="Connectivity" value={formData.connectivity} onChange={(v) => handleInputChange('connectivity', v)} placeholder="e.g., Wired/Bluetooth 5.0" />
            <Field label="Audio & Performance" value={formData.audioPerformance} onChange={(v) => handleInputChange('audioPerformance', v)} placeholder="e.g., 10mm drivers, Hi-res audio" />
            <Field label="Battery & Charging" value={formData.batteryCharging} onChange={(v) => handleInputChange('batteryCharging', v)} placeholder="e.g., 8 hours playtime, fast charging" />
            <Field label="Durability & Design" value={formData.durabilityDesign} onChange={(v) => handleInputChange('durabilityDesign', v)} placeholder="e.g., IPX4 sweat resistance, ergonomic design" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary p-2 rounded me-3">
          <Package className="text-white" size={24} />
        </div>
        <h2 className="h4 mb-0 text-dark">Add New Product</h2>
      </div>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((error, i) => (
            <div key={i}>{error}</div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Category */}
          <div className="col-md-6">
            <label className="form-label">Category <span className="text-danger">*</span></label>
            <select
              value={formData.category}
              onChange={e => handleInputChange('category', e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <Field label="Product Name" required value={formData.name} onChange={v => handleInputChange('name', v)} placeholder="Enter product name" col="6" />
          <Field label="Brand" value={formData.brand} onChange={v => handleInputChange('brand', v)} placeholder="Enter brand name" col="6" />
          <Field label="Actual Price (₹)" type="number" required value={formData.actualPrice} onChange={v => handleInputChange('actualPrice', v)} placeholder="Enter actual price" col="6" />
          <Field label="Offer Price (₹)" type="number" value={formData.offerPrice} onChange={v => handleInputChange('offerPrice', v)} placeholder="Enter offer price" col="6" extra={calculateDiscount() > 0 && <small className="text-success">{calculateDiscount()}% discount</small>} />
          {/* Render category-specific fields */}
          {renderCategorySpecificFields()}
        </div>
        {/* Primary Image */}
        <div className="mb-3 mt-4">
          <label className="form-label">Primary Product Image <span className="text-danger">*</span></label>
          <input type="url" value={formData.image} onChange={e => handleInputChange('image', e.target.value)} className="form-control" required />
          {formData.image && <img src={formData.image} alt="Preview" className="mt-2 rounded" style={{ width: '8rem', height: '8rem', objectFit: 'cover' }} />}
        </div>
        {/* Showcase Images */}
        <div className="mb-3">
          <label className="form-label">Showcase Images <small className="text-muted">(for gallery in Product Detail page)</small></label>
          {showcaseImages.map((url, i) => (
            <div key={i} className="d-flex align-items-center gap-2 mb-2">
              <input type="url" value={url} onChange={e => handleShowcaseImageChange(i, e.target.value)} className="form-control" placeholder={`Showcase image URL ${i + 1}`} />
              {url && <img src={url} alt="Preview" style={{ width: '4rem', height: '4rem', objectFit: 'cover' }} className="rounded" />}
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={addShowcaseImageField}>
            <Plus size={14} /> Add Another Image
          </button>
        </div>
        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Product Description</label>
          <textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="form-control" rows="3" />
        </div>
        {/* Stock */}
        <div className="form-check mb-4">
          <input type="checkbox" checked={formData.inStock} onChange={e => handleInputChange('inStock', e.target.checked)} className="form-check-input" id="inStockCheck" />
          <label className="form-check-label" htmlFor="inStockCheck">In Stock</label>
        </div>
        {/* Submit */}
        <div className="text-end">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            <Save size={18} className="me-2" />
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Field component remains the same
function Field({ label, value, onChange, placeholder, type = "text", required = false, col = "6", extra }) {
  return (
    <div className={`col-md-${col}`}>
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="form-control" placeholder={placeholder} required={required} />
      {extra}
    </div>
  );
}
