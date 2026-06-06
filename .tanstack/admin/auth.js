// Admin Authentication System
// Simple password protection for admin panel

// Configuration
const CONFIG = {
    // SHA-256 hash of "Astro@Admin@2026!"
    PASSWORD_HASH: 'dd89e62922e263dff3729d2a92651885cdf6cd9addd1a6907440df964e3fd54e',
    SESSION_DURATION: 30 * 60 * 1000, // 30 minutes
    WARNING_TIME: 2 * 60 * 1000, // 2 minutes before logout
    MAX_ATTEMPTS: 3,
    LOCKOUT_DURATION: 45 * 60 * 1000, // 45 minutes
    SESSION_KEY: 'astro_admin_session',
    LOCKOUT_KEY: 'astro_admin_lockout',
    ATTEMPTS_KEY: 'astro_admin_attempts'
};

// SHA-256 Hash Function
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Check if user is locked out
function isLockedOut() {
    const lockoutData = localStorage.getItem(CONFIG.LOCKOUT_KEY);
    if (!lockoutData) return false;
    
    const lockoutTime = parseInt(lockoutData);
    const now = Date.now();
    
    if (now < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - now) / 60000);
        return remainingMinutes;
    }
    
    // Lockout expired, clear it
    localStorage.removeItem(CONFIG.LOCKOUT_KEY);
    localStorage.removeItem(CONFIG.ATTEMPTS_KEY);
    return false;
}

// Get failed attempts count
function getFailedAttempts() {
    const attempts = localStorage.getItem(CONFIG.ATTEMPTS_KEY);
    return attempts ? parseInt(attempts) : 0;
}

// Increment failed attempts
function incrementFailedAttempts() {
    const attempts = getFailedAttempts() + 1;
    localStorage.setItem(CONFIG.ATTEMPTS_KEY, attempts.toString());
    
    if (attempts >= CONFIG.MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + CONFIG.LOCKOUT_DURATION;
        localStorage.setItem(CONFIG.LOCKOUT_KEY, lockoutUntil.toString());
    }
    
    return attempts;
}

// Reset failed attempts
function resetFailedAttempts() {
    localStorage.removeItem(CONFIG.ATTEMPTS_KEY);
    localStorage.removeItem(CONFIG.LOCKOUT_KEY);
}

// Create session
function createSession() {
    const session = {
        authenticated: true,
        timestamp: Date.now(),
        expiresAt: Date.now() + CONFIG.SESSION_DURATION
    };
    sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
    resetFailedAttempts();
}

// Check if session is valid
function isSessionValid() {
    const sessionData = sessionStorage.getItem(CONFIG.SESSION_KEY);
    if (!sessionData) return false;
    
    try {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        
        if (now > session.expiresAt) {
            clearSession();
            return false;
        }
        
        return session.authenticated === true;
    } catch (e) {
        clearSession();
        return false;
    }
}

// Extend session (on user activity)
function extendSession() {
    if (!isSessionValid()) return;
    
    const sessionData = sessionStorage.getItem(CONFIG.SESSION_KEY);
    const session = JSON.parse(sessionData);
    session.expiresAt = Date.now() + CONFIG.SESSION_DURATION;
    sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
}

// Clear session
function clearSession() {
    sessionStorage.removeItem(CONFIG.SESSION_KEY);
}

// Logout
function logout() {
    clearSession();
    window.location.href = '/admin/login.html';
}

// Check session expiry and show warning
function checkSessionExpiry() {
    if (!isSessionValid()) {
        logout();
        return;
    }
    
    const sessionData = sessionStorage.getItem(CONFIG.SESSION_KEY);
    const session = JSON.parse(sessionData);
    const timeRemaining = session.expiresAt - Date.now();
    
    // Show warning at 2 minutes before expiry
    if (timeRemaining <= CONFIG.WARNING_TIME && timeRemaining > 0) {
        const existingWarning = document.getElementById('sessionWarning');
        if (!existingWarning) {
            showSessionWarning(Math.ceil(timeRemaining / 60000));
        }
    }
}

// Show session expiry warning
function showSessionWarning(minutesRemaining) {
    // Remove existing warning if any
    const existingWarning = document.getElementById('sessionWarning');
    if (existingWarning) return; // Don't show multiple warnings
    
    const warning = document.createElement('div');
    warning.id = 'sessionWarning';
    warning.className = 'session-warning';
    
    warning.innerHTML = `
        <div class="session-warning-content">
            <i class="fas fa-clock"></i>
            <span>Session expiring in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}</span>
            <button onclick="extendSessionAndDismiss()" class="btn-extend">Stay Logged In</button>
        </div>
    `;
    document.body.appendChild(warning);
    
    setTimeout(() => warning.classList.add('show'), 100);
}

// Extend session and dismiss warning
window.extendSessionAndDismiss = function() {
    extendSession();
    const warning = document.getElementById('sessionWarning');
    if (warning) {
        warning.classList.remove('show');
        setTimeout(() => warning.remove(), 300);
    }
};

// Verify password
async function verifyPassword(inputPassword) {
    const inputHash = await hashPassword(inputPassword);
    // Actual hash of "Astro@Admin@2026!"
    const correctHash = 'dd89e62922e263dff3729d2a92651885cdf6cd9addd1a6907440df964e3fd54e';
    return inputHash === correctHash;
}

