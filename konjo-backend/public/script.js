// ==========================================
// DOM ELEMENTS
// ==========================================
const homeView = document.getElementById('homeView');
const paymentsView = document.getElementById('paymentsView');
const homeLogoBtn = document.getElementById('homeLogoBtn');

const loggedOutActions = document.getElementById('loggedOutActions');
const loggedInActions = document.getElementById('loggedInActions');

const authMenuModal = document.getElementById('authMenuModal');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const sideDrawerLeft = document.getElementById('leftSidebar');
const loggedInDrawer = document.getElementById('loggedInDrawer');

// ==========================================
// INITIALIZATION (Check login state on load)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('konjo_user');
    if (savedUser) {
        showLoggedInState(savedUser);
    }
});

// ==========================================
// AUTHENTICATION LOGIC (Gasha-style bypass)
// ==========================================
const API_URL = '/api'; 

function showLoggedInState(phone) {
    // Update UI elements
    loggedOutActions.style.display = 'none';
    loggedInActions.style.display = 'flex';
    document.getElementById('displayUserId').innerText = phone;
    
    // Close all auth modals
    authMenuModal.style.display = "none";
    loginModal.style.display = "none";
    registerModal.style.display = "none";
}

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

    // BYPASS RULE: 9 Digits + Match
    if (/^\d{9}$/.test(phone)) {
        localStorage.setItem('konjo_user', phone);
        alert("Registration Success! Account saved.");
        showLoggedInState(phone);
        return;
    }

    // Standard Backend Fallback
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
        alert("Failed to connect to the server.");
    }
};

// --- LOGIN ---
document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault(); 
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    // BYPASS RULE: 9 Digits instantly logs in
    if (/^\d{9}$/.test(phone)) {
        localStorage.setItem('konjo_user', phone);
        alert("Quick Access: Logged in successfully!");
        showLoggedInState(phone);
        return; 
    }

    // Standard Backend Fallback
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('konjo_user', phone);
            alert("Logged in successfully!");
            showLoggedInState(phone);
        } else {
            alert("Login Error: " + data.message);
        }
    } catch (error) {
        alert("Failed to connect to the server.");
    }
};

// --- LOGOUT ---
document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('konjo_user');
    loggedInActions.style.display = 'none';
    loggedOutActions.style.display = 'flex';
    loggedInDrawer.style.display = 'none';
    homeView.style.display = 'block';
    paymentsView.style.display = 'none';
    alert("Logged out securely.");
};

// ==========================================
// MENU & MODAL TOGGLING
// ==========================================

// 1. Open Auth Menu (Logged out state)
document.getElementById('openAuthMenuBtn').onclick = () => {
    authMenuModal.style.display = 'block';
};
document.getElementById('closeAuthMenuBtn').onclick = () => {
    authMenuModal.style.display = 'none';
};

// Open Specific Modals from Auth Menu
document.getElementById('openLoginModalBtn').onclick = () => {
    authMenuModal.style.display = "none";
    loginModal.style.display = "block";
};
document.getElementById('openRegisterModalBtn').onclick = () => {
    authMenuModal.style.display = "none";
    registerModal.style.display = "block";
};

// Switch between Login/Register
document.getElementById('switchToRegister').onclick = (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    registerModal.style.display = "block";
};
document.getElementById('switchToLogin').onclick = (e) => {
    e.preventDefault();
    registerModal.style.display = "none";
    loginModal.style.display = "block";
};

// 2. Open User Menu (Logged in state)
document.getElementById('openUserDrawerBtn').onclick = () => {
    loggedInDrawer.style.display = 'block';
};
document.getElementById('closeUserDrawerBtn').onclick = () => {
    loggedInDrawer.style.display = 'none';
};

// 3. Open Left Sport Menu
document.getElementById('openDrawerBtn').onclick = () => {
    sideDrawerLeft.style.display = "block";
};
document.getElementById('closeLeftBtn').onclick = () => {
    sideDrawerLeft.style.display = "none";
};

// Close modals generic
document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.onclick = function() {
        document.getElementById(this.getAttribute('data-modal')).style.display = "none";
    }
});

// Click outside to close
window.onclick = function(event) {
    if (event.target === loginModal) loginModal.style.display = "none";
    if (event.target === registerModal) registerModal.style.display = "none";
    if (event.target === authMenuModal) authMenuModal.style.display = "none";
    if (event.target === sideDrawerLeft) sideDrawerLeft.style.display = "none";
    if (event.target === loggedInDrawer) loggedInDrawer.style.display = "none";
}

// Password eye toggle logic
document.querySelectorAll('.eye-icon i').forEach(icon => {
    icon.parentElement.onclick = function() {
        const input = this.previousElementSibling;
        const iTag = this.querySelector('i');
        if (input.type === "password") {
            input.type = "text";
            iTag.classList.replace('fa-eye-slash', 'fa-eye');
            iTag.style.color = "#CD122D"; 
        } else {
            input.type = "password";
            iTag.classList.replace('fa-eye', 'fa-eye-slash');
            iTag.style.color = "#6b7280";
        }
    };
});

// ==========================================
// VIEWS TOGGLING (Home vs Payments)
// ==========================================
homeLogoBtn.onclick = () => {
    paymentsView.style.display = 'none';
    homeView.style.display = 'block';
};

function openPaymentsTab(tabName) {
    // Hide home, show payments
    homeView.style.display = 'none';
    paymentsView.style.display = 'block';
    loggedInDrawer.style.display = 'none'; // Close drawer if open
    
    // Logic for internal tabs
    const depositContent = document.getElementById('depositContent');
    const withdrawalReqContent = document.getElementById('withdrawalReqContent');
    const tabDepositBtn = document.getElementById('tabDepositBtn');
    const tabWithdrawBtn = document.getElementById('tabWithdrawBtn');
    const tabWithdrawReqBtn = document.getElementById('tabWithdrawReqBtn');

    // Reset
    tabDepositBtn.classList.remove('active');
    tabWithdrawBtn.classList.remove('active');
    tabWithdrawReqBtn.classList.remove('active');
    depositContent.style.display = 'none';
    withdrawalReqContent.style.display = 'none';

    if (tabName === 'Deposit') {
        tabDepositBtn.classList.add('active');
        depositContent.style.display = 'block'; // Currently shares layout with withdraw for mock
    } else if (tabName === 'Withdraw') {
        tabWithdrawBtn.classList.add('active');
        depositContent.style.display = 'block'; 
    } else if (tabName === 'Withdrawal Request') {
        tabWithdrawReqBtn.classList.add('active');
        withdrawalReqContent.style.display = 'block';
    }
}

// Bind Payment tab clicks
document.getElementById('tabDepositBtn').onclick = () => openPaymentsTab('Deposit');
document.getElementById('tabWithdrawBtn').onclick = () => openPaymentsTab('Withdraw');
document.getElementById('tabWithdrawReqBtn').onclick = () => openPaymentsTab('Withdrawal Request');


// ==========================================
// IMAGE SLIDER LOGIC
// ==========================================
const track = document.querySelector('.slider-track');
const dots = document.querySelectorAll('.slider-dots .dot');

if (track && dots.length > 0) {
    track.addEventListener('scroll', () => {
        const slideWidth = track.clientWidth;
        const scrollPosition = track.scrollLeft;
        const activeIndex = Math.round(scrollPosition / slideWidth);
        dots.forEach((dot, index) => {
            if (index === activeIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    });
}