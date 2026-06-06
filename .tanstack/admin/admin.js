// Import Firebase
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '/firebase-config.js';
import { loadReviews, loadRepairs, addRepair } from '/admin/admin-firebase.js';

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dahl5h8iy';
const CLOUDINARY_UPLOAD_PRESET = 'astro-services';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Admin Panel JavaScript
let products = [];
let filteredProducts = [];
let searchQuery = '';

// Multi-image upload state
let selectedImages = [];
let primaryImageIndex = 0;

// Load products from Firebase
async function loadProducts() {
    try {
        console.log('Loading products from Firebase...');
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        products = [];
        productsSnapshot.forEach((docSnap) => {
            products.push({
                firebaseId: docSnap.id,
                ...docSnap.data()
            });
        });
        
        console.log('Products loaded:', products.length);
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products from Firebase', 'error');
    }
}

// Current active category filter
let activeCategory = 'all';

// Display products in manage section
function displayProducts(productsToDisplay = null) {
    const productsList = document.getElementById('productsList');
    let displayList = productsToDisplay || products;
    
    // Apply category filter if not searching
    if (!productsToDisplay && activeCategory !== 'all') {
        displayList = products.filter(p => p.category === activeCategory);
    }
    
    if (products.length === 0) {
        productsList.innerHTML = '<p class="loading">No products found. Add your first product!</p>';
        return;
    }
    
    if (displayList.length === 0) {
        productsList.innerHTML = `<p class="loading">No products found in this category.</p>`;
        return;
    }
    
    // Update category counts
    updateCategoryCounts();
    
    productsList.innerHTML = displayList.map(product => {
        // Handle both new multi-image format and old single image format
        let imageSrc;
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            // New format: use primary image or first image
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
            imageSrc = primaryImage.url;
        } else if (product.image) {
            // Old format: single image
            if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
                imageSrc = product.image;
            } else if (product.image.startsWith('data:')) {
                imageSrc = product.image;
            } else {
                imageSrc = `../${product.image}`;
            }
        } else {
            imageSrc = '../images/placeholder.jpg';
        }
        
        // Show image count badge if multiple images
        const imageCountBadge = (product.images && product.images.length > 1) 
            ? `<span class="meta-badge" style="background: rgba(59, 130, 246, 0.2); color: #3b82f6;">
                <i class="fas fa-images"></i> ${product.images.length} images
               </span>` 
            : '';
        
        return `
        <div class="product-item" data-id="${product.id}">
            <img src="${imageSrc}" alt="${product.name}" onerror="this.src='../images/placeholder.jpg'">
            <div class="product-details">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span class="meta-badge category">${product.category}</span>
                    ${product.platform && product.platform.trim() !== '' ? `<span class="meta-badge category">${product.platform}</span>` : ''}
                    ${product.onSale && product.salePrice ? 
                        `<span class="meta-badge price" style="text-decoration: line-through; opacity: 0.6;">₦${product.price.toLocaleString()}</span>
                         <span class="meta-badge price">₦${product.salePrice.toLocaleString()}</span>
                         <span class="meta-badge sale">SALE</span>` :
                        `<span class="meta-badge price">₦${product.price.toLocaleString()}</span>`
                    }
                    <span class="meta-badge ${product.inStock ? 'stock' : 'out-of-stock'}">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    ${imageCountBadge}
                    ${product.badges && Array.isArray(product.badges) ? 
                        product.badges.filter(b => b && b.trim() !== '').map(badge => 
                            `<span class="meta-badge ${badge}">${badge.toUpperCase()}</span>`
                        ).join('') : 
                        (product.badge && product.badge.trim() !== '' ? 
                            `<span class="meta-badge ${product.badge}">${product.badge.toUpperCase()}</span>` : 
                            '')
                    }
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-icon btn-edit" data-product-id="${product.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" data-product-id="${product.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    }).join('');
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.productId;
            deleteProduct(productId);
        });
    });
}

// Toggle sale price field based on sale checkbox
function toggleSalePriceField() {
    const onSale = document.getElementById('productOnSale').checked;
    const salePriceGroup = document.getElementById('salePriceGroup');
    const salePriceInput = document.getElementById('productSalePrice');
    
    if (onSale) {
        salePriceGroup.style.display = 'block';
        salePriceInput.required = true;
    } else {
        salePriceGroup.style.display = 'none';
        salePriceInput.required = false;
        salePriceInput.value = '';
    }
}

// Add/Update product form handler
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Prevent duplicate submissions
    if (submitBtn.disabled) return;
    
    // Check if we're in edit mode
    if (window.isEditMode && window.editingProductId) {
        await updateProduct(window.editingProductId);
        return;
    }
    
    // Get selected badges from checkboxes
    const badgeCheckboxes = document.querySelectorAll('.badge-checkbox:checked');
    const badges = Array.from(badgeCheckboxes).map(cb => cb.value);
    
    const price = parseInt(document.getElementById('productPrice').value);
    const onSale = document.getElementById('productOnSale').checked;
    const salePrice = document.getElementById('productSalePrice').value;
    
    // Validate sale price if on sale
    if (onSale) {
        if (!salePrice || salePrice === '') {
            showToast('Sale price is required when product is on sale', 'error');
            return;
        }
        const salePriceNum = parseInt(salePrice);
        if (salePriceNum >= price) {
            showToast('Sale price must be less than original price', 'error');
            return;
        }
    }
    
    // Get image file
    if (selectedImages.length === 0) {
        showToast('Please upload at least 1 product image', 'error');
        return;
    }
    
    if (selectedImages.length > 5) {
        showToast('Maximum 5 images allowed', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Product...';
    
    try {
        // Upload images to Cloudinary
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Images...';
        const imageUrls = [];
        
        for (let i = 0; i < selectedImages.length; i++) {
            const img = selectedImages[i];
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading Image ${i + 1}/${selectedImages.length}...`;
            const imageUrl = await uploadToCloudinary(img.file);
            imageUrls.push({
                url: imageUrl,
                isPrimary: img.isPrimary,
                order: i
            });
        }
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Product...';
        
        const newProduct = {
            id: document.getElementById('productId').value.trim(),
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDesc').value.trim(),
            price: price,
            onSale: onSale,
            salePrice: onSale ? parseInt(salePrice) : null,
            category: document.getElementById('productCategory').value,
            subcategory: document.getElementById('productSubcategory').value,
            platform: document.getElementById('productSubcategory').value === 'ios' || document.getElementById('productSubcategory').value === 'android' ? document.getElementById('productSubcategory').value : '',
            brand: document.getElementById('productBrand').value || null,
            images: imageUrls, // Array of image objects
            image: imageUrls.find(img => img.isPrimary)?.url || imageUrls[0].url, // Backward compatibility
            badges: badges,
            inStock: document.getElementById('productInStock').checked,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        // Check if product ID already exists
        if (products.find(p => p.id === newProduct.id)) {
            showToast('Product ID already exists!', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Product';
            return;
        }
        
        // Add to Firebase
        const productsCollection = collection(db, 'products');
        const docRef = await addDoc(productsCollection, newProduct);
        
        // Add to local array with Firebase ID
        products.push({
            firebaseId: docRef.id,
            ...newProduct
        });
        
        // Reset form to add mode
        resetFormToAddMode();
        
        showToast('Product added successfully!', 'success');
        displayProducts();
        
        // Reset button
        submitBtn.disabled = false;
    } catch (error) {
        console.error('Error adding product:', error);
        console.error('Error details:', error.message);
        
        let errorMessage = 'Error adding product to Firebase';
        if (error.message.includes('maximum size')) {
            errorMessage = 'Image is too large. Please use a smaller image (max 500KB recommended)';
        } else if (error.message) {
            errorMessage = `Error: ${error.message}`;
        }
        
        showToast(errorMessage, 'error');
        
        // Reset button on error
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Product';
    }
});

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDesc').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOnSale').checked = product.onSale || false;
    document.getElementById('productSalePrice').value = product.salePrice || '';
    document.getElementById('productCategory').value = product.category;
    
    // Pre-populate subcategory and brand using admin-product-form helper
    if (typeof window.adminProductForm !== 'undefined' && window.adminProductForm.prePopulateForm) {
        window.adminProductForm.prePopulateForm(product);
    } else {
        // Fallback: set values directly
        if (product.subcategory) {
            setTimeout(() => {
                document.getElementById('productSubcategory').value = product.subcategory;
            }, 100);
        }
        if (product.brand) {
            setTimeout(() => {
                document.getElementById('productBrand').value = product.brand;
            }, 150);
        }
    }
    
    // Set selected badges in checkboxes
    document.querySelectorAll('.badge-checkbox').forEach(cb => {
        cb.checked = false;
    });
    if (product.badges && Array.isArray(product.badges)) {
        product.badges.forEach(badge => {
            const checkbox = document.querySelector(`.badge-checkbox[value="${badge}"]`);
            if (checkbox) checkbox.checked = true;
        });
    } else if (product.badge) {
        const checkbox = document.querySelector(`.badge-checkbox[value="${product.badge}"]`);
        if (checkbox) checkbox.checked = true;
    }
    updateBadgeCount();
    
    document.getElementById('productInStock').checked = product.inStock;
    
    // Load existing images into selectedImages array
    selectedImages = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        // New format: multiple images
        product.images.forEach((img, index) => {
            selectedImages.push({
                file: null, // No file object for existing images
                dataUrl: img.url,
                isPrimary: img.isPrimary || false,
                isExisting: true // Flag to indicate this is an existing image
            });
        });
        // Find primary image index
        primaryImageIndex = selectedImages.findIndex(img => img.isPrimary);
        if (primaryImageIndex === -1) primaryImageIndex = 0;
    } else if (product.image) {
        // Old format: single image - convert to new format
        let imageSrc;
        if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
            imageSrc = product.image;
        } else if (product.image.startsWith('data:')) {
            imageSrc = product.image;
        } else {
            imageSrc = `../${product.image}`;
        }
        selectedImages.push({
            file: null,
            dataUrl: imageSrc,
            isPrimary: true,
            isExisting: true
        });
        primaryImageIndex = 0;
    }
    
    // Render the existing images
    renderImagePreviews();
    
    // Make image field optional when editing
    const imageInput = document.getElementById('productImages');
    imageInput.removeAttribute('required');
    document.getElementById('imageRequiredIndicator').style.display = 'none';
    
    // Show/hide sale price field
    toggleSalePriceField();
    
    // Disable ID field (can't change ID)
    document.getElementById('productId').disabled = true;
    
    // Set edit mode flag
    window.isEditMode = true;
    window.editingProductId = productId;
    
    // Change form button to Update
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
    
    // Switch to add product section
    switchSection('add-product');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update product
