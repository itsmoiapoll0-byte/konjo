// ==========================================
// 1. MODAL LOGIC (Login & Registration)
// ==========================================
const drawerLoginBtn = document.getElementById('drawerLoginBtn');
const drawerRegisterBtn = document.getElementById('drawerRegisterBtn');

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeBtns = document.querySelectorAll('.close-modal-btn'); 

const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Open Modals from Drawer
if (drawerLoginBtn) {
    drawerLoginBtn.onclick = () => {
        loginModal.style.display = "block";
        sideDrawerRight.style.display = "none"; 
    };
}

if (drawerRegisterBtn) {
    drawerRegisterBtn.onclick = () => {
        registerModal.style.display = "block";
        sideDrawerRight.style.display = "none";
    };
}

// Handle Switching
if (switchToRegister) {
    switchToRegister.onclick = (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    };
}

if (switchToLogin) {
    switchToLogin.onclick = (e) => {
        e.preventDefault();
        registerModal.style.display = "none";
        loginModal.style.display = "block";
    };
}

// Close Modals
closeBtns.forEach(btn => {
    btn.onclick = function() {
        const modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = "none";
    }
});

// Close when clicking outside
window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
    if (event.target === registerModal) {
        registerModal.style.display = "none";
    }
    if (event.target === sideDrawerLeft) {
        sideDrawerLeft.style.display = "none";
    }
    if (event.target === sideDrawerRight) {
        sideDrawerRight.style.display = "none";
    }
}

// Password eye toggle logic
const toggleIcons = document.querySelectorAll('.eye-icon i');
toggleIcons.forEach(icon => {
    icon.parentElement.onclick = function() {
        const input = this.previousElementSibling;
        const iTag = this.querySelector('i');
        
        if (input.type === "password") {
            input.type = "text";
            iTag.classList.remove('fa-eye-slash');
            iTag.classList.add('fa-eye');
            iTag.style.color = "#CD122D"; 
        } else {
            input.type = "password";
            iTag.classList.remove('fa-eye');
            iTag.classList.add('fa-eye-slash');
            iTag.style.color = "#6b7280";
        }
    };
});


// ==========================================
// 2. DRAWER LOGIC (Left Sport & Right User)
// ==========================================
const openDrawerBtn = document.getElementById('openDrawerBtn'); 
const openUserBtn = document.getElementById('dotsMenuBtn'); 
const closeLeftBtn = document.getElementById('closeLeftBtn');
const closeRightBtn = document.getElementById('closeRightBtn');
const sideDrawerLeft = document.getElementById('leftSidebar');
const sideDrawerRight = document.getElementById('rightSidebar');

// Left Sport Drawer (☰)
if (openDrawerBtn) {
    openDrawerBtn.onclick = () => {
        sideDrawerLeft.style.display = "block";
    };
}

if (closeLeftBtn) {
    closeLeftBtn.onclick = () => {
        sideDrawerLeft.style.display = "none";
    };
}

// Right User Drawer (⋮ Menu)
if (openUserBtn) {
    openUserBtn.onclick = () => {
        sideDrawerRight.style.display = "block";
    };
}

if (closeRightBtn) {
    closeRightBtn.onclick = () => {
        sideDrawerRight.style.display = "none";
    };
}


// ==========================================
// 3. BACKEND CONNECTION (API Requests)
// ==========================================
const API_URL = '/api'; 

// --- REGISTRATION ---
document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault(); 
    
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success: " + data.message);
            registerModal.style.display = "none";
            document.getElementById('registerForm').reset();
            loginModal.style.display = "block";
        } else {
            alert("Registration Error: " + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Failed to connect to the server.");
    }
};

// --- LOGIN (9-Digit Quick Bypass Active) ---
document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault(); 
    
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    // RULE: If input is exactly 9 numbers, auto-login immediately.
    const isNineDigits = /^\d{9}$/.test(phone);

    if (isNineDigits) {
        // Simulated successful login for 9-digit rule
        alert("Quick Access: Logged in successfully!");
        loginModal.style.display = "none";
        document.getElementById('loginForm').reset();
        
        // Update the UI to show logged-in state (green checkmark in profile)
        const profileInitial = document.querySelector('.profile-initial');
        if (profileInitial) {
            profileInitial.style.backgroundColor = "#4ade80"; 
            profileInitial.innerHTML = "✓";
        }
        return; // Stop here, do not hit the backend
    }

    // STANDARD: If NOT 9 digits, verify securely with Node.js backend
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert("Logged in successfully!");
            loginModal.style.display = "none";
            document.getElementById('loginForm').reset();
            
            // Update the UI to show logged-in state
            const profileInitial = document.querySelector('.profile-initial');
            if (profileInitial) {
                profileInitial.style.backgroundColor = "#4ade80"; 
                profileInitial.innerHTML = "✓";
            }
        } else {
            alert("Login Error: " + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Failed to connect to the server.");
    }
};


// ==========================================
// 4. IMAGE SLIDER LOGIC
// ==========================================
const track = document.querySelector('.slider-track');
const dots = document.querySelectorAll('.slider-dots .dot');

if (track && dots.length > 0) {
    track.addEventListener('scroll', () => {
        // Calculate which slide is currently in view based on scroll position
        const slideWidth = track.clientWidth;
        const scrollPosition = track.scrollLeft;
        const activeIndex = Math.round(scrollPosition / slideWidth);

        // Update dots
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });
}