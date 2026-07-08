 // Admin Product Form - Dynamic subcategory and brand management
// Handles showing/hiding fields based on category and platform selection

(function() {
    'use strict';

    // Create custom dropdown from native select
    function createCustomDropdown(selectElement) {
        if (!selectElement || selectElement.classList.contains('custom-dropdown-initialized')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-dropdown';
        
        // Create trigger button
        const trigger = document.createElement('div');
        trigger.className = 'custom-dropdown-trigger';
        trigger.innerHTML = `
            <span class="placeholder">Select an option</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        // Create dropdown menu
        const menu = document.createElement('div');
        menu.className = 'custom-dropdown-menu';
        
        // Populate options
        function updateOptions() {
            menu.innerHTML = '';
            const options = selectElement.querySelectorAll('option');
            
            options.forEach((option, index) => {
                if (index === 0 && !option.value) return; // Skip placeholder
                
                const optionDiv = document.createElement('div');
                optionDiv.className = 'custom-dropdown-option';
                if (option.value === selectElement.value) {
                    optionDiv.classList.add('selected');
                }
                
                const radioId = `${selectElement.id}-option-${index}`;
                optionDiv.innerHTML = `
                    <input type="radio" 
                           name="${selectElement.id}-radio" 
                           id="${radioId}" 
                           value="${option.value}"
                           ${option.value === selectElement.value ? 'checked' : ''}>
                    <label for="${radioId}">${option.textContent}</label>
                `;
                
                optionDiv.addEventListener('click', () => {
                    selectElement.value = option.value;
                    selectElement.dispatchEvent(new Event('change'));
                    updateTrigger();
                    closeDropdown();
                });
                
                menu.appendChild(optionDiv);
            });
        }
        
        // Update trigger text
        function updateTrigger() {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            if (selectedOption && selectedOption.value) {
                trigger.innerHTML = `
                    <span class="selected-value">${selectedOption.textContent}</span>
                    <i class="fas fa-chevron-down"></i>
                `;
            } else {
                trigger.innerHTML = `
                    <span class="placeholder">Select an option</span>
                    <i class="fas fa-chevron-down"></i>
                `;
            }
            updateOptions();
        }
        
        // Toggle dropdown
        function toggleDropdown() {
            const isActive = menu.classList.contains('active');
            closeAllDropdowns();
            if (!isActive) {
                menu.classList.add('active');
                trigger.classList.add('active');
            }
        }
        
        // Close dropdown
        function closeDropdown() {
            menu.classList.remove('active');
            trigger.classList.remove('active');
        }
        
        // Close all dropdowns
        function closeAllDropdowns() {
            document.querySelectorAll('.custom-dropdown-menu.active').forEach(m => {
                m.classList.remove('active');
            });
            document.querySelectorAll('.custom-dropdown-trigger.active').forEach(t => {
                t.classList.remove('active');
            });
        }
        
        // Event listeners
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
        
        // Close on outside click
        document.addEventListener('click', () => {
            closeDropdown();
        });
        
        // Listen for programmatic changes
        selectElement.addEventListener('change', updateTrigger);
        
        // Build structure
        selectElement.classList.add('hidden-native');
        selectElement.parentNode.insertBefore(wrapper, selectElement);
        wrapper.appendChild(trigger);
        wrapper.appendChild(menu);
        wrapper.appendChild(selectElement);
        
        // Mark as initialized
        selectElement.classList.add('custom-dropdown-initialized');
        
        // Initial update
        updateTrigger();
        
        // Expose update function
        selectElement.customDropdownUpdate = updateOptions;
    }

    // Wait for DOM and SubcategoryConfig to be ready
    function initializeProductForm() {
        if (typeof SubcategoryConfig === 'undefined') {
            console.warn('SubcategoryConfig not loaded yet, retrying...');
            setTimeout(initializeProductForm, 100);
            return;
        }

        const categorySelect = document.getElementById('productCategory');
        const subcategorySelect = document.getElementById('productSubcategory');
        const platformSelect = document.getElementById('productPlatform');
        const brandSelect = document.getElementById('productBrand');
        const brandGroup = document.getElementById('brandGroup');
        const subcategoryHelp = document.getElementById('subcategoryHelp');

        if (!categorySelect || !subcategorySelect) {
            console.warn('Form elements not found, retrying...');
            setTimeout(initializeProductForm, 100);
            return;
        }

        console.log('Initializing product form with custom dropdowns');

        // Convert selects to custom dropdowns
        createCustomDropdown(categorySelect);
        createCustomDropdown(subcategorySelect);
        createCustomDropdown(platformSelect);
        createCustomDropdown(brandSelect);
        
        // Also convert repair form dropdowns if they exist
        const repairCategory = document.getElementById('repairCategory');
        const repairDifficulty = document.getElementById('repairDifficulty');
        if (repairCategory) createCustomDropdown(repairCategory);
        if (repairDifficulty) createCustomDropdown(repairDifficulty);

        // Handle category change
        categorySelect.addEventListener('change', function() {
            const category = this.value;
            updateSubcategoryOptions(category);
            
            // Add validation class
            if (category) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.remove('valid');
                this.classList.add('invalid');
            }
        });

        // Handle subcategory change (for smartphones and laptops)
        subcategorySelect.addEventListener('change', function() {
            const subcategory = this.value;
            const category = categorySelect.value;
            
            // Add validation class
            if (subcategory) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.remove('valid');
                this.classList.add('invalid');
            }
            
            if (category === 'smartphones') {
                // Show brand field for Android
                if (subcategory === 'android') {
                    showBrandField('android');
                } else {
                    hideBrandField();
                }
            } else if (category === 'laptops') {
                // Show brand field for all laptop subcategories
                showBrandField('laptop');
            } else {
                hideBrandField();
            }
        });

        // Update subcategory options based on category
        function updateSubcategoryOptions(category) {
            subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
            
            if (!category) {
                subcategorySelect.disabled = true;
                subcategoryHelp.textContent = 'Select a category first';
                if (subcategorySelect.customDropdownUpdate) {
                    subcategorySelect.customDropdownUpdate();
                }
                return;
            }

            const subcategories = SubcategoryConfig.getSubcategories(category);
            
            // Filter out 'all' option
            const validSubcategories = subcategories.filter(sub => sub !== 'all');
            
            if (validSubcategories.length === 0) {
                subcategorySelect.disabled = true;
                subcategoryHelp.textContent = 'No subcategories available';
                if (subcategorySelect.customDropdownUpdate) {
                    subcategorySelect.customDropdownUpdate();
                }
                return;
            }

            subcategorySelect.disabled = false;
            subcategoryHelp.textContent = `Select a subcategory for ${category}`;

            validSubcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = SubcategoryConfig.getDisplayName(sub);
                subcategorySelect.appendChild(option);
            });
            
            // Update custom dropdown
            if (subcategorySelect.customDropdownUpdate) {
                subcategorySelect.customDropdownUpdate();
            }
        }

        // Show brand field
        function showBrandField(type = 'android') {
            brandGroup.style.display = 'block';
            // Trigger animation
            setTimeout(() => {
                brandGroup.classList.add('show');
            }, 10);
            brandSelect.required = true;
            populateBrandOptions(type);
        }

        // Hide brand field
        function hideBrandField() {
            brandGroup.classList.remove('show');
            setTimeout(() => {
                brandGroup.style.display = 'none';
            }, 300);
            brandSelect.required = false;
            brandSelect.value = '';
        }

        // Populate brand options
        function populateBrandOptions(type = 'android') {
            brandSelect.innerHTML = '<option value="">Select Brand</option>';
            
            let brands;
            if (type === 'laptop') {
                brands = SubcategoryConfig.getLaptopBrands();
            } else {
                brands = SubcategoryConfig.getAndroidBrands();
            }
            
            // Filter out 'all' option
            const validBrands = brands.filter(brand => brand !== 'all');
            
            validBrands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = SubcategoryConfig.getDisplayName(brand);
                brandSelect.appendChild(option);
            });
            
            // Update custom dropdown
            if (brandSelect.customDropdownUpdate) {
                brandSelect.customDropdownUpdate();
            }
            
            // Add change listener for validation
            brandSelect.addEventListener('change', function() {
                if (this.value) {
                    this.classList.add('valid');
                    this.classList.remove('invalid');
                } else {
                    this.classList.remove('valid');
                    this.classList.add('invalid');
                }
            });
        }

        // Form validation
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', function(e) {
                const category = categorySelect.value;
                const subcategory = subcategorySelect.value;
                const platform = platformSelect.value;
                const brand = brandSelect.value;

                // Validate subcategory
                if (!subcategory) {
                    e.preventDefault();
                    showToast('Please select a subcategory', 'error');
                    subcategorySelect.focus();
                    return false;
                }

                // Validate brand for Android smartphones and Laptops
                if (category === 'smartphones' && platform === 'android' && !brand) {
                    e.preventDefault();
                    showToast('Please select a brand for Android smartphones', 'error');
                    brandSelect.focus();
                    return false;
                }
                
                if (category === 'laptops' && !brand) {
                    e.preventDefault();
                    showToast('Please select a brand for laptops', 'error');
                    brandSelect.focus();
                    return false;
                }
            });
        }

        // Pre-populate for editing (if editing mode)
        function prePopulateForm(productData) {
            if (!productData) return;

            // Set category first
            if (productData.category) {
                categorySelect.value = productData.category;
                updateSubcategoryOptions(productData.category);
            }

            // Set subcategory
            if (productData.subcategory) {
                setTimeout(() => {
                    subcategorySelect.value = productData.subcategory;
                }, 100);
            }

            // Set platform
            if (productData.platform) {
                platformSelect.value = productData.platform;
                
                // Show brand field if Android smartphone
                if (productData.platform === 'android') {
                    showBrandField('android');
                    
                    // Set brand
                    if (productData.brand) {
                        setTimeout(() => {
                            brandSelect.value = productData.brand;
                        }, 150);
                    }
                }
            }
            
            // Show brand field for laptops
            if (productData.category === 'laptops') {
                showBrandField('laptop');
                
                // Set brand
                if (productData.brand) {
                    setTimeout(() => {
                        brandSelect.value = productData.brand;
                    }, 150);
                }
            }
        }

        // Expose for use in admin.js
        window.adminProductForm = {
            prePopulateForm: prePopulateForm,
            createCustomDropdown: createCustomDropdown,
            getFormData: function() {
                return {
                    subcategory: subcategorySelect.value,
                    brand: brandSelect.value || null
                };
            }
        };

        console.log('Product form initialized successfully');
    }

    // Helper function to show toast (if not already defined)
    function showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
            alert(message);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProductForm);
    } else {
        initializeProductForm();
    }

})();
