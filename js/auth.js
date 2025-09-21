// --- DUMMY DATA --- //

const teachers = [
    { name: "Kohli", password: "test10000" }
];

// This is the default student data, used only if no data exists in storage.
const defaultStudents = [
    { name: "Sid", password: "123", xp: 75, rank: "Space Cadet" },
    { name: "Rut", password: "123", xp: 280, rank: "Cosmic Commander" },
    { name: "Raj", password: "123", xp: 510, rank: "Galactic Admiral" },
    { name: "San", password: "123", xp: 150, rank: "Star Navigator" }
];

// --- STUDENT DATA PERSISTENCE --- //

// Function to initialize student data in localStorage if it doesn't exist
function initializeStudentData() {
    if (!localStorage.getItem('educadeStudentData')) {
        localStorage.setItem('educadeStudentData', JSON.stringify(defaultStudents));
    }
}

// Function to get all students from localStorage
function getStudents() {
    return JSON.parse(localStorage.getItem('educadeStudentData'));
}

// Function to save all students to localStorage
function saveStudents(students) {
    localStorage.setItem('educadeStudentData', JSON.stringify(students));
}

// Initialize the data when the script loads
initializeStudentData();


// --- AUTHENTICATION LOGIC --- //

function login(username, password, role) {
    // We get the latest student data from storage for login validation
    let userList = role === 'teacher' ? teachers : getStudents();
    const foundUser = userList.find(user => user.name.toLowerCase() === username.toLowerCase() && user.password === password);

    if (foundUser) {
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({ ...foundUser, role: role }));
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function checkAuth(role) {
    const user = getCurrentUser();
    if (!user || user.role !== role) {
        window.location.href = 'login.html';
    }
    return user;
}

