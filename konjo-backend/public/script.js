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

const sideDrawerLeft = document.getElementById('leftSidebar');
const loggedOutDrawer = document.getElementById('loggedOutDrawer');
const loggedInDrawer = document.getElementById('loggedInDrawer');

// INIT
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('konjo_user');
    if (savedUser) showLoggedInState(savedUser);
});

// TOP NAVIGATION TOGGLES
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

// VIRTUAL GAMES CLICK
document.querySelectorAll('.game-card').forEach(card => {
    card.onclick = () => alert("Launching virtual game...");
});

// AUTHENTICATION
const API_URL = '/api'; 

function showLoggedInState(phone) {
    loggedOutActions.style.display = 'none';
    loggedInActions.style.display = 'flex';
    document.getElementById('displayUserId').innerText = phone;
    loggedOutDrawer.style.display = "none";
    loginModal.style.display = "none";
    registerModal.style.display = "none";
}

document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault(); 
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) { alert("Passwords do not match!"); return; }

    if (/^\d{9}$/.test(phone)) {
        localStorage.setItem('konjo_user', phone);
        alert("Registration Success! Account saved.");
        showLoggedInState(phone);
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
        } else { alert("Registration Error: " + data.message); }
    } catch (error) { alert("Failed to connect to the server."); }
};

document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault(); 
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    if (/^\d{9}$/.test(phone)) {
        localStorage.setItem('konjo_user', phone);
        alert("Quick Access: Logged in successfully!");
        showLoggedInState(phone);
        return; 
    }

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
        } else { alert("Login Error: " + data.message); }
    } catch (error) { alert("Failed to connect to the server."); }
};

document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('konjo_user');
    loggedInActions.style.display = 'none';
    loggedOutActions.style.display = 'flex';
    loggedInDrawer.style.display = 'none';
    
    homeView.style.display = 'block';
    paymentsView.style.display = 'none';
    if(actionBar) actionBar.style.display = 'flex';
    navSportBtn.click();
    alert("Logged out securely.");
};

// MODALS & MENUS
const openRightMenu = () => {
    if (localStorage.getItem('konjo_user')) loggedInDrawer.style.display = 'block';
    else loggedOutDrawer.style.display = 'block';
};
document.getElementById('dotsMenuBtn').onclick = openRightMenu;
document.getElementById('loggedInDotsBtn').onclick = openRightMenu;

document.getElementById('closeLoggedOutBtn').onclick = () => loggedOutDrawer.style.display = 'none';
document.getElementById('closeUserDrawerBtn').onclick = () => loggedInDrawer.style.display = 'none';

document.getElementById('openLoginModalBtn').onclick = () => { loggedOutDrawer.style.display = "none"; loginModal.style.display = "block"; };
document.getElementById('openRegisterModalBtn').onclick = () => { loggedOutDrawer.style.display = "none"; registerModal.style.display = "block"; };
document.getElementById('switchToRegister').onclick = (e) => { e.preventDefault(); loginModal.style.display = "none"; registerModal.style.display = "block"; };
document.getElementById('switchToLogin').onclick = (e) => { e.preventDefault(); registerModal.style.display = "none"; loginModal.style.display = "block"; };

document.getElementById('openDrawerBtn').onclick = () => sideDrawerLeft.style.display = "block";
document.getElementById('closeLeftBtn').onclick = () => sideDrawerLeft.style.display = "none";

document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.onclick = function() { document.getElementById(this.getAttribute('data-modal')).style.display = "none"; }
});

window.onclick = function(event) {
    if (event.target === loginModal) loginModal.style.display = "none";
    if (event.target === registerModal) registerModal.style.display = "none";
    if (event.target === sideDrawerLeft) sideDrawerLeft.style.display = "none";
    if (event.target === loggedOutDrawer) loggedOutDrawer.style.display = "none";
    if (event.target === loggedInDrawer) loggedInDrawer.style.display = "none";
}

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

// PAYMENTS VIEW LOGIC
homeLogoBtn.onclick = () => {
    paymentsView.style.display = 'none';
    homeView.style.display = 'block';
    if(actionBar) actionBar.style.display = 'flex';
    navSportBtn.click();
};

window.openPaymentsTab = function(tabName) {
    homeView.style.display = 'none';
    paymentsView.style.display = 'block';
    loggedInDrawer.style.display = 'none'; 
    if(actionBar) actionBar.style.display = 'none';
    
    const depositContent = document.getElementById('depositContent');
    const depositActionTelebirr = document.getElementById('depositActionTelebirr');
    const withdrawContent = document.getElementById('withdrawContent');
    const withdrawActionPage = document.getElementById('withdrawActionPage');
    const withdrawalReqContent = document.getElementById('withdrawalReqContent');
    
    document.getElementById('tabDepositBtn').classList.remove('active');
    document.getElementById('tabWithdrawBtn').classList.remove('active');
    document.getElementById('tabWithdrawReqBtn').classList.remove('active');
    
    depositContent.style.display = 'none';
    depositActionTelebirr.style.display = 'none';
    withdrawContent.style.display = 'none';
    withdrawActionPage.style.display = 'none';
    withdrawalReqContent.style.display = 'none';

    if (tabName === 'Deposit') {
        document.getElementById('tabDepositBtn').classList.add('active');
        depositContent.style.display = 'block'; 
    } else if (tabName === 'Withdraw') {
        document.getElementById('tabWithdrawBtn').classList.add('active');
        withdrawContent.style.display = 'block'; 
    } else if (tabName === 'Withdrawal Request') {
        document.getElementById('tabWithdrawReqBtn').classList.add('active');
        withdrawalReqContent.style.display = 'block';
    }
}

window.openDepositAction = function(method) {
    document.getElementById('depositContent').style.display = 'none';
    if(method === 'telebirr') document.getElementById('depositActionTelebirr').style.display = 'block';
}

window.backToDepositMethods = function() {
    document.getElementById('depositActionTelebirr').style.display = 'none';
    document.getElementById('depositContent').style.display = 'block';
}

window.openWithdrawAction = function(method) {
    document.getElementById('withdrawContent').style.display = 'none';
    
    // Dynamic text changes based on method clicked
    let networkText = "TON";
    let logoSrc = "usdt.png";
    let titleText = "USDT-TON";

    if(method === 'telebirr') { networkText = "Telebirr"; logoSrc = "1.png"; titleText = "Telebirr"; }
    else if(method === 'usdt-trc20') { networkText = "TRC20"; logoSrc = "usdtt.png"; titleText = "TETHER USDT TRC20"; }
    else if(method === 'voucher') { networkText = "Voucher Network"; logoSrc = "voucher.png"; titleText = "Voucher"; }

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

// SLIDER
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