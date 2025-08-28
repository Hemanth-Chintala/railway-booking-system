// Railway Booking System - Complete JavaScript with SJF Scheduling

// Data Storage
let users = [
    { 
        username: 'admin', 
        password: 'password', 
        role: 'admin',
        fullName: 'System Administrator',
        email: 'admin@railway.com',
        phone: '+91 9999999999'
    },
    {
        username: 'user',
        password: 'password',
        role: 'user',
        fullName: 'Demo User',
        email: 'user@example.com',
        phone: '+91 9876543210',
        age: 30,
        gender: 'male',
        idType: 'aadhar',
        idNumber: '1234-5678-9012',
        address: '123 Main Street, City, State'
    }
];

let trains = [
    {
        id: 1,
        name: "Express 101",
        number: "12345",
        source: "Delhi",
        destination: "Mumbai",
        departureTime: "06:00",
        arrivalTime: "22:30",
        baseFare: 1200,
        extraCharges: 200,
        seats: 50,
        totalSeats: 50,
        travelDuration: 16.5
    },
    {
        id: 2,
        name: "Rajdhani 202",
        number: "12001",
        source: "Kolkata",
        destination: "Delhi",
        departureTime: "16:30",
        arrivalTime: "09:45",
        baseFare: 1500,
        extraCharges: 300,
        seats: 40,
        totalSeats: 40,
        travelDuration: 17.25
    },
    {
        id: 3,
        name: "Shatabdi 303",
        number: "12002",
        source: "Bangalore",
        destination: "Chennai",
        departureTime: "14:00",
        arrivalTime: "18:45",
        baseFare: 800,
        extraCharges: 100,
        seats: 60,
        totalSeats: 60,
        travelDuration: 4.75
    },
    {
        id: 4,
        name: "Duronto 404",
        number: "12259",
        source: "Mumbai",
        destination: "Kolkata",
        departureTime: "20:00",
        arrivalTime: "15:20",
        baseFare: 1300,
        extraCharges: 250,
        seats: 45,
        totalSeats: 45,
        travelDuration: 19.33
    },
    {
        id: 5,
        name: "Garib Rath 505",
        number: "12615",
        source: "Chennai",
        destination: "Bangalore",
        departureTime: "08:30",
        arrivalTime: "13:40",
        baseFare: 600,
        extraCharges: 50,
        seats: 55,
        totalSeats: 55,
        travelDuration: 5.17
    }
];

let bookings = [];
let currentUser = null;
let currentBooking = null;
let userLocation = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    
    // Set up event listeners based on page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
            setupLoginPage();
            break;
        case 'signup.html':
            setupSignupPage();
            break;
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'admin.html':
            loadAdminPanel();
            break;
        case 'profile.html':
            loadProfile();
            break;
        case 'booking.html':
            loadBookingPage();
            break;
        case 'history.html':
            loadHistoryPage();
            break;
        case 'payment.html':
            // Payment page initialization is handled in HTML
            break;
    }
});

// Load data from localStorage on page load
function loadDataFromStorage() {
    try {
        const storedUsers = localStorage.getItem('railwayUsers');
        const storedTrains = localStorage.getItem('railwayTrains');
        const storedBookings = localStorage.getItem('railwayBookings');
        
        if (storedUsers) users = JSON.parse(storedUsers);
        if (storedTrains) trains = JSON.parse(storedTrains);
        if (storedBookings) bookings = JSON.parse(storedBookings);
        
        // Sort trains using SJF scheduling
        sortTrainsBySJF();
    } catch (error) {
        console.error('Error loading data from storage:', error);
    }
}

// Save data to localStorage
function saveDataToStorage() {
    try {
        localStorage.setItem('railwayUsers', JSON.stringify(users));
        localStorage.setItem('railwayTrains', JSON.stringify(trains));
        localStorage.setItem('railwayBookings', JSON.stringify(bookings));
    } catch (error) {
        console.error('Error saving data to storage:', error);
    }
}

// SJF (Shortest Job First) Scheduling Implementation
function sortTrainsBySJF() {
    trains.sort((a, b) => {
        if (a.travelDuration === b.travelDuration) {
            // If travel times are same, sort by departure time
            return a.departureTime.localeCompare(b.departureTime);
        }
        return a.travelDuration - b.travelDuration;
    });
    saveDataToStorage();
}

// Authentication Functions
function checkAuthentication() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (currentPage !== 'index.html' && currentPage !== 'signup.html') {
                window.location.href = 'index.html';
            }
            return false;
        }
        currentUser = user;
        return true;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Setup Functions for Each Page
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
}

function setupSignupPage() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', signUp);
    }
}

