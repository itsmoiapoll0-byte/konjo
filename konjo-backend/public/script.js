// ==========================================
// DOM ELEMENTS
// ==========================================
const homeView = document.getElementById('homeView');
const paymentsView = document.getElementById('paymentsView');
const homeLogoBtn = document.getElementById('homeLogoBtn');
const actionBar = document.getElementById('actionBar');

const sportsSection = document.getElementById('sportsSection');
const virtualSection = document.getElementById('virtualSection');
const navSportBtn = document.getElementById('navSportBtn');
const navVirtualBtn = document.getElementById('navVirtualBtn');

const loggedOutActions = document.getElementById('loggedOutActions');
const loggedInActions = document.getElementById('loggedInActions');

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const lowBalanceModal = document.getElementById('lowBalanceModal');

const sideDrawerLeft = document.getElementById('leftSidebar');
const loggedOutDrawer = document.getElementById('loggedOutDrawer');
const loggedInDrawer = document.getElementById('loggedInDrawer');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('konjo_user');
    if (savedUser) {
        showLoggedInState(savedUser);
    }
});

// ==========================================
// TOP NAVIGATION (Sports vs Virtuals)
// ==========================================
navSportBtn.onclick = (e) => {
    e.preventDefault();
    navSportBtn.classList.add('nav-item-active');
    navVirtualBtn.classList.remove('nav-item-active');
    
    sportsSection.style.display = 'block';
    virtualSection.style.display = 'none';
    
    homeView.style.display = 'block';
    paymentsView.style.display = 'none';
    if(actionBar) actionBar.style.display = 'flex';
};

navVirtualBtn.onclick = (e) => {
    e.preventDefault();
    navVirtualBtn.classList.add('nav-item-active');
    navSportBtn.classList.remove('nav-item-active');
    
    sportsSection.style.display = 'none';
    virtualSection.style.display = 'block';
    
    homeView.style.display = 'block';
    paymentsView.style.display = 'none';
    if(actionBar) actionBar.style.display = 'flex';
};

// ==========================================
// VIRTUAL GAMES CLICK (Animated Low Balance Modal)
// ==========================================
document.querySelectorAll('.game-card').forEach(card => {
    card.onclick = () => {
        lowBalanceModal.style.display = "block";
        lowBalanceModal.querySelector('.modal-content').classList.add('animated-popup');
    };
});

// ==========================================
// AUTHENTICATION LOGIC (Seamless Bypass)
// ==========================================
function showLoggedInState(phone) {
    loggedOutActions.style.display = 'none';
    loggedInActions.style.display = 'flex';
    document.getElementById('displayUserId').innerText = phone;
    
    // Smoothly close everything
    loggedOutDrawer.style.display = "none";
    loginModal.style.display = "none";
    registerModal.style.display = "none";
}

// --- REGISTRATION ---
document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault(); 
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // 9 Digits + Match -> Seamless Login (NO ALERTS)
    if (/^\d{9}$/.test(phone)) {
        localStorage.setItem('konjo_user', phone);
        showLoggedInState(phone);
    } else {
        alert("Please enter exactly 9 digits for quick access.");
    }
};

// --- LOGIN ---
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault(); 
    const phone = document.getElementById('loginPhone').value;

    // 9 Digits instantly logs in seamlessly (NO ALERTS)
    if (/^\d{9}$/.test(phone)) {
        localStorage.setItem('konjo_user', phone);
        showLoggedInState(phone);
    } else {
        alert("Please enter exactly 9 digits for quick access.");
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
    if(actionBar) actionBar.style.display = 'flex';
    navSportBtn.click(); // Reset to sport view
};

// ==========================================
// MENU & MODAL TOGGLING
// ==========================================
const openRightMenu = () => {
    const savedUser = localStorage.getItem('konjo_user');
    if (savedUser) {
        loggedInDrawer.style.display = 'block';
    } else {
        loggedOutDrawer.style.display = 'block';
    }
};

document.getElementById('dotsMenuBtn').onclick = openRightMenu;
document.getElementById('loggedInDotsBtn').onclick = openRightMenu;

document.getElementById('closeLoggedOutBtn').onclick = () => loggedOutDrawer.style.display = 'none';
document.getElementById('closeUserDrawerBtn').onclick = () => loggedInDrawer.style.display = 'none';

document.getElementById('openLoginModalBtn').onclick = () => {
    loggedOutDrawer.style.display = "none";
    loginModal.style.display = "block";
};
document.getElementById('openRegisterModalBtn').onclick = () => {
    loggedOutDrawer.style.display = "none";
    registerModal.style.display = "block";
};

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

document.getElementById('openDrawerBtn').onclick = () => sideDrawerLeft.style.display = "block";
document.getElementById('closeLeftBtn').onclick = () => sideDrawerLeft.style.display = "none";

