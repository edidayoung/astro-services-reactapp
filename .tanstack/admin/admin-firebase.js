// Admin Firebase Functions for Reviews and Repairs
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from '/firebase-config.js';

// ==================== REVIEWS MANAGEMENT ====================

// Load all reviews
export async function loadReviews() {
    try {
        console.log('Loading reviews from Firebase...');
        const reviewsCollection = collection(db, 'reviews');
        const snapshot = await getDocs(reviewsCollection);
        
        const reviews = [];
        snapshot.forEach((docSnap) => {
            reviews.push({ id: docSnap.id, ...docSnap.data() });
        });
        
        console.log(`Loaded ${reviews.length} reviews`);
        displayReviews(reviews);
        updateReviewStats(reviews);
        
    } catch (error) {
        console.error('Error loading reviews:', error);
        showAdminToast('Failed to load reviews', 'error');
    }
}

// Display reviews in admin panel
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="loading">No reviews found</p>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item" data-id="${review.id}" data-status="${review.status}">
            <div class="review-header">
                <div>
                    <div class="review-stars">
                        ${Array(5).fill(0).map((_, i) => 
                            `<i class="fas fa-star" style="color: ${i < review.rating ? '#FFD700' : '#ddd'}"></i>`
                        ).join('')}
                    </div>
                    <span class="review-status ${review.status}">${review.status}</span>
                </div>
                <small>${new Date(review.createdAt).toLocaleString()}</small>
            </div>
            <p class="review-text">${review.text}</p>
            <div class="review-author">
                <div class="review-avatar">${review.name.charAt(0).toUpperCase()}</div>
                <div class="review-info">
                    <h4>${review.name}</h4>
                    <span>${review.location}</span>
                </div>
            </div>
            <div class="review-actions">
                ${review.status === 'pending' ? `
                    <button class="btn btn-primary" onclick="approveReview('${review.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-outline" onclick="rejectReview('${review.id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : review.status === 'approved' ? `
                    <button class="btn btn-outline" onclick="rejectReview('${review.id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="btn btn-outline" onclick="deleteReview('${review.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="approveReview('${review.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-outline" onclick="deleteReview('${review.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

// Update review statistics
function updateReviewStats(reviews) {
    const pending = reviews.filter(r => r.status === 'pending').length;
    const approved = reviews.filter(r => r.status === 'approved').length;
    const rejected = reviews.filter(r => r.status === 'rejected').length;
    
    const pendingEl = document.getElementById('pendingCount');
    const approvedEl = document.getElementById('approvedCount');
    const rejectedEl = document.getElementById('rejectedCount');
    
    if (pendingEl) pendingEl.textContent = pending;
    if (approvedEl) approvedEl.textContent = approved;
    if (rejectedEl) rejectedEl.textContent = rejected;
}

// Approve review
window.approveReview = async function(reviewId) {
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await updateDoc(reviewRef, {
            status: 'approved',
            approvedAt: Date.now(),
            updatedAt: Date.now()
        });
        
        showAdminToast('Review approved successfully', 'success');
        loadReviews();
    } catch (error) {
        console.error('Error approving review:', error);
        showAdminToast('Failed to approve review', 'error');
    }
};

// Reject review
window.rejectReview = async function(reviewId) {
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await updateDoc(reviewRef, {
            status: 'rejected',
            updatedAt: Date.now()
        });
        
        showAdminToast('Review rejected', 'success');
        loadReviews();
    } catch (error) {
        console.error('Error rejecting review:', error);
        showAdminToast('Failed to reject review', 'error');
    }
};

// Delete review
window.deleteReview = async function(reviewId) {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await deleteDoc(reviewRef);
        
        showAdminToast('Review deleted successfully', 'success');
        loadReviews();
    } catch (error) {
        console.error('Error deleting review:', error);
        showAdminToast('Failed to delete review', 'error');
    }
};

// Filter reviews by status
window.filterReviews = function(status) {
    const reviewItems = document.querySelectorAll('.review-item');
    
    reviewItems.forEach(item => {
        if (status === 'all' || item.dataset.status === status) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${status}"]`)?.classList.add('active');
};

// ==================== REPAIRS MANAGEMENT ====================

// Load all repairs
export async function loadRepairs() {
    try {
        console.log('Loading repairs from Firebase...');
        const repairsCollection = collection(db, 'repairs');
        const snapshot = await getDocs(repairsCollection);
        
        const repairs = [];
        snapshot.forEach((docSnap) => {
            repairs.push({ id: docSnap.id, ...docSnap.data() });
        });
        
        console.log(`Loaded ${repairs.length} repairs`);
        displayRepairs(repairs);
        
    } catch (error) {
        console.error('Error loading repairs:', error);
        showAdminToast('Failed to load repairs', 'error');
    }
}

// Display repairs in admin panel
function displayRepairs(repairs) {
    const repairsList = document.getElementById('repairsList');
    if (!repairsList) return;
    
    if (repairs.length === 0) {
        repairsList.innerHTML = '<p class="loading">No repair cases found</p>';
        return;
    }
    
    repairsList.innerHTML = repairs.map(repair => {
        // Handle Cloudinary URLs, base64, and local file paths
        let beforeImageSrc, afterImageSrc;
        
        // Before image
        if (repair.beforeImage.startsWith('http://') || repair.beforeImage.startsWith('https://')) {
            beforeImageSrc = repair.beforeImage;
        } else if (repair.beforeImage.startsWith('data:')) {
            beforeImageSrc = repair.beforeImage;
        } else {
            beforeImageSrc = `../${repair.beforeImage}`;
        }
        
        // After image
        if (repair.afterImage.startsWith('http://') || repair.afterImage.startsWith('https://')) {
            afterImageSrc = repair.afterImage;
        } else if (repair.afterImage.startsWith('data:')) {
            afterImageSrc = repair.afterImage;
        } else {
            afterImageSrc = `../${repair.afterImage}`;
        }
        
        return `
            <div class="repair-item" data-id="${repair.id}">
                <div class="repair-images">
                    <div class="repair-image-wrapper">
                        <img src="${beforeImageSrc}" alt="Before" onerror="this.src='../images/placeholder-repair.jpg'">
                        <div class="repair-image-label before-label">BEFORE</div>
                    </div>
                    <div class="repair-image-wrapper">
                        <img src="${afterImageSrc}" alt="After" onerror="this.src='../images/placeholder-repair.jpg'">
                        <div class="repair-image-label after-label">AFTER</div>
                    </div>
                </div>
                <div class="repair-content">
                    <span class="repair-category-badge">${repair.category}</span>
                    <h3 class="repair-title">${repair.title}</h3>
                    <p>${repair.description}</p>
                    <div class="repair-meta">
                        <span><i class="fas fa-clock"></i> ${repair.duration}</span>
                        <span><i class="fas fa-signal"></i> ${repair.difficulty}</span>
                    </div>
                    <div class="repair-actions">
                        <button class="btn btn-outline" onclick="editRepair('${repair.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-outline" onclick="deleteRepair('${repair.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Add repair (called from form submission)
export async function addRepair(repairData) {
    try {
        console.log('Adding repair to Firebase...', repairData.title);
        const repairsCollection = collection(db, 'repairs');
        const docRef = await addDoc(repairsCollection, {
            ...repairData,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        
        console.log('Repair added successfully with ID:', docRef.id);
        showAdminToast('Repair case added successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error adding repair:', error);
        showAdminToast('Failed to add repair case: ' + error.message, 'error');
        return false;
    }
}

// Delete repair
window.deleteRepair = async function(repairId) {
    if (!confirm('Are you sure you want to delete this repair case?')) return;
    
    try {
        const repairRef = doc(db, 'repairs', repairId);
        await deleteDoc(repairRef);
        
        showAdminToast('Repair case deleted', 'success');
        loadRepairs();
    } catch (error) {
        console.error('Error deleting repair:', error);
        showAdminToast('Failed to delete repair case', 'error');
    }
};

// Edit repair
window.editRepair = async function(repairId) {
    try {
        console.log('Loading repair for edit:', repairId);
        const repairsCollection = collection(db, 'repairs');
        const snapshot = await getDocs(repairsCollection);
        
        let repairToEdit = null;
        snapshot.forEach((docSnap) => {
            if (docSnap.id === repairId) {
                repairToEdit = { id: docSnap.id, ...docSnap.data() };
            }
        });
        
        if (!repairToEdit) {
            showAdminToast('Repair not found', 'error');
            return;
        }
        
        openEditRepairModal(repairToEdit);
        
    } catch (error) {
        console.error('Error loading repair for edit:', error);
        showAdminToast('Failed to load repair', 'error');
    }
};

// Open edit repair modal
function openEditRepairModal(repair) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('editRepairModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editRepairModal';
        modal.className = 'edit-modal';
        document.body.appendChild(modal);
    }
    
    const beforeImageSrc = repair.beforeImage.startsWith('data:') ? repair.beforeImage : `../${repair.beforeImage}`;
    const afterImageSrc = repair.afterImage.startsWith('data:') ? repair.afterImage : `../${repair.afterImage}`;
    
    modal.innerHTML = `
        <div class="edit-modal-overlay" onclick="closeEditRepairModal()"></div>
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h2><i class="fas fa-edit"></i> Edit Repair Case</h2>
                <button class="modal-close-btn" onclick="closeEditRepairModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="edit-modal-body">
                <form id="editRepairForm">
                    <input type="hidden" id="editRepairId" value="${repair.id}">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editRepairTitle">Repair Title *</label>
                            <input type="text" id="editRepairTitle" value="${repair.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="editRepairCategory">Category *</label>
                            <select id="editRepairCategory" required>
                                <option value="screen" ${repair.category === 'screen' ? 'selected' : ''}>Screen Repairs</option>
                                <option value="battery" ${repair.category === 'battery' ? 'selected' : ''}>Battery Replacement</option>
                                <option value="water" ${repair.category === 'water' ? 'selected' : ''}>Water Damage</option>
                                <option value="board" ${repair.category === 'board' ? 'selected' : ''}>Logic Board Repair</option>
                                <option value="laptop" ${repair.category === 'laptop' ? 'selected' : ''}>Laptop Repairs</option>
                                <option value="custom" ${repair.category === 'custom' ? 'selected' : ''}>Custom Repairs</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editRepairDescription">Short Description *</label>
                        <textarea id="editRepairDescription" required maxlength="200" rows="2">${repair.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="editRepairProblem">Problem Analysis *</label>
                        <textarea id="editRepairProblem" required rows="4">${repair.problem}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editRepairDevice">Device *</label>
                            <input type="text" id="editRepairDevice" value="${repair.device}" required>
                        </div>
                        <div class="form-group">
                            <label for="editRepairType">Repair Type *</label>
                            <input type="text" id="editRepairType" value="${repair.repairType}" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editRepairDuration">Duration *</label>
                            <input type="text" id="editRepairDuration" value="${repair.duration}" required>
                        </div>
                        <div class="form-group">
                            <label for="editRepairDifficulty">Difficulty *</label>
                            <select id="editRepairDifficulty" required>
                                <option value="Easy" ${repair.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                                <option value="Medium" ${repair.difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                                <option value="High" ${repair.difficulty === 'High' ? 'selected' : ''}>High</option>
                                <option value="Expert" ${repair.difficulty === 'Expert' ? 'selected' : ''}>Expert</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editRepairParts">Parts Used *</label>
                            <input type="text" id="editRepairParts" value="${repair.partsUsed}" required>
                        </div>
                        <div class="form-group">
                            <label for="editRepairWarranty">Warranty *</label>
                            <input type="text" id="editRepairWarranty" value="${repair.warranty}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Current Images</label>
                        <div class="current-images-preview">
                            <div class="image-preview-item">
                                <img src="${beforeImageSrc}" alt="Before">
                                <span class="image-label">Before</span>
                            </div>
                            <div class="image-preview-item">
                                <img src="${afterImageSrc}" alt="After">
                                <span class="image-label">After</span>
                            </div>
                        </div>
                        <small style="color: var(--text-secondary); display: block; margin-top: 10px;">
                            <i class="fas fa-info-circle"></i> Image editing coming soon. To change images, delete and create a new repair case.
                        </small>
                    </div>
                    
                    <div class="edit-modal-actions">
                        <button type="button" class="btn btn-outline" onclick="closeEditRepairModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add form submit handler
    document.getElementById('editRepairForm').addEventListener('submit', handleEditRepairSubmit);
}

// Close edit repair modal
window.closeEditRepairModal = function() {
    const modal = document.getElementById('editRepairModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    }
};

// Handle edit repair form submission
async function handleEditRepairSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        const repairId = document.getElementById('editRepairId').value;
        
        const updatedData = {
            title: document.getElementById('editRepairTitle').value.trim(),
            category: document.getElementById('editRepairCategory').value,
            description: document.getElementById('editRepairDescription').value.trim(),
            problem: document.getElementById('editRepairProblem').value.trim(),
            device: document.getElementById('editRepairDevice').value.trim(),
            repairType: document.getElementById('editRepairType').value.trim(),
            duration: document.getElementById('editRepairDuration').value.trim(),
            difficulty: document.getElementById('editRepairDifficulty').value,
            partsUsed: document.getElementById('editRepairParts').value.trim(),
            warranty: document.getElementById('editRepairWarranty').value.trim(),
            updatedAt: Date.now()
        };
        
        const repairRef = doc(db, 'repairs', repairId);
        await updateDoc(repairRef, updatedData);
        
        showAdminToast('Repair updated successfully', 'success');
        closeEditRepairModal();
        loadRepairs();
        
    } catch (error) {
        console.error('Error updating repair:', error);
        showAdminToast('Failed to update repair: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Show admin toast notification
function showAdminToast(message, type = 'success') {
    const toast = document.getElementById('adminToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== INITIALIZATION ====================

// Initialize admin panel
export function initializeAdmin() {
    console.log('Initializing admin panel...');
    
    // Load reviews if on review approval section
    const reviewSection = document.getElementById('review-approval');
    if (reviewSection) {
        loadReviews();
    }
    
    // Load repairs if on manage repairs section
    const repairsSection = document.getElementById('manage-repairs');
    if (repairsSection) {
        loadRepairs();
    }
}

// Export functions for global access
window.loadReviews = loadReviews;
window.loadRepairs = loadRepairs;