async function updateProduct(productId) {
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return;
    
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    
    // Prevent duplicate submissions
    if (submitBtn.disabled) return;
    
    // Get selected badges from checkboxes
    const badgeCheckboxes = document.querySelectorAll('.badge-checkbox:checked');
    const badges = Array.from(badgeCheckboxes).map(cb => cb.value);
    
    const price = parseInt(document.getElementById('productPrice').value);
    const onSale = document.getElementById('productOnSale').checked;
    const salePrice = document.getElementById('productSalePrice').value;
    
    // Validate sale price if on sale
    if (onSale) {
        if (!salePrice || salePrice === '') {
            showToast('Sale price is required when product is on sale', 'error');
            return;
        }
        const salePriceNum = parseInt(salePrice);
        if (salePriceNum >= price) {
            showToast('Sale price must be less than original price', 'error');
            return;
        }
    }
    
    // Validate images
    if (selectedImages.length === 0) {
        showToast('Please upload at least 1 product image', 'error');
        return;
    }
    
    if (selectedImages.length > 5) {
        showToast('Maximum 5 images allowed', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating Product...';
    
    try {
        // Process images - upload new ones, keep existing ones
        const imageUrls = [];
        let uploadCount = 0;
        
        for (let i = 0; i < selectedImages.length; i++) {
            const img = selectedImages[i];
            
            if (img.isExisting) {
                // Keep existing image
                imageUrls.push({
                    url: img.dataUrl,
                    isPrimary: img.isPrimary,
                    order: i
                });
            } else {
                // Upload new image
                uploadCount++;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading Image ${uploadCount}...`;
                const imageUrl = await uploadToCloudinary(img.file);
                imageUrls.push({
                    url: imageUrl,
                    isPrimary: img.isPrimary,
                    order: i
                });
            }
        }
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Changes...';
        
        const updatedProduct = {
            id: productId,
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDesc').value.trim(),
            price: price,
            onSale: onSale,
            salePrice: onSale ? parseInt(salePrice) : null,
            category: document.getElementById('productCategory').value,
            subcategory: document.getElementById('productSubcategory').value,
            platform: document.getElementById('productSubcategory').value === 'ios' || document.getElementById('productSubcategory').value === 'android' ? document.getElementById('productSubcategory').value : '',
            brand: document.getElementById('productBrand').value || null,
            images: imageUrls, // Array of image objects
            image: imageUrls.find(img => img.isPrimary)?.url || imageUrls[0].url, // Backward compatibility
            badges: badges,
            inStock: document.getElementById('productInStock').checked,
            updatedAt: Date.now()
        };
        
        // Update in Firebase
        const firebaseId = products[index].firebaseId;
        const productRef = doc(db, 'products', firebaseId);
        await updateDoc(productRef, updatedProduct);
        
        // Update local array
        products[index] = {
            firebaseId: firebaseId,
            ...updatedProduct,
            createdAt: products[index].createdAt
        };
        
        // Reset form to add mode
        resetFormToAddMode();
        
        showToast('Product updated successfully!', 'success');
        displayProducts();
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Error updating product in Firebase', 'error');
        
        // Reset button on error
        const submitBtn = document.querySelector('#productForm button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
    } finally {
        // Ensure button is re-enabled
        const submitBtn = document.querySelector('#productForm button[type="submit"]');
        if (submitBtn.disabled) {
            submitBtn.disabled = false;
        }
    }
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return;
    
    try {
        // Delete from Firebase
        const firebaseId = products[index].firebaseId;
        const productRef = doc(db, 'products', firebaseId);
        await deleteDoc(productRef);
        
        // Remove from local array
        products = products.filter(p => p.id !== productId);
        
        showToast('Product deleted successfully!', 'success');
        displayProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error deleting product from Firebase', 'error');
    }
}

// Note: saveProducts function is no longer needed as we save directly to Firebase
// Keeping this for backward compatibility but it does nothing
async function saveProducts() {
    console.log('Products are automatically saved to Firebase');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('adminToast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Section switching
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        switchSection(section);
        
        // Update active nav
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function switchSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Load data when switching to specific sections
    if (sectionId === 'review-approval') {
        loadReviews();
    } else if (sectionId === 'manage-repairs') {
        loadRepairs();
    } else if (sectionId === 'manage-products') {
        loadProducts();
    }
}

// Search functionality
function searchProducts(query) {
    searchQuery = query.toLowerCase().trim();
    
    if (searchQuery === '') {
        filteredProducts = products;
        document.getElementById('searchStats').style.display = 'none';
        document.getElementById('clearSearch').style.display = 'none';
        // Reset to active category filter
        activeCategory = 'all';
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector('[data-category="all"]').classList.add('active');
    } else {
        // Search across all products regardless of category
        filteredProducts = products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchQuery) ||
                product.id.toLowerCase().includes(searchQuery) ||
                product.category.toLowerCase().includes(searchQuery) ||
                (product.platform && product.platform.toLowerCase().includes(searchQuery)) ||
                (product.badge && product.badge.toLowerCase().includes(searchQuery)) ||
                product.description.toLowerCase().includes(searchQuery)
            );
        });
        
        // Show search stats
        const searchStats = document.getElementById('searchStats');
        const searchResultText = document.getElementById('searchResultText');
        searchStats.style.display = 'block';
        searchResultText.textContent = `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching "${query}"`;
        document.getElementById('clearSearch').style.display = 'flex';
        
        // Set to "all" tab when searching
        activeCategory = 'all';
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector('[data-category="all"]').classList.add('active');
    }
    
    displayProducts(filteredProducts);
}

// Character counter for description (removed limit)
function updateDescriptionCounter() {
    const descTextarea = document.getElementById('productDesc');
    const currentLength = descTextarea.value.length;
    
    // Find or create counter element
    let counter = descTextarea.parentElement.querySelector('.char-counter');
    if (!counter) {
        counter = document.createElement('small');
        counter.className = 'char-counter';
        counter.style.cssText = 'display: block; margin-top: 5px; text-align: right;';
        descTextarea.parentElement.appendChild(counter);
    }
    
    counter.textContent = `${currentLength} characters`;
    counter.style.color = 'var(--admin-text-secondary)';
}

// Character counter for product name (removed limit)
function updateNameCounter() {
    const nameInput = document.getElementById('productName');
    const currentLength = nameInput.value.length;
    
    // Find or create counter element
    let counter = nameInput.parentElement.querySelector('.char-counter');
    if (!counter) {
        counter = document.createElement('small');
        counter.className = 'char-counter';
        counter.style.cssText = 'display: block; margin-top: 5px; text-align: right;';
        nameInput.parentElement.appendChild(counter);
    }
    
    counter.textContent = `${currentLength} characters`;
    counter.style.color = 'var(--admin-text-secondary)';
}

// ==================== REPAIR FORM HANDLING ====================

// Handle repair form submission
document.getElementById('repairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Repair...';
    
    try {
        // Get form values
        const title = document.getElementById('repairTitle').value.trim();
        const category = document.getElementById('repairCategory').value;
        const description = document.getElementById('repairDescription').value.trim();
        const problem = document.getElementById('repairProblem').value.trim();
        const device = document.getElementById('repairDevice').value.trim();
        const repairType = document.getElementById('repairType').value.trim();
        const durationValue = document.getElementById('repairDuration').value.trim();
        const duration = durationValue + (durationValue === '1' ? ' Hour' : ' Hours');
        const difficulty = document.getElementById('repairDifficulty').value;
        const partsUsed = document.getElementById('repairParts').value.trim();
        const warrantyValue = document.getElementById('repairWarranty').value.trim();
        const warranty = warrantyValue + (warrantyValue === '1' ? ' Day' : ' Days');
        
        // Get image files
        const beforeImageFile = document.getElementById('beforeImage').files[0];
        const afterImageFile = document.getElementById('afterImage').files[0];
        
        if (!beforeImageFile || !afterImageFile) {
            showToast('Please select both before and after images', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Repair Case';
            return;
        }
        
        // Upload images to Cloudinary
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Before Image...';
        const beforeImageData = await uploadToCloudinary(beforeImageFile);
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading After Image...';
        const afterImageData = await uploadToCloudinary(afterImageFile);
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Repair Case...';
        
        // Get repair steps
        const steps = [];
        document.querySelectorAll('#repairSteps .step-item').forEach(stepItem => {
            const stepTitle = stepItem.querySelector('.step-title').value.trim();
            const stepDesc = stepItem.querySelector('.step-description').value.trim();
            if (stepTitle && stepDesc) {
                steps.push({ title: stepTitle, description: stepDesc });
            }
        });
        
        // Create repair object
        const repairData = {
            title,
            category,
            description,
            problem,
            device,
            repairType,
            duration,
            difficulty,
            partsUsed,
            warranty,
            beforeImage: beforeImageData,
            afterImage: afterImageData,
            steps,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        // Add to Firebase
        const success = await addRepair(repairData);
        
        if (success) {
            // Reset form
            document.getElementById('repairForm').reset();
            resetImagePreviews();
            resetRepairSteps();
            showToast('Repair case added successfully!', 'success');
        }
        
    } catch (error) {
        console.error('Error adding repair:', error);
        showToast('Error adding repair case: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Repair Case';
    }
});

// Upload image to Cloudinary and return URL
async function uploadToCloudinary(file) {
    try {
        console.log('📤 Uploading to Cloudinary...');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'products');
        
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Cloudinary upload failed');
        }
        
        const data = await response.json();
        console.log('✅ Cloudinary upload successful:', data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error('❌ Cloudinary upload error:', error);
        throw error;
    }
}

// Convert file to base64 (without compression - for backward compatibility)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Image preview handlers
document.getElementById('beforeImage').addEventListener('change', function(e) {
    previewImage(e.target, 'beforePreview');
});

document.getElementById('afterImage').addEventListener('change', function(e) {
    previewImage(e.target, 'afterPreview');
});

// Product image preview handler
document.getElementById('productImages').addEventListener('change', function(e) {
    handleMultipleImageSelection(e.target.files);
});

// Drag and drop functionality
const uploadZone = document.getElementById('uploadZone');

uploadZone.addEventListener('click', function(e) {
    // Only trigger if clicking directly on the upload zone, not on child elements
    if (e.target === uploadZone || uploadZone.contains(e.target) && !e.target.closest('.image-preview-item')) {
        document.getElementById('productImages').click();
    }
});

uploadZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    handleMultipleImageSelection(files);
});

// Handle multiple image selection
function handleMultipleImageSelection(files) {
    const filesArray = Array.from(files);
    
    // Validate file count
    if (selectedImages.length + filesArray.length > 5) {
        showToast('Maximum 5 images allowed', 'error');
        return;
    }
    
    if (filesArray.length === 0) return;
    
    // Validate file types and sizes
    for (const file of filesArray) {
        if (!file.type.startsWith('image/')) {
            showToast('Only image files are allowed', 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB
            showToast(`${file.name} is too large. Max 2MB per image`, 'error');
            return;
        }
    }
    
    // Add files to selected images
    filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const isFirstImage = selectedImages.length === 0;
            selectedImages.push({
                file: file,
                dataUrl: e.target.result,
                isPrimary: isFirstImage, // First image is primary
                isExisting: false // This is a new image
            });
            
            // If this is the first image, set it as primary
            if (isFirstImage) {
                primaryImageIndex = 0;
            }
            
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

// Render image previews
function renderImagePreviews() {
    const previewGrid = document.getElementById('imagesPreviewGrid');
    const countIndicator = document.getElementById('imageCountIndicator');
    const countText = document.getElementById('imageCountText');
    const uploadZone = document.getElementById('uploadZone');
    
    if (selectedImages.length === 0) {
        previewGrid.innerHTML = '';
        countIndicator.style.display = 'none';
        uploadZone.style.display = 'block';
        return;
    }
    
    // Hide upload zone if we have 5 images
    if (selectedImages.length >= 5) {
        uploadZone.style.display = 'none';
    } else {
        uploadZone.style.display = 'block';
    }
    
    // Update count indicator
    countIndicator.style.display = 'flex';
    countText.textContent = `${selectedImages.length}/5 images uploaded`;
    
    // Set indicator color based on count
    countIndicator.classList.remove('warning', 'error');
    if (selectedImages.length < 1) {
        countIndicator.classList.add('error');
    } else if (selectedImages.length < 3) {
        countIndicator.classList.add('warning');
    }
    
    // Render previews
    previewGrid.innerHTML = selectedImages.map((img, index) => `
        <div class="image-preview-item ${img.isPrimary ? 'primary' : ''}" data-index="${index}">
            <img src="${img.dataUrl}" alt="Preview ${index + 1}">
            ${img.isPrimary ? '<div class="primary-badge">Primary</div>' : ''}
            <div class="image-order-badge">${index + 1}</div>
            <div class="image-preview-overlay">
                ${!img.isPrimary ? `<button class="btn-set-primary" data-index="${index}">
                    <i class="fas fa-star"></i> Set Primary
                </button>` : ''}
                <button class="btn-delete-image" data-index="${index}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to buttons (better than inline onclick)
    attachImagePreviewListeners();
}

// Attach event listeners to image preview items
function attachImagePreviewListeners() {
    const previewItems = document.querySelectorAll('.image-preview-item');
    
    previewItems.forEach(item => {
        const index = parseInt(item.dataset.index);
        
        // Desktop: Show overlay on hover (CSS handles this)
        // Mobile: Show overlay on tap/click
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button
            if (e.target.closest('button')) {
                return;
            }
            
            // Close all other overlays first
            document.querySelectorAll('.image-preview-overlay').forEach(overlay => {
                overlay.classList.remove('mobile-visible');
            });
            
            // Toggle overlay visibility for mobile
            const overlay = item.querySelector('.image-preview-overlay');
            if (overlay) {
                overlay.classList.add('mobile-visible');
            }
            
            // Prevent event from bubbling to upload zone
            e.stopPropagation();
        });
        
        // Set primary button
        const setPrimaryBtn = item.querySelector('.btn-set-primary');
        if (setPrimaryBtn) {
            setPrimaryBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering parent click
                setPrimaryImage(index);
                // Close overlay after action
                item.querySelector('.image-preview-overlay')?.classList.remove('mobile-visible');
            });
        }
        
        // Delete button
        const deleteBtn = item.querySelector('.btn-delete-image');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering parent click
                deleteImage(index);
                // Overlay will be removed when re-rendering
            });
        }
    });
}

