import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Trash2, Edit3, Plus } from 'lucide-react';

export function EditProduct() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showcaseImages, setShowcaseImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8087/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const fetchProducts = (catName) => {
    setSelectedCategory(catName);
    setEditingProduct(null);
    if (!catName) return;
    axios.get(`http://localhost:8087/api/products/category/${encodeURIComponent(catName)}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://localhost:8087/api/products/${id}`)
        .then(() => {
          setSuccessMessage('Product deleted successfully.');
          fetchProducts(selectedCategory);
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(err => console.error('Error deleting product:', err));
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setShowcaseImages(
        Array.isArray(editingProduct.showcaseImages) && editingProduct.showcaseImages.length > 0
          ? editingProduct.showcaseImages
          : ['']
      );
      setSelectedCategory(editingProduct.category || '');
    }
  }, [editingProduct]);

  const handleShowcaseChange = (index, value) => {
    const updated = [...showcaseImages];
    updated[index] = value;
    setShowcaseImages(updated);
  };

  const addShowcaseField = () => {
    setShowcaseImages([...showcaseImages, '']);
  };

  const validateForm = () => {
    const newErrors = [];
    if (!editingProduct.category) newErrors.push('Category is required');
    if (!editingProduct.name.trim()) newErrors.push('Product name is required');
    if (!editingProduct.image.trim()) newErrors.push('Primary image is required');
    if (!editingProduct.actualPrice || parseFloat(editingProduct.actualPrice) <= 0) {
      newErrors.push('Valid actual price is required');
    }
    if (
      editingProduct.offerPrice &&
      parseFloat(editingProduct.offerPrice) >= parseFloat(editingProduct.actualPrice)
    ) {
      newErrors.push('Offer price must be less than actual price');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...editingProduct,
      showcaseImages: showcaseImages.filter(url => url.trim() !== '')
    };

    axios.put(`http://localhost:8087/api/products/${editingProduct.id}`, payload)
      .then(() => {
        setSuccessMessage('✅ Product updated successfully!');
        setEditingProduct(null);
        fetchProducts(selectedCategory);
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(err => {
        console.error('Error updating product:', err);
        setErrors(['Failed to update product. Please try again.']);
      });
  };

  const calculateDiscount = () => {
    if (editingProduct?.actualPrice && editingProduct?.offerPrice) {
      const actual = parseFloat(editingProduct.actualPrice);
      const offer = parseFloat(editingProduct.offerPrice);
      return Math.round(((actual - offer) / actual) * 100);
    }
    return 0;
  };

  const renderCategoryFields = () => {
    if (!editingProduct?.category) return null;
    const cat = editingProduct.category;

    switch (cat) {
      case 'Mobiles':
        return (
          <>
            <Field label="RAM" value={editingProduct.ram || ''} onChange={v => setEditingProduct({ ...editingProduct, ram: v })} placeholder="e.g., 8GB" />
            <Field label="Internal Storage" value={editingProduct.storage || ''} onChange={v => setEditingProduct({ ...editingProduct, storage: v })} placeholder="e.g., 128GB" />
            <Field label="Display Size" value={editingProduct.displaySize || ''} onChange={v => setEditingProduct({ ...editingProduct, displaySize: v })} placeholder="e.g., 6.5-inch AMOLED" />
            <Field label="Camera" value={editingProduct.camera || ''} onChange={v => setEditingProduct({ ...editingProduct, camera: v })} placeholder="e.g., 108MP + 12MP" />
            <Field label="Battery" value={editingProduct.battery || ''} onChange={v => setEditingProduct({ ...editingProduct, battery: v })} placeholder="e.g., 5000mAh" />
            <Field label="Processor" value={editingProduct.processor || ''} onChange={v => setEditingProduct({ ...editingProduct, processor: v })} placeholder="e.g., Snapdragon 8 Gen 2" />
          </>
        );
      case 'Laptops':
        return (
          <>
            <Field label="Processor" value={editingProduct.processor || ''} onChange={v => setEditingProduct({ ...editingProduct, processor: v })} placeholder="e.g., Intel i7" />
            <Field label="RAM" value={editingProduct.ram || ''} onChange={v => setEditingProduct({ ...editingProduct, ram: v })} placeholder="e.g., 16GB" />
            <Field label="Storage" value={editingProduct.storage || ''} onChange={v => setEditingProduct({ ...editingProduct, storage: v })} placeholder="e.g., 1TB SSD" />
            <Field label="Display Size" value={editingProduct.displaySize || ''} onChange={v => setEditingProduct({ ...editingProduct, displaySize: v })} placeholder="e.g., 15.6-inch" />
            <Field label="Battery" value={editingProduct.battery || ''} onChange={v => setEditingProduct({ ...editingProduct, battery: v })} placeholder="e.g., 8 hours" />
          </>
        );
      case 'Televisions':
        return (
          <>
            <Field label="Display & Screen" value={editingProduct.display || ''} onChange={v => setEditingProduct({ ...editingProduct, display: v })} placeholder="e.g., 55-inch LED" />
            <Field label="Audio & Sound" value={editingProduct.audioPerformance || ''} onChange={v => setEditingProduct({ ...editingProduct, audioPerformance: v })} placeholder="e.g., Dolby Atmos, 20W output" />
            <Field label="Smart Features" value={editingProduct.smartFeatures || ''} onChange={v => setEditingProduct({ ...editingProduct, smartFeatures: v })} placeholder="e.g., Android TV, Chromecast built-in" />
            <Field label="Connectivity & Ports" value={editingProduct.connectivity || ''} onChange={v => setEditingProduct({ ...editingProduct, connectivity: v })} placeholder="e.g., HDMI, USB, Ethernet" />
            <Field label="Power & Energy" value={editingProduct.powerEnergy || ''} onChange={v => setEditingProduct({ ...editingProduct, powerEnergy: v })} placeholder="e.g., 100W, Energy Star certified" />
            <Field label="Design & Build" value={editingProduct.designBuild || ''} onChange={v => setEditingProduct({ ...editingProduct, designBuild: v })} placeholder="e.g., Slim bezel, metal frame" />
          </>
        );
      case 'Smart Watches':
        return (
          <>
            <Field label="Display" value={editingProduct.display || ''} onChange={v => setEditingProduct({ ...editingProduct, display: v })} placeholder="e.g., 1.69-inch HD, 550 nits brightness" />
            <Field label="Connectivity" value={editingProduct.connectivity || ''} onChange={v => setEditingProduct({ ...editingProduct, connectivity: v })} placeholder="e.g., Bluetooth Calling" />
            <Field label="Design & Build" value={editingProduct.designBuild || ''} onChange={v => setEditingProduct({ ...editingProduct, designBuild: v })} placeholder="e.g., Curved touch, Black strap, IP68" />
            <Field label="Personalization" value={editingProduct.personalization || ''} onChange={v => setEditingProduct({ ...editingProduct, personalization: v })} placeholder="e.g., 150+ watch faces" />
            <Field label="Health Monitoring" value={editingProduct.healthMonitoring || ''} onChange={v => setEditingProduct({ ...editingProduct, healthMonitoring: v })} placeholder="e.g., Heart rate, SpO2, Sleep" />
            <Field label="Usage Category" value={editingProduct.usageCategory || ''} onChange={v => setEditingProduct({ ...editingProduct, usageCategory: v })} placeholder="e.g., Fitness & Everyday" />
            <Field label="Input Method" value={editingProduct.inputMethod || ''} onChange={v => setEditingProduct({ ...editingProduct, inputMethod: v })} placeholder="e.g., Full touch screen, side button" />
          </>
        );
      case 'Earphones':
        return (
          <>
            <Field label="Microphone & Call Features" value={editingProduct.microphoneCallFeatures || ''} onChange={v => setEditingProduct({ ...editingProduct, microphoneCallFeatures: v })} placeholder="e.g., Noise cancellation, call support" />
            <Field label="Connectivity" value={editingProduct.connectivity || ''} onChange={v => setEditingProduct({ ...editingProduct, connectivity: v })} placeholder="e.g., Wired/Bluetooth 5.0" />
            <Field label="Audio & Performance" value={editingProduct.audioPerformance || ''} onChange={v => setEditingProduct({ ...editingProduct, audioPerformance: v })} placeholder="e.g., 10mm drivers, Hi-res audio" />
            <Field label="Battery & Charging" value={editingProduct.batteryCharging || ''} onChange={v => setEditingProduct({ ...editingProduct, batteryCharging: v })} placeholder="e.g., 8 hours playtime, fast charging" />
            <Field label="Durability & Design" value={editingProduct.durabilityDesign || ''} onChange={v => setEditingProduct({ ...editingProduct, durabilityDesign: v })} placeholder="e.g., IPX4 sweat resistance, ergonomic design" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Edit Products</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {errors.length > 0 &&
        <div className="alert alert-danger">
          {errors.map((error, idx) => <div key={idx}>{error}</div>)}
        </div>
      }

      <div className="mb-3">
        <label className="form-label">Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => fetchProducts(e.target.value)}
          className="form-select"
        >
          <option value="">-- Choose --</option>
          {categories.map(cat => <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>)}
        </select>
      </div>

      {selectedCategory && !editingProduct &&
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0
              ? <tr><td colSpan="3">No products found</td></tr>
              : products.map(prod =>
                <tr key={prod.id}>
                  <td>{prod.brand}</td>
                  <td>{prod.name}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => setEditingProduct(prod)}>
                      <Edit3 size={14} /> Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod.id)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      }

      {editingProduct &&
        <form onSubmit={handleUpdate}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                value={editingProduct.category}
                onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>

            <Field label="Product Name" required value={editingProduct.name} onChange={v => setEditingProduct({ ...editingProduct, name: v })} />
            <Field label="Brand" value={editingProduct.brand || ''} onChange={v => setEditingProduct({ ...editingProduct, brand: v })} />
            <Field label="Actual Price" type="number" required value={editingProduct.actualPrice || ''} onChange={v => setEditingProduct({ ...editingProduct, actualPrice: v })} />
            <Field label="Offer Price" type="number" value={editingProduct.offerPrice || ''} onChange={v => setEditingProduct({ ...editingProduct, offerPrice: v })} extra={calculateDiscount() ? <small className="text-success">{calculateDiscount()}% off</small> : null} />

            {renderCategoryFields()}

            <div className="col-12 mt-4">
              <label className="form-label">Primary Image URL</label>
              <input type="url" value={editingProduct.image || ''} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} className="form-control" required />
              {editingProduct.image && <img src={editingProduct.image} alt="Preview" className="mt-2 rounded" style={{ width: 100, height: 100, objectFit: 'cover' }} />}
            </div>

            <div className="col-12 mt-3">
              <label className="form-label">Showcase Images</label>
              {showcaseImages.map((url, idx) =>
                <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                  <input type="url" value={url} onChange={e => handleShowcaseChange(idx, e.target.value)} className="form-control" placeholder={`Showcase Image URL ${idx + 1}`} />
                  {url && <img src={url} alt="Showcase" className="rounded" style={{ width: 40, height: 40, objectFit: 'cover' }} />}
                </div>
              )}
              <button type="button" onClick={addShowcaseField} className="btn btn-sm btn-outline-primary"><Plus size={14} /> Add More</button>
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={3} value={editingProduct.description || ''} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
            </div>

            <div className="col-12 form-check">
              <input type="checkbox" id="stock" className="form-check-input" checked={editingProduct.inStock} onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} />
              <label htmlFor="stock" className="form-check-label">In Stock</label>
            </div>

          </div>

          <div className="text-end mt-4">
            <button type="submit" className="btn btn-primary">
              <Save className="me-2" /> Update Product
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingProduct(null)}>Cancel</button>
          </div>
        </form>
      }
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required = false, col = "6", extra }) {
  return (
    <div className={`col-md-${col} mb-3`}>
      <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="form-control" placeholder={placeholder} required={required} />
      {extra}
    </div>
  );
}