// Sign Up Function
function signUp(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        fullName: formData.get('fullName'),
        username: formData.get('username'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: 'user'
    };
    
    // Validation
    if (userData.password !== userData.confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (users.find(user => user.username === userData.username)) {
        alert('Username already exists!');
        return;
    }
    
    if (users.find(user => user.email === userData.email)) {
        alert('Email already registered!');
        return;
    }
    
    // Create new user
    const newUser = {
        username: userData.username,
        password: userData.password,
        role: userData.role,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        age: '',
        gender: '',
        idType: '',
        idNumber: '',
        address: ''
    };
    
    users.push(newUser);
    saveDataToStorage();
    
    alert('Account created successfully! Please login.');
    window.location.href = 'index.html';
}

// Login Function
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } else {
        alert('Invalid credentials!');
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

// Geolocation Functions
function getCurrentLocation() {
    const statusElement = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        if (statusElement) statusElement.textContent = 'Geolocation is not supported by this browser.';
        return;
    }
    
    if (statusElement) statusElement.textContent = 'Getting your location...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            
            // For demo purposes, we'll map coordinates to nearest city
            const nearestCity = getNearestCity(userLocation.latitude, userLocation.longitude);
            if (statusElement) statusElement.textContent = `Location detected: ${nearestCity}`;
            
            // Update source dropdown
            const sourceSelect = document.getElementById('searchSource');
            if (sourceSelect) {
                sourceSelect.value = nearestCity;
            }
        },
        (error) => {
            if (statusElement) statusElement.textContent = `Error: ${error.message}`;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

function getNearestCity(lat, lon) {
    // Simple city mapping based on approximate coordinates
    const cities = {
        'Delhi': { lat: 28.6139, lon: 77.2090 },
        'Mumbai': { lat: 19.0760, lon: 72.8777 },
        'Bangalore': { lat: 12.9716, lon: 77.5946 },
        'Chennai': { lat: 13.0827, lon: 80.2707 },
        'Kolkata': { lat: 22.5726, lon: 88.3639 }
    };
    
    let nearestCity = 'Delhi';
    let minDistance = Infinity;
    
    for (let city in cities) {
        const distance = getDistance(lat, lon, cities[city].lat, cities[city].lon);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }
    
    return nearestCity;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Dashboard Functions
function loadDashboard() {
    if (!checkAuthentication()) return;
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.fullName}!`;
    }
    
    populateSearchDropdowns();
    displayTrains(trains);
}

function populateSearchDropdowns() {
    const sourceSelect = document.getElementById('searchSource');
    const destSelect = document.getElementById('searchDestination');
    
    if (!sourceSelect || !destSelect) return;
    
    const cities = [...new Set(trains.flatMap(train => [train.source, train.destination]))];
    
    // Clear existing options except first
    sourceSelect.innerHTML = '<option value="">Select Source</option>';
    destSelect.innerHTML = '<option value="">Select Destination</option>';
    
    cities.forEach(city => {
        sourceSelect.appendChild(new Option(city, city));
        destSelect.appendChild(new Option(city, city));
    });
}

function searchTrains() {
    const source = document.getElementById('searchSource').value;
    const destination = document.getElementById('searchDestination').value;
    
    let filteredTrains = [...trains];
    
    if (source) {
        filteredTrains = filteredTrains.filter(train => train.source === source);
    }
    
    if (destination) {
        filteredTrains = filteredTrains.filter(train => train.destination === destination);
    }
    
    displayTrains(filteredTrains);
}

function displayTrains(trainList) {
    const container = document.getElementById('trainsList');
    if (!container) return;
    
    if (trainList.length === 0) {
        container.innerHTML = '<p class="text-center">No trains found for the selected route.</p>';
        return;
    }
    
    container.innerHTML = trainList.map(train => `
        <div class="train-card">
            <div class="train-header">
                <div class="train-name">${train.name}</div>
                <div class="train-number">${train.number}</div>
            </div>
            <div class="train-route">
                <div>
                    <strong>${train.source}</strong><br>
                    <span style="color: #666;">${train.departureTime}</span>
                </div>
                <div style="text-align: center; color: #667eea;">
                    ⟶ ${train.travelDuration}h ⟶
                </div>
                <div style="text-align: right;">
                    <strong>${train.destination}</strong><br>
                    <span style="color: #666;">${train.arrivalTime}</span>
                </div>
            </div>
            <div class="train-details">
                <div class="detail-item">
                    <div class="detail-label">Base Fare</div>
                    <div class="detail-value">₹${train.baseFare}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Available Seats</div>
                    <div class="detail-value">${train.seats}</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 1rem;">
                <a href="booking.html?train=${train.id}" class="btn btn-primary">Book Now</a>
            </div>
        </div>
    `).join('');
}

// Profile Functions
function loadProfile() {
    if (!checkAuthentication()) return;
    
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    // Populate form with current user data
    document.getElementById('fullName').value = currentUser.fullName || '';
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('age').value = currentUser.age || '';
    document.getElementById('gender').value = currentUser.gender || '';
    document.getElementById('idType').value = currentUser.idType || '';
    document.getElementById('idNumber').value = currentUser.idNumber || '';
    document.getElementById('address').value = currentUser.address || '';
    
    form.addEventListener('submit', updateProfile);
}

function updateProfile(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Update current user data
    currentUser.fullName = formData.get('fullName');
    currentUser.email = formData.get('email');
    currentUser.phone = formData.get('phone');
    currentUser.age = formData.get('age');
    currentUser.gender = formData.get('gender');
    currentUser.idType = formData.get('idType');
    currentUser.idNumber = formData.get('idNumber');
    currentUser.address = formData.get('address');
    
    // Update in users array
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = { ...currentUser };
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    saveDataToStorage();
    
    alert('Profile updated successfully!');
}

function resetForm() {
    loadProfile(); // Reload original data
}

// Booking Functions
function loadBookingPage() {
    if (!checkAuthentication()) return;
    
    populateTrainSelect();
    
    // Set minimum date to today
    const dateInput = document.getElementById('journeyDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Set up event listeners
    const trainSelect = document.getElementById('trainSelect');
    const passengersSelect = document.getElementById('passengers');
    const seatTypeSelect = document.getElementById('seatType');
    const bookingForm = document.getElementById('bookingForm');
    
    if (trainSelect) trainSelect.addEventListener('change', onTrainSelect);
    if (passengersSelect) passengersSelect.addEventListener('change', onPassengersChange);
    if (seatTypeSelect) seatTypeSelect.addEventListener('change', calculateTotal);
    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Check if train is pre-selected from URL
    const urlParams = new URLSearchParams(window.location.search);
    const trainId = urlParams.get('train');
    if (trainId && trainSelect) {
        trainSelect.value = trainId;
        onTrainSelect();
    }
}

function populateTrainSelect() {
    const select = document.getElementById('trainSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Choose a train</option>';
    
    trains.forEach(train => {
        const option = document.createElement('option');
        option.value = train.id;
        option.textContent = `${train.name} (${train.number}) - ${train.source} to ${train.destination} - ${train.travelDuration}h`;
        select.appendChild(option);
    });
}

function onTrainSelect() {
    const trainId = document.getElementById('trainSelect').value;
    const trainDetails = document.getElementById('trainDetails');
    
    if (!trainId) {
        if (trainDetails) trainDetails.style.display = 'none';
        resetBookingForm();
        return;
    }
    
    const train = trains.find(t => t.id == trainId);
    if (!train || !trainDetails) return;
    
    // Show train details
    document.getElementById('selectedTrainName').textContent = `${train.name} (${train.number})`;
    document.getElementById('selectedRoute').textContent = `${train.source} → ${train.destination}`;
    document.getElementById('selectedDeparture').textContent = train.departureTime;
    document.getElementById('selectedArrival').textContent = train.arrivalTime;
    document.getElementById('selectedDuration').textContent = `${train.travelDuration} hours`;
    document.getElementById('selectedFare').textContent = train.baseFare;
    document.getElementById('selectedExtraCharges').textContent = train.extraCharges;
    document.getElementById('availableSeats').textContent = train.seats;
    
    trainDetails.style.display = 'block';
    calculateTotal();
}

function onPassengersChange() {
    const passengerCount = parseInt(document.getElementById('passengers').value) || 0;
    const passengerDetails = document.getElementById('passengerDetails');
    const passengerForms = document.getElementById('passengerForms');
    
    if (passengerCount === 0) {
        if (passengerDetails) passengerDetails.style.display = 'none';
        return;
    }
    
    if (!passengerForms) return;
    
    // Generate passenger forms
    passengerForms.innerHTML = '';
    
    for (let i = 1; i <= passengerCount; i++) {
        const passengerForm = document.createElement('div');
        passengerForm.className = 'passenger-form';
        passengerForm.innerHTML = `
            <h4>Passenger ${i}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label for="passenger${i}Name">Full Name</label>
                    <input type="text" id="passenger${i}Name" name="passenger${i}Name" required>
                </div>
                <div class="form-group">
                    <label for="passenger${i}Age">Age</label>
                    <input type="number" id="passenger${i}Age" name="passenger${i}Age" min="1" max="120" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="passenger${i}Gender">Gender</label>
                    <select id="passenger${i}Gender" name="passenger${i}Gender" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="passenger${i}Berth">Berth Preference</label>
                    <select id="passenger${i}Berth" name="passenger${i}Berth">
                        <option value="">No Preference</option>
                        <option value="lower">Lower</option>
                        <option value="middle">Middle</option>
                        <option value="upper">Upper</option>
                    </select>
                </div>
            </div>
        `;
        passengerForms.appendChild(passengerForm);
    }
    
    if (passengerDetails) passengerDetails.style.display = 'block';
    calculateTotal();
}

function calculateTotal() {
    const trainId = document.getElementById('trainSelect').value;
    const passengerCount = parseInt(document.getElementById('passengers').value) || 0;
    const seatType = document.getElementById('seatType').value;
    
    if (!trainId || !passengerCount || !seatType) {
        hideBookingSummary();
        return;
    }
    
    const train = trains.find(t => t.id == trainId);
    if (!train) return;
    
    // Calculate amounts
    const baseAmount = train.baseFare * passengerCount;
    const extraAmount = train.extraCharges * passengerCount;
    
    // Seat type multipliers
    const seatTypeMultipliers = {
        'sleeper': 1,
        'ac3': 2,
        'ac2': 3,
        'ac1': 4
    };
    
    const seatTypeAmount = baseAmount * (seatTypeMultipliers[seatType] - 1);
    const totalAmount = baseAmount + extraAmount + seatTypeAmount;
    
    // Update summary
    document.getElementById('baseAmount').textContent = baseAmount;
    document.getElementById('extraAmount').textContent = extraAmount;
    document.getElementById('seatTypeAmount').textContent = seatTypeAmount;
    document.getElementById('totalAmount').textContent = totalAmount;
    
    document.getElementById('bookingSummary').style.display = 'block';
    document.getElementById('proceedToPayment').disabled = false;
}

function hideBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    const button = document.getElementById('proceedToPayment');
    
    if (summary) summary.style.display = 'none';
    if (button) button.disabled = true;
}

function handleBookingSubmit(event) {
    event.preventDefault();
    
    // Collect booking data
    const trainId = document.getElementById('trainSelect').value;
    const journeyDate = document.getElementById('journeyDate').value;
    const passengerCount = parseInt(document.getElementById('passengers').value);
    const seatType = document.getElementById('seatType').value;
    
    const train = trains.find(t => t.id == trainId);
    if (!train) return;
    
    // Collect passenger data
    const passengers = [];
    for (let i = 1; i <= passengerCount; i++) {
        passengers.push({
            name: document.getElementById(`passenger${i}Name`).value,
            age: document.getElementById(`passenger${i}Age`).value,
            gender: document.getElementById(`passenger${i}Gender`).value,
            berthPreference: document.getElementById(`passenger${i}Berth`).value
        });
    }
    
    // Calculate total amount
    const baseAmount = train.baseFare * passengerCount;
    const extraAmount = train.extraCharges * passengerCount;
    const seatTypeMultipliers = { 'sleeper': 1, 'ac3': 2, 'ac2': 3, 'ac1': 4 };
    const seatTypeAmount = baseAmount * (seatTypeMultipliers[seatType] - 1);
    const totalAmount = baseAmount + extraAmount + seatTypeAmount;
    
    // Create booking object
    currentBooking = {
        trainId: trainId,
        train: train,
        journeyDate: journeyDate,
        passengers: passengers,
        seatType: seatType,
        baseAmount: baseAmount,
        extraAmount: extraAmount,
        seatTypeAmount: seatTypeAmount,
        totalAmount: totalAmount,
        user: currentUser
    };
    
    // Store in localStorage and redirect to payment
    localStorage.setItem('currentBooking', JSON.stringify(currentBooking));
    window.location.href = 'payment.html';
}

function resetBookingForm() {
    const form = document.getElementById('bookingForm');
    if (form) form.reset();
    
    hideBookingSummary();
    document.getElementById('trainDetails').style.display = 'none';
    document.getElementById('passengerDetails').style.display = 'none';
}

// Payment Functions
function loadPaymentPage() {
    if (!checkAuthentication()) return;
    
    try {
        const booking = JSON.parse(localStorage.getItem('currentBooking'));
        if (!booking) {
            alert('No booking data found. Please start from booking page.');
            window.location.href = 'booking.html';
            return;
        }
        
        currentBooking = booking;
        displayPaymentSummary();
        
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', processPayment);
        }
        
        // Set up payment method change handlers
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', showPaymentForm);
        });
        
    } catch (error) {
        console.error('Error loading payment page:', error);
        alert('Error loading booking data. Please try again.');
        window.location.href = 'booking.html';
    }
}

function displayPaymentSummary() {
    const summaryDetails = document.getElementById('summaryDetails');
    const finalAmount = document.getElementById('finalAmount');
    
    if (!summaryDetails || !currentBooking) return;
    
    summaryDetails.innerHTML = `
        <div class="booking-summary">
            <h4>Train Details</h4>
            <p><strong>Train:</strong> ${currentBooking.train.name} (${currentBooking.train.number})</p>
            <p><strong>Route:</strong> ${currentBooking.train.source} → ${currentBooking.train.destination}</p>
            <p><strong>Date:</strong> ${new Date(currentBooking.journeyDate).toLocaleDateString()}</p>
            <p><strong>Passengers:</strong> ${currentBooking.passengers.length}</p>
            <p><strong>Seat Type:</strong> ${currentBooking.seatType.toUpperCase()}</p>
            
            <h4>Amount Breakdown</h4>
            <p><strong>Base Amount:</strong> ₹${currentBooking.baseAmount}</p>
            <p><strong>Extra Charges:</strong> ₹${currentBooking.extraAmount}</p>
            <p><strong>Seat Type Charges:</strong> ₹${currentBooking.seatTypeAmount}</p>
            <hr>
            <p><strong>Total Amount:</strong> ₹${currentBooking.totalAmount}</p>
        </div>
    `;
    
    if (finalAmount) {
        finalAmount.textContent = currentBooking.totalAmount;
    }
}

function showPaymentForm() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Hide all forms
    document.getElementById('cardPaymentForm').style.display = 'none';
    document.getElementById('netbankingForm').style.display = 'none';
    document.getElementById('upiForm').style.display = 'none';
    
    // Show selected form
    switch(selectedMethod) {
        case 'card':
            document.getElementById('cardPaymentForm').style.display = 'block';
            break;
        case 'netbanking':
            document.getElementById('netbankingForm').style.display = 'block';
            break;
        case 'upi':
            document.getElementById('upiForm').style.display = 'block';
            break;
    }
}

function processPayment() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Basic validation based on payment method
    let isValid = false;
    
    switch(selectedMethod) {
        case 'card':
            const cardNumber = document.getElementById('cardNumber').value;
            const cardName = document.getElementById('cardName').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            isValid = cardNumber && cardName && expiryDate && cvv;
            break;
        case 'netbanking':
            const bankSelect = document.getElementById('bankSelect').value;
            isValid = bankSelect;
            break;
        case 'upi':
            const upiId = document.getElementById('upiId').value;
            isValid = upiId && upiId.includes('@');
            break;
    }
    
    if (!isValid) {
        alert('Please fill all payment details correctly.');
        return;
    }
    
    // Show processing modal
    document.getElementById('paymentModal').style.display = 'flex';
    
    // Simulate payment processing
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        completeBooking();
    }, 3000);
}

function completeBooking() {
    if (!currentBooking) return;
    
    // Generate PNR
    const pnr = 'PNR' + Date.now().toString().substr(-8);
    
    // Create final booking record
    const booking = {
        pnr: pnr,
        userId: currentUser.username,
        trainId: currentBooking.trainId,
        train: currentBooking.train,
        journeyDate: currentBooking.journeyDate,
        passengers: currentBooking.passengers,
        seatType: currentBooking.seatType,
        totalAmount: currentBooking.totalAmount,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };
    
    // Add to bookings array
    bookings.push(booking);
    
    // Update train seats
    const trainIndex = trains.findIndex(t => t.id == currentBooking.trainId);
    if (trainIndex !== -1) {
        trains[trainIndex].seats -= currentBooking.passengers.length;
    }
    
    // Save data
    saveDataToStorage();
    
    // Clear current booking
    localStorage.removeItem('currentBooking');
    
    // Show success modal
    document.getElementById('pnrNumber').textContent = pnr;
    document.getElementById('paidAmount').textContent = currentBooking.totalAmount;
    document.getElementById('successModal').style.display = 'flex';
}

function goBack() {
    window.location.href = 'booking.html';
}

function goToHistory() {
    document.getElementById('successModal').style.display = 'none';
    window.location.href = 'history.html';
}

function goToDashboard() {
    document.getElementById('successModal').style.display = 'none';
    window.location.href = 'dashboard.html';
}

// History Functions
function loadHistoryPage() {
    if (!checkAuthentication()) return;
    
    displayBookingHistory();
}

function displayBookingHistory() {
    const historyContainer = document.getElementById('bookingHistory');
    const noBookingsDiv = document.getElementById('noBookings');
    
    if (!historyContainer) return;
    
    const userBookings = bookings.filter(booking => booking.userId === currentUser.username);
    
    if (userBookings.length === 0) {
        historyContainer.innerHTML = '';
        if (noBookingsDiv) noBookingsDiv.style.display = 'block';
        return;
    }
    
    if (noBookingsDiv) noBookingsDiv.style.display = 'none';
    
    historyContainer.innerHTML = userBookings.map(booking => `
        <div class="booking-item" onclick="showBookingDetails('${booking.pnr}')">
            <div class="booking-header">
                <div class="booking-pnr">PNR: ${booking.pnr}</div>
                <div class="booking-status status-${booking.status}">${booking.status.toUpperCase()}</div>
            </div>
            <div class="booking-details">
                <div>
                    <strong>Train:</strong> ${booking.train.name} (${booking.train.number})
                </div>
                <div>
                    <strong>Route:</strong> ${booking.train.source} → ${booking.train.destination}
                </div>
                <div>
                    <strong>Date:</strong> ${new Date(booking.journeyDate).toLocaleDateString()}
                </div>
                <div>
                    <strong>Passengers:</strong> ${booking.passengers.length}
                </div>
                <div>
                    <strong>Amount:</strong> ₹${booking.totalAmount}
                </div>
                <div>
                    <strong>Booked On:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    `).join('');
}

function filterBookings() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filteredBookings = bookings.filter(booking => booking.userId === currentUser.username);
    
    if (statusFilter) {
        filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
    }
    
    if (dateFilter) {
        const [year, month] = dateFilter.split('-');
        filteredBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate.getFullYear() == year && (bookingDate.getMonth() + 1) == month;
        });
    }
    
    // Update display with filtered bookings
    const historyContainer = document.getElementById('bookingHistory');
    const noBookingsDiv = document.getElementById('noBookings');
    
    if (filteredBookings.length === 0) {
        historyContainer.innerHTML = '';
        if (noBookingsDiv) noBookingsDiv.style.display = 'block';
        return;
    }
    
    if (noBookingsDiv) noBookingsDiv.style.display = 'none';
    
    historyContainer.innerHTML = filteredBookings.map(booking => `
        <div class="booking-item" onclick="showBookingDetails('${booking.pnr}')">
            <div class="booking-header">
                <div class="booking-pnr">PNR: ${booking.pnr}</div>
                <div class="booking-status status-${booking.status}">${booking.status.toUpperCase()}</div>
            </div>
            <div class="booking-details">
                <div>
                    <strong>Train:</strong> ${booking.train.name} (${booking.train.number})
                </div>
                <div>
                    <strong>Route:</strong> ${booking.train.source} → ${booking.train.destination}
                </div>
                <div>
                    <strong>Date:</strong> ${new Date(booking.journeyDate).toLocaleDateString()}
                </div>
                <div>
                    <strong>Passengers:</strong> ${booking.passengers.length}
                </div>
                <div>
                    <strong>Amount:</strong> ₹${booking.totalAmount}
                </div>
                <div>
                    <strong>Booked On:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    `).join('');
}

function showBookingDetails(pnr) {
    const booking = bookings.find(b => b.pnr === pnr);
    if (!booking) return;
    
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;
    
    modalBody.innerHTML = `
        <div class="booking-full-details">
            <h3>Booking Details - ${booking.pnr}</h3>
            
            <div class="detail-section">
                <h4>Train Information</h4>
                <p><strong>Train:</strong> ${booking.train.name} (${booking.train.number})</p>
                <p><strong>Route:</strong> ${booking.train.source} → ${booking.train.destination}</p>
                <p><strong>Departure:</strong> ${booking.train.departureTime}</p>
                <p><strong>Arrival:</strong> ${booking.train.arrivalTime}</p>
                <p><strong>Journey Date:</strong> ${new Date(booking.journeyDate).toLocaleDateString()}</p>
                <p><strong>Seat Type:</strong> ${booking.seatType.toUpperCase()}</p>
            </div>
            
            <div class="detail-section">
                <h4>Passenger Information</h4>
                ${booking.passengers.map((passenger, index) => `
                    <div class="passenger-info">
                        <p><strong>Passenger ${index + 1}:</strong> ${passenger.name}</p>
                        <p><strong>Age:</strong> ${passenger.age}</p>
                        <p><strong>Gender:</strong> ${passenger.gender}</p>
                        ${passenger.berthPreference ? `<p><strong>Berth Preference:</strong> ${passenger.berthPreference}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div class="detail-section">
                <h4>Payment Information</h4>
                <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
                <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="status-${booking.status}">${booking.status.toUpperCase()}</span></p>
            </div>
        </div>
    `;
    
    // Show/hide cancel button based on booking status and date
    const cancelBtn = document.getElementById('cancelBookingBtn');
    const journeyDate = new Date(booking.journeyDate);
    const today = new Date();
    const canCancel = booking.status === 'confirmed' && journeyDate > today;
    
    if (cancelBtn) {
        cancelBtn.style.display = canCancel ? 'inline-block' : 'none';
        cancelBtn.setAttribute('data-pnr', booking.pnr);
    }
    
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function cancelBooking() {
    const pnr = document.getElementById('cancelBookingBtn').getAttribute('data-pnr');
    
    if (!confirm('Are you sure you want to cancel this booking? Cancellation charges may apply.')) {
        return;
    }
    
    const bookingIndex = bookings.findIndex(b => b.pnr === pnr);
    if (bookingIndex === -1) return;
    
    // Update booking status
    bookings[bookingIndex].status = 'cancelled';
    
    // Restore train seats
    const trainIndex = trains.findIndex(t => t.id == bookings[bookingIndex].trainId);
    if (trainIndex !== -1) {
        trains[trainIndex].seats += bookings[bookingIndex].passengers.length;
    }
    
    saveDataToStorage();
    
    alert('Booking cancelled successfully!');
    closeBookingModal();
    displayBookingHistory();
}

// Admin Panel Functions
function loadAdminPanel() {
    if (!checkAuthentication() || currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    updateAdminStats();
    showSection('dashboard'); // Show dashboard by default
}

function updateAdminStats() {
    const totalTrains = trains.length;
    const totalBookings = bookings.length;
    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalRevenue = bookings.reduce((sum, booking) => 
        booking.status === 'confirmed' || booking.status === 'completed' ? sum + booking.totalAmount : sum, 0
    );
    
    document.getElementById('totalTrains').textContent = totalTrains;
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalRevenue').textContent = totalRevenue;
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + 'Section') || document.getElementById('adminDashboard');
    targetSection.style.display = 'block';
    
    // Load section specific data
    switch(sectionName) {
        case 'trains':
            loadTrainsTable();
            break;
        case 'bookings':
            loadBookingsTable();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'dashboard':
            updateAdminStats();
            break;
    }
}

function loadTrainsTable() {
    const tbody = document.querySelector('#trainsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = trains.map(train => `
        <tr>
            <td>${train.name}</td>
            <td>${train.number}</td>
            <td>${train.source} → ${train.destination}</td>
            <td>${train.departureTime}</td>
            <td>${train.arrivalTime}</td>
            <td>${train.travelDuration}h</td>
            <td>₹${train.baseFare}</td>
            <td>${train.seats}/${train.totalSeats}</td>
            <td>
                <button class="btn btn-primary" onclick="editTrain(${train.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteTrain(${train.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function loadBookingsTable() {
    const tbody = document.querySelector('#bookingsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = bookings.map(booking => {
        const user = users.find(u => u.username === booking.userId);
        return `
            <tr>
                <td>${booking.pnr}</td>
                <td>${user ? user.fullName : booking.userId}</td>
                <td>${booking.train.name} (${booking.train.number})</td>
                <td>${new Date(booking.journeyDate).toLocaleDateString()}</td>
                <td>${booking.passengers.length}</td>
                <td>₹${booking.totalAmount}</td>
                <td><span class="status-${booking.status}">${booking.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn btn-primary" onclick="viewBookingAdmin('${booking.pnr}')">View</button>
                    ${booking.status === 'confirmed' ? `<button class="btn btn-danger" onclick="cancelBookingAdmin('${booking.pnr}')">Cancel</button>` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function loadUsersTable() {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    const regularUsers = users.filter(u => u.role === 'user');
    
    tbody.innerHTML = regularUsers.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.fullName || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-primary" onclick="viewUser('${user.username}')">View</button>
                <button class="btn btn-danger" onclick="deleteUser('${user.username}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Train Management Functions
function showAddTrainModal() {
    document.getElementById('trainModalTitle').textContent = 'Add New Train';
    document.getElementById('trainForm').reset();
    document.getElementById('trainId').value = '';
    document.getElementById('trainModal').style.display = 'flex';
}

function editTrain(trainId) {
    const train = trains.find(t => t.id === trainId);
    if (!train) return;
    
    document.getElementById('trainModalTitle').textContent = 'Edit Train';
    document.getElementById('trainId').value = train.id;
    document.getElementById('trainName').value = train.name;
    document.getElementById('trainNumber').value = train.number;
    document.getElementById('trainSource').value = train.source;
    document.getElementById('trainDestination').value = train.destination;
    document.getElementById('departureTime').value = train.departureTime;
    document.getElementById('arrivalTime').value = train.arrivalTime;
    document.getElementById('baseFare').value = train.baseFare;
    document.getElementById('extraCharges').value = train.extraCharges;
    document.getElementById('totalSeats').value = train.totalSeats;
    document.getElementById('travelDuration').value = train.travelDuration;
    
    document.getElementById('trainModal').style.display = 'flex';
}

function saveTrain() {
    const trainId = document.getElementById('trainId').value;
    const trainData = {
        name: document.getElementById('trainName').value,
        number: document.getElementById('trainNumber').value,
        source: document.getElementById('trainSource').value,
        destination: document.getElementById('trainDestination').value,
        departureTime: document.getElementById('departureTime').value,
        arrivalTime: document.getElementById('arrivalTime').value,
        baseFare: parseInt(document.getElementById('baseFare').value),
        extraCharges: parseInt(document.getElementById('extraCharges').value),
        totalSeats: parseInt(document.getElementById('totalSeats').value),
        travelDuration: parseFloat(document.getElementById('travelDuration').value)
    };
    
    if (trainId) {
        // Edit existing train
        const trainIndex = trains.findIndex(t => t.id == trainId);
        if (trainIndex !== -1) {
            trains[trainIndex] = { ...trains[trainIndex], ...trainData };
        }
    } else {
        // Add new train
        const newTrain = {
            id: Date.now(),
            ...trainData,
            seats: trainData.totalSeats
        };
        trains.push(newTrain);
    }
    
    sortTrainsBySJF();
    saveDataToStorage();
    closeTrainModal();
    loadTrainsTable();
    updateAdminStats();
    alert('Train saved successfully!');
}

function deleteTrain(trainId) {
    if (!confirm('Are you sure you want to delete this train?')) return;
    
    const trainIndex = trains.findIndex(t => t.id === trainId);
    if (trainIndex !== -1) {
        trains.splice(trainIndex, 1);
        saveDataToStorage();
        loadTrainsTable();
        updateAdminStats();
        alert('Train deleted successfully!');
    }
}

function closeTrainModal() {
    document.getElementById('trainModal').style.display = 'none';
}

// Admin Booking Management
function viewBookingAdmin(pnr) {
    showBookingDetails(pnr); // Reuse the existing function
}

function cancelBookingAdmin(pnr) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    const bookingIndex = bookings.findIndex(b => b.pnr === pnr);
    if (bookingIndex === -1) return;
    
    bookings[bookingIndex].status = 'cancelled';
    
    // Restore train seats
    const trainIndex = trains.findIndex(t => t.id == bookings[bookingIndex].trainId);
    if (trainIndex !== -1) {
        trains[trainIndex].seats += bookings[bookingIndex].passengers.length;
    }
    
    saveDataToStorage();
    loadBookingsTable();
    updateAdminStats();
    alert('Booking cancelled successfully!');
}

// Admin User Management
function viewUser(username) {
    const user = users.find(u => u.username === username);
    if (!user) return;
    
    alert(`User Details:
Name: ${user.fullName}
Email: ${user.email}
Phone: ${user.phone}
Age: ${user.age}
Gender: ${user.gender}
Address: ${user.address}`);
}

function deleteUser(username) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        saveDataToStorage();
        loadUsersTable();
        updateAdminStats();
        alert('User deleted successfully!');
    }
}

// Utility Functions
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function generatePNR() {
    return 'PNR' + Date.now().toString().substr(-8);
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    for (let input of inputs) {
        if (!input.value.trim()) {
            alert(`Please fill in ${input.previousElementSibling.textContent}`);
            input.focus();
            return false;
        }
    }
    return true;
}

// Input formatting functions
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    input.value = formattedValue;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Add event listeners for payment form formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
            formatExpiryDate(this);
        });
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Print functionality (bonus feature)
function printTicket(pnr) {
    const booking = bookings.find(b => b.pnr === pnr);
    if (!booking) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Ticket - ${pnr}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .ticket { border: 2px solid #000; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .details { margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <h1>Railway Ticket</h1>
                        <h2>PNR: ${booking.pnr}</h2>
                    </div>
                    <div class="details">
                        <p><strong>Train:</strong> ${booking.train.name} (${booking.train.number})</p>
                        <p><strong>Route:</strong> ${booking.train.source} → ${booking.train.destination}</p>
                        <p><strong>Date:</strong> ${new Date(booking.journeyDate).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> ${booking.train.departureTime} - ${booking.train.arrivalTime}</p>
                        <p><strong>Passengers:</strong> ${booking.passengers.length}</p>
                        <p><strong>Seat Type:</strong> ${booking.seatType.toUpperCase()}</p>
                        <p><strong>Amount:</strong> ₹${booking.totalAmount}</p>
                        <p><strong>Status:</strong> ${booking.status.toUpperCase()}</p>
                    </div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}