// Close mobile overlays when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.image-preview-item')) {
        document.querySelectorAll('.image-preview-overlay').forEach(overlay => {
            overlay.classList.remove('mobile-visible');
        });
    }
});

// Set primary image
function setPrimaryImage(index) {
    if (index < 0 || index >= selectedImages.length) {
        console.error('Invalid image index:', index);
        return;
    }
    
    selectedImages.forEach((img, i) => {
        img.isPrimary = i === index;
    });
    primaryImageIndex = index;
    renderImagePreviews();
    showToast('Primary image updated', 'success');
}

// Delete image
function deleteImage(index) {
    if (index < 0 || index >= selectedImages.length) {
        console.error('Invalid image index:', index);
        return;
    }
    
    // Don't allow deleting the last image
    if (selectedImages.length === 1) {
        showToast('At least one image is required', 'error');
        return;
    }
    
    const wasPrimary = selectedImages[index].isPrimary;
    selectedImages.splice(index, 1);
    
    // If we deleted the primary image, set first image as primary
    if (wasPrimary && selectedImages.length > 0) {
        selectedImages[0].isPrimary = true;
        primaryImageIndex = 0;
    } else if (index < primaryImageIndex) {
        // Adjust primary index if we deleted an image before it
        primaryImageIndex--;
    }
    
    renderImagePreviews();
    showToast('Image removed', 'success');
}