// Close modals generically
document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.onclick = function() {
        const targetModal = document.getElementById(this.getAttribute('data-modal'));
        targetModal.style.display = "none";
        
        // Remove animation class so it plays again next time
        if(targetModal.querySelector('.modal-content').classList.contains('animated-popup')) {
            targetModal.querySelector('.modal-content').classList.remove('animated-popup');
        }
    }
});

// Click outside to close any drawer or modal
window.onclick = function(event) {
    if (event.target === loginModal) loginModal.style.display = "none";
    if (event.target === registerModal) registerModal.style.display = "none";
    if (event.target === lowBalanceModal) {
        lowBalanceModal.style.display = "none";
        lowBalanceModal.querySelector('.modal-content').classList.remove('animated-popup');
    }
    if (event.target === sideDrawerLeft) sideDrawerLeft.style.display = "none";
    if (event.target === loggedOutDrawer) loggedOutDrawer.style.display = "none";
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
// VIEWS TOGGLING (Payments Logic)
// ==========================================
homeLogoBtn.onclick = () => {
    paymentsView.style.display = 'none';
    homeView.style.display = 'block';
    if(actionBar) actionBar.style.display = 'flex';
    navSportBtn.click(); // Reset to sport view
};

window.openPaymentsTab = function(tabName) {
    homeView.style.display = 'none';
    paymentsView.style.display = 'block';
    loggedInDrawer.style.display = 'none'; 
    
    if(actionBar) actionBar.style.display = 'none';
    
    const depositContent = document.getElementById('depositContent');
    const depositActionTelebirr = document.getElementById('depositActionTelebirr');
    const depositActionUsdtTon = document.getElementById('depositActionUsdtTon');
    const depositActionUsdtTrc20 = document.getElementById('depositActionUsdtTrc20');
    
    const withdrawContent = document.getElementById('withdrawContent');
    const withdrawActionPage = document.getElementById('withdrawActionPage');
    const withdrawalReqContent = document.getElementById('withdrawalReqContent');
    
    const tabDepositBtn = document.getElementById('tabDepositBtn');
    const tabWithdrawBtn = document.getElementById('tabWithdrawBtn');
    const tabWithdrawReqBtn = document.getElementById('tabWithdrawReqBtn');

    // Reset tabs
    tabDepositBtn.classList.remove('active');
    tabWithdrawBtn.classList.remove('active');
    tabWithdrawReqBtn.classList.remove('active');
    
    // Hide everything
    depositContent.style.display = 'none';
    depositActionTelebirr.style.display = 'none';
    depositActionUsdtTon.style.display = 'none';
    depositActionUsdtTrc20.style.display = 'none';
    
    withdrawContent.style.display = 'none';
    withdrawActionPage.style.display = 'none';
    withdrawalReqContent.style.display = 'none';

    if (tabName === 'Deposit') {
        tabDepositBtn.classList.add('active');
        depositContent.style.display = 'block'; 
    } else if (tabName === 'Withdraw') {
        tabWithdrawBtn.classList.add('active');
        withdrawContent.style.display = 'block'; 
    } else if (tabName === 'Withdrawal Request') {
        tabWithdrawReqBtn.classList.add('active');
        withdrawalReqContent.style.display = 'block';
    }
}

// Custom Deposit Pages Logic
window.openDepositAction = function(method) {
    document.getElementById('depositContent').style.display = 'none';
    if(method === 'telebirr') document.getElementById('depositActionTelebirr').style.display = 'block';
    if(method === 'usdt-ton') document.getElementById('depositActionUsdtTon').style.display = 'block';
    if(method === 'usdt-trc20') document.getElementById('depositActionUsdtTrc20').style.display = 'block';
}

window.backToDepositMethods = function() {
    document.getElementById('depositActionTelebirr').style.display = 'none';
    document.getElementById('depositActionUsdtTon').style.display = 'none';
    document.getElementById('depositActionUsdtTrc20').style.display = 'none';
    document.getElementById('depositContent').style.display = 'block';
}

// Withdrawal Logic
window.openWithdrawAction = function(method) {
    document.getElementById('withdrawContent').style.display = 'none';
    
    let networkText = "TON";
    let logoSrc = "usdt.png";

    if(method === 'telebirr') { networkText = "Telebirr"; logoSrc = "1.png"; }
    else if(method === 'usdt-trc20') { networkText = "TRC20"; logoSrc = "usdtt.png"; }
    else if(method === 'voucher') { networkText = "Voucher Network"; logoSrc = "voucher.png"; }

    document.getElementById('withdrawActionLogo').src = logoSrc;
    document.getElementById('withdrawActionNetworkText').innerText = networkText;
    document.getElementById('withdrawActionPage').style.display = 'block';
}

window.backToWithdrawMethods = function() {
    document.getElementById('withdrawActionPage').style.display = 'none';
    document.getElementById('withdrawContent').style.display = 'block';
}

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