// Handle login
window.handleAdminLogin = async function(password) {
    // Check lockout
    const lockedMinutes = isLockedOut();
    if (lockedMinutes) {
        return {
            success: false,
            message: `Too many failed attempts. Please try again in ${lockedMinutes} minute${lockedMinutes !== 1 ? 's' : ''}.`,
            locked: true
        };
    }
    
    // Verify password
    const isValid = await verifyPassword(password);
    
    if (isValid) {
        createSession();
        return { success: true };
    } else {
        const attempts = incrementFailedAttempts();
        const remaining = CONFIG.MAX_ATTEMPTS - attempts;
        
        if (remaining > 0) {
            return {
                success: false,
                message: `Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
                attemptsRemaining: remaining
            };
        } else {
            return {
                success: false,
                message: `Too many failed attempts. Locked out for 45 minutes.`,
                locked: true
            };
        }
    }
};

// Initialize authentication check
function initAuth() {
    const currentPage = window.location.pathname;
    
    // If on login page and already authenticated, redirect to admin
    if (currentPage.includes('login.html')) {
        if (isSessionValid()) {
            window.location.href = '/admin/index.html';
        }
        return;
    }
    
    // If on admin page and not authenticated, redirect to login
    if (currentPage.includes('admin/') && !currentPage.includes('login.html')) {
        if (!isSessionValid()) {
            window.location.href = '/admin/login.html';
            return;
        }
        
        // Add logout button to header
        addLogoutButton();
        
        // Start session monitoring
        startSessionMonitoring();
    }
}

// Add logout button to admin header
function addLogoutButton() {
    console.log('addLogoutButton called');
    const header = document.querySelector('.admin-header');
    console.log('Header found:', header);
    
    if (!header) {
        console.error('Admin header not found!');
        return;
    }
    
    // Check if actions wrapper exists, if not create it
    let actionsWrapper = header.querySelector('.admin-header-actions');
    console.log('Actions wrapper found:', actionsWrapper);
    
    if (!actionsWrapper) {
        actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'admin-header-actions';
        
        // Move existing back button into wrapper
        const backBtn = header.querySelector('.btn-back');
        console.log('Back button found:', backBtn);
        if (backBtn) {
            actionsWrapper.appendChild(backBtn);
        }
        
        header.appendChild(actionsWrapper);
        console.log('Actions wrapper created and added');
    }
    
    // Add session timer display
    const sessionTimer = document.createElement('div');
    sessionTimer.id = 'sessionTimer';
    sessionTimer.className = 'session-timer';
    sessionTimer.innerHTML = '<i class="fas fa-clock"></i> <span id="sessionTimeRemaining">--:--</span>';
    actionsWrapper.appendChild(sessionTimer);
    console.log('Session timer added');
    
    // Create and add logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-logout';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> <span>Logout</span>';
    logoutBtn.onclick = logout;
    
    actionsWrapper.appendChild(logoutBtn);
    console.log('Logout button added');
    
    // Start updating the timer
    updateSessionTimer();
    console.log('Session timer update started');
}

// Start session monitoring
function startSessionMonitoring() {
    // Check session every 30 seconds
    setInterval(checkSessionExpiry, 30000);
    
    // Update session timer every second
    setInterval(updateSessionTimer, 1000);
    
    // Extend session on user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    let lastActivity = Date.now();
    
    activityEvents.forEach(event => {
        document.addEventListener(event, () => {
            const now = Date.now();
            // Only extend if more than 1 minute since last activity
            if (now - lastActivity > 60000) {
                extendSession();
                lastActivity = now;
            }
        });
    });
}

// Update session timer display
function updateSessionTimer() {
    const timerElement = document.getElementById('sessionTimeRemaining');
    if (!timerElement) return;
    
    if (!isSessionValid()) {
        timerElement.textContent = 'Expired';
        timerElement.parentElement.classList.add('expired');
        return;
    }
    
    const sessionData = sessionStorage.getItem(CONFIG.SESSION_KEY);
    if (!sessionData) {
        timerElement.textContent = '--:--';
        return;
    }
    
    try {
        const session = JSON.parse(sessionData);
        const timeRemaining = session.expiresAt - Date.now();
        
        if (timeRemaining <= 0) {
            timerElement.textContent = 'Expired';
            timerElement.parentElement.classList.add('expired');
            return;
        }
        
        // Calculate minutes and seconds
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        
        // Format as MM:SS
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerElement.textContent = formattedTime;
        
        // Add warning classes based on time remaining
        const timerContainer = timerElement.parentElement;
        timerContainer.classList.remove('warning', 'urgent', 'expired');
        
        if (timeRemaining <= CONFIG.WARNING_TIME) {
            timerContainer.classList.add('urgent');
        }
    } catch (e) {
        timerElement.textContent = '--:--';
    }
}

// DO NOT auto-initialize - handled by inline scripts in HTML files
// Export for use in other scripts
window.logout = logout;
window.isSessionValid = isSessionValid;
window.initAuth = initAuth; // Export so it can be called manually if needed