// Expose functions to window for backward compatibility (if needed elsewhere)
window.setPrimaryImage = setPrimaryImage;
window.deleteImage = deleteImage;

// Make preview areas clickable to trigger file input (for repairs only)
document.getElementById('beforePreview').addEventListener('click', function() {
    document.getElementById('beforeImage').click();
});

document.getElementById('afterPreview').addEventListener('click', function() {
    document.getElementById('afterImage').click();
});

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
    }
}

function resetImagePreviews() {
    document.getElementById('beforePreview').innerHTML = `
        <i class="fas fa-image"></i>
        <p>Click to upload before image</p>
    `;
    document.getElementById('afterPreview').innerHTML = `
        <i class="fas fa-image"></i>
        <p>Click to upload after image</p>
    `;
}

// Repair steps management
document.getElementById('addStepBtn').addEventListener('click', function() {
    const stepsContainer = document.getElementById('repairSteps');
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    stepItem.innerHTML = `
        <input type="text" class="step-title" placeholder="Step title" required>
        <textarea class="step-description" placeholder="Step description" rows="2" required></textarea>
        <button type="button" class="btn-remove-step"><i class="fas fa-times"></i></button>
    `;
    stepsContainer.appendChild(stepItem);
    
    // Add remove handler
    stepItem.querySelector('.btn-remove-step').addEventListener('click', function() {
        stepItem.remove();
    });
});

// Add remove handler to initial step
document.querySelector('#repairSteps .btn-remove-step').addEventListener('click', function() {
    const stepsContainer = document.getElementById('repairSteps');
    if (stepsContainer.querySelectorAll('.step-item').length > 1) {
        this.closest('.step-item').remove();
    } else {
        showToast('At least one step is required', 'error');
    }
});

function resetRepairSteps() {
    const stepsContainer = document.getElementById('repairSteps');
    stepsContainer.innerHTML = `
        <div class="step-item">
            <input type="text" class="step-title" placeholder="Step title" required>
            <textarea class="step-description" placeholder="Step description" rows="2" required></textarea>
            <button type="button" class="btn-remove-step"><i class="fas fa-times"></i></button>
        </div>
    `;
    // Re-add remove handler
    document.querySelector('#repairSteps .btn-remove-step').addEventListener('click', function() {
        const stepsContainer = document.getElementById('repairSteps');
        if (stepsContainer.querySelectorAll('.step-item').length > 1) {
            this.closest('.step-item').remove();
        } else {
            showToast('At least one step is required', 'error');
        }
    });
}

// Update category counts
function updateCategoryCounts() {
    const counts = {
        all: products.length,
        smartphones: products.filter(p => p.category === 'smartphones').length,
        laptops: products.filter(p => p.category === 'laptops').length,
        audio: products.filter(p => p.category === 'audio').length,
        accessories: products.filter(p => p.category === 'accessories').length
    };
    
    Object.keys(counts).forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) {
            countElement.textContent = counts[category];
        }
    });
}

// Filter products by category
function filterByCategory(category) {
    activeCategory = category;
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Clear search
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    document.getElementById('searchStats').style.display = 'none';
    document.getElementById('clearSearch').style.display = 'none';
    
    // Display filtered products
    displayProducts();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Category tab event listeners
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Sale checkbox event to show/hide sale price
    const onSaleCheckbox = document.getElementById('productOnSale');
    onSaleCheckbox.addEventListener('change', toggleSalePriceField);
    
    // Product name character counter
    const nameInput = document.getElementById('productName');
    nameInput.addEventListener('input', updateNameCounter);
    updateNameCounter();
    
    // Description character counter
    const descTextarea = document.getElementById('productDesc');
    descTextarea.addEventListener('input', updateDescriptionCounter);
    updateDescriptionCounter();
    
    // Search input event
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
    
    // Clear search button
    const clearSearchBtn = document.getElementById('clearSearch');
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchProducts('');
    });
    
    // Enter key to search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchProducts(searchInput.value);
        }
    });
    
    // Reset form buttons
    document.querySelectorAll('button[type="reset"]').forEach(resetBtn => {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetFormToAddMode();
        });
    });
});


// ==================== MULTI-SELECT BADGE DROPDOWN ====================



// Badge selection limit (max 2)
function initBadgeLimit() {
    const badgeCheckboxes = document.querySelectorAll('.badge-checkbox');
    
    badgeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('.badge-checkbox:checked').length;
            
            if (checkedCount >= 2) {
                // Disable unchecked boxes
                badgeCheckboxes.forEach(cb => {
                    if (!cb.checked) {
                        cb.disabled = true;
                        cb.parentElement.style.opacity = '0.5';
                        cb.parentElement.style.cursor = 'not-allowed';
                    }
                });
            } else {
                // Enable all boxes
                badgeCheckboxes.forEach(cb => {
                    cb.disabled = false;
                    cb.parentElement.style.opacity = '1';
                    cb.parentElement.style.cursor = 'pointer';
                });
            }
            
            updateBadgeCount();
        });
    });
}

function updateBadgeCount() {
    const checkedCount = document.querySelectorAll('.badge-checkbox:checked').length;
    const badgeCount = document.getElementById('badgeCount');
    
    if (badgeCount) {
        badgeCount.textContent = `${checkedCount}/2 badges selected`;
        
        if (checkedCount >= 2) {
            badgeCount.classList.add('max-reached');
        } else {
            badgeCount.classList.remove('max-reached');
        }
    }
}

// Initialize badge limit on page load
document.addEventListener('DOMContentLoaded', () => {
    initBadgeLimit();
});


// Reset form to add mode
function resetFormToAddMode() {
    window.isEditMode = false;
    window.editingProductId = null;
    
    const submitBtn = document.querySelector('#productForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Product';
    
    document.getElementById('productId').disabled = false;
    document.getElementById('productForm').reset();
    document.getElementById('productInStock').checked = true;
    
    // Reset multi-image upload
    selectedImages = [];
    primaryImageIndex = 0;
    renderImagePreviews();
    document.getElementById('uploadZone').style.display = 'block';
    
    // Make image field required again for new products
    const imageInput = document.getElementById('productImages');
    imageInput.setAttribute('required', 'required');
    const imageRequiredIndicator = document.getElementById('imageRequiredIndicator');
    if (imageRequiredIndicator) {
        imageRequiredIndicator.style.display = 'inline';
    }
    
    // Reset badge checkboxes
    document.querySelectorAll('.badge-checkbox').forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
        cb.parentElement.style.opacity = '1';
        cb.parentElement.style.cursor = 'pointer';
    });
    updateBadgeCount();
}


// Keep Firebase connection alive
function keepFirebaseAlive() {
    // Ping Firebase every 5 minutes to keep connection alive
    setInterval(async () => {
        try {
            const productsCollection = collection(db, 'products');
            await getDocs(productsCollection);
            console.log('Firebase connection kept alive');
        } catch (error) {
            console.error('Firebase keep-alive failed:', error);
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// Start keep-alive on page load
document.addEventListener('DOMContentLoaded', () => {
    keepFirebaseAlive();
});
