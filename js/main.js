// --- GLOBAL VARIABLES & CONFIG --- //
const ranks = [
    { name: "Space Cadet", minXp: 0 },
    { name: "Star Navigator", minXp: 100 },
    { name: "Cosmic Commander", minXp: 250 },
    { name: "Galactic Admiral", minXp: 500 }
];

const XP_PER_GAME = 25;

// Dummy Questions for Grade 6
const gameData = {
    "bio-prime": {
        title: "Bio-Prime: Species Identifier",
        instructions: "Answer the multiple-choice questions to shoot the correct asteroid.",
        questions: [
            { q: "What is the powerhouse of the cell?", a: ["Mitochondria", "Nucleus", "Ribosome"], correct: "Mitochondria" },
            { q: "Which gas do plants absorb from the atmosphere?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen"], correct: "Carbon Dioxide" },
            { q: "What process do plants use to make food?", a: ["Respiration", "Transpiration", "Photosynthesis"], correct: "Photosynthesis" },
            { q: "Which of these is a mammal?", a: ["Shark", "Dolphin", "Tuna"], correct: "Dolphin" }
        ]
    },
    "tech-nova": {
        title: "Tech-Nova: Component Collector",
        instructions: "Type the correct name for the component shown to collect the coins.",
        questions: [
            { q: "Name this component:", image: "https://5.imimg.com/data5/HO/EH/ZZ/SELLER-99652795/computer-cpu-500x500-1000x1000.jpg", correct: "CPU" },
            { q: "Name this component:", image: "https://www.hp.com/us-en/shop/app/assets/images/uploads/prod/how-to-install-ram-one-a-motherboard-hero156711117076644.jpg", correct: "RAM" },
            { q: "Name this component:", image: "https://dynokart.in/wp-content/uploads/2023/04/Gigabyte-H61-motherboard-for-i5-i7-processor-LGA-1155.jpg.webp", correct: "Motherboard" },
            { q: "Name this component:", image: "https://global.aorus.com/upload/Product/F_20201230135856TD1TZv.JPG", correct: "GPU" }
        ]
    },
    "engi-mech": {
        title: "Engi-Mech: Demon Slayer",
        instructions: "Answer correctly to damage the Space Demon!",
        questions: [
            { q: "Which simple machine is a seesaw an example of?", a: ["Lever", "Pulley", "Wheel"], correct: "Lever" },
            { q: "What force opposes motion between surfaces?", a: ["Gravity", "Inertia", "Friction"], correct: "Friction" },
            { q: "What is the main purpose of a bridge?", a: ["Decoration", "To span an obstacle", "A landmark"], correct: "To span an obstacle" },
            { q: "What material is known for excellent conductivity?", a: ["Rubber", "Wood", "Copper"], correct: "Copper" }
        ]
    },
    "numeria": {
        title: "Numeria: Circuit Matcher",
        instructions: "Match the problem to its correct solution to complete the circuit.",
        questions: [
            { q: "5 x 8 =", a: ["40", "45", "35"], correct: "40" },
            { q: "100 / 4 =", a: ["20", "25", "30"], correct: "25" },
            { q: "12 + 13 =", a: ["25", "24", "26"], correct: "25" },
            { q: "50 - 22 =", a: ["27", "28", "29"], correct: "28" }
        ]
    }
};

let currentQuestionIndex = 0;
let currentGameData = {};
let currentUser = {};

// --- MAIN SCRIPT EXECUTION --- //
document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split("/").pop();

    // General elements
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Page specific logic
    if (page === 'login.html') {
        initLoginPage();
    } else if (page === 'teacher_dashboard.html') {
        initTeacherDashboard();
    } else if (page === 'student_dashboard.html') {
        initStudentDashboard();
    } else if (page === 'student_leaderboard.html') {
        initLeaderboard();
    } else if (page === 'game_page.html') {
        initGamePage();
    }
});


// --- PAGE INITIALIZATION FUNCTIONS --- //

function initLoginPage() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    const title = document.getElementById('login-title');
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (!role) {
        window.location.href = 'index.html';
        return;
    }

    title.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        
        if (login(username, password, role)) {
            const destination = role === 'teacher' ? 'teacher_dashboard.html' : 'student_dashboard.html';
            window.location.href = destination;
        } else {
            errorMessage.textContent = 'Invalid credentials. Please try again.';
        }
    });
}

function initTeacherDashboard() {
    const user = checkAuth('teacher');
    document.getElementById('teacher-name').textContent = `Welcome, ${user.name}`;

    const grid = document.getElementById('teacher-dashboard-grid');
    const allStudents = getStudents(); // Get latest student data from storage
    allStudents.forEach(student => {
        const statusClass = student.xp > 200 ? 'on-track' : 'needs-practice';
        const statusText = student.xp > 200 ? 'On Track' : 'Needs Practice';
        const card = `
            <div class="student-status-card">
                <h3>${student.name} <span class="status-tag ${statusClass}">${statusText}</span></h3>
                <p><strong>Rank:</strong> ${student.rank}</p>
                <p><strong>XP:</strong> ${student.xp}</p>
                <h4>Completed Activities:</h4>
                <ul>
                    <li>Bio-Prime Mission</li>
                    <li>Numeria Challenge</li>
                </ul>
                <h4>Subjects to Focus On:</h4>
                <ul>
                    <li>Tech-Nova: Logic Gates</li>
                </ul>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function initStudentDashboard() {
    const user = checkAuth('student');
    
    // Update UI with user data
    document.getElementById('student-name').textContent = user.name;
    updateStudentProfile(user);

    // Grade selection logic
    const gradeSelect = document.getElementById('grade-select');
    gradeSelect.addEventListener('change', (e) => {
        const selectedGrade = e.target.value;
        const planetCards = document.querySelectorAll('.planet-card');
        planetCards.forEach(card => {
            if (selectedGrade === '6') {
                card.classList.remove('locked');
                card.classList.add('unlocked');
            } else {
                card.classList.add('locked');
                card.classList.remove('unlocked');
            }
        });
    });
    // Trigger change event on load to set initial state
    gradeSelect.dispatchEvent(new Event('change'));
}

function initLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    const allStudents = getStudents(); // Get latest student data from storage
    const sortedStudents = [...allStudents].sort((a, b) => b.xp - a.xp);

    leaderboardBody.innerHTML = ''; // Clear previous entries
    sortedStudents.forEach((student, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.rank}</td>
                <td>${student.xp}</td>
            </tr>
        `;
        leaderboardBody.innerHTML += row;
    });
}


function initGamePage() {
    currentUser = checkAuth('student');
    const params = new URLSearchParams(window.location.search);
    const planet = params.get('planet');

    if (!planet || !gameData[planet]) {
        window.location.href = 'student_dashboard.html';
        return;
    }

    currentGameData = gameData[planet];
    currentQuestionIndex = 0;
    document.getElementById('game-title').textContent = currentGameData.title;
    
    loadGameUI();
}

function loadGameUI() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = ''; // Clear previous game UI

    if (currentQuestionIndex >= currentGameData.questions.length) {
        awardXp(currentUser, XP_PER_GAME);
        return;
    }

    const questionData = currentGameData.questions[currentQuestionIndex];
    
    let imageHtml = '';
    if (questionData.image) {
        imageHtml = `<img src="${questionData.image}" alt="Game Question Image" class="game-image">`;
    }

    let answerHtml = '';
    if (currentGameData.title.includes("Collector")) { // Tech-Nova
        answerHtml = `
            <input type="text" id="answer-input" class="game-input" placeholder="Type your answer...">
            <button id="submit-answer" class="btn">Submit</button>
        `;
    } else { // All other games are multiple choice
        answerHtml = questionData.a.map(ans => `<button class="btn btn-answer">${ans}</button>`).join('');
    }

    gameArea.innerHTML = `
        <p class="game-instructions">${currentGameData.instructions}</p>
        <div class="question-container">
            ${imageHtml}
            <p class="question-text">${questionData.q}</p>
        </div>
        <div class="answer-container">${answerHtml}</div>
        <div class="feedback-container"></div>
    `;

    setupAnswerListeners();
}

function setupAnswerListeners() {
    const feedbackEl = document.querySelector('.feedback-container');
    
    if (currentGameData.title.includes("Collector")) {
        document.getElementById('submit-answer').addEventListener('click', () => {
            const input = document.getElementById('answer-input');
            checkAnswer(input.value);
        });
    } else {
        document.querySelectorAll('.btn-answer').forEach(button => {
            button.addEventListener('click', () => {
                checkAnswer(button.textContent);
            });
        });
    }
}

function checkAnswer(selectedAnswer) {
    const feedbackEl = document.querySelector('.feedback-container');
    const correctAnswer = currentGameData.questions[currentQuestionIndex].correct;

    if (selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = 'var(--accent-green)';
        currentQuestionIndex++;
        setTimeout(loadGameUI, 1000);
    } else {
        feedbackEl.textContent = "Try Again!";
        feedbackEl.style.color = '#ff4d4d';
    }
}


// --- HELPER & UTILITY FUNCTIONS --- //

function updateStudentProfile(user) {
    const rankData = getRank(user.xp);
    document.getElementById('student-rank').textContent = `Rank: ${rankData.current.name}`;
    
    const xpForNextRank = rankData.next ? rankData.next.minXp : rankData.current.minXp;
    const currentLevelXp = user.xp - rankData.current.minXp;
    const xpNeeded = xpForNextRank - rankData.current.minXp;
    
    let progressPercent = 100;
    if (rankData.next) {
        progressPercent = xpNeeded > 0 ? (currentLevelXp / xpNeeded) * 100 : 100;
    }
    
    document.getElementById('xp-bar').style.width = `${progressPercent}%`;
    document.getElementById('xp-text').textContent = `${user.xp} XP`;
}

function getRank(xp) {
    let currentRank = ranks[0];
    let nextRank = null;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (xp >= ranks[i].minXp) {
            currentRank = ranks[i];
            nextRank = i + 1 < ranks.length ? ranks[i+1] : null;
            break;
        }
    }
    return { current: currentRank, next: nextRank };
}

function awardXp(user, amount) {
    const oldRank = getRank(user.xp).current.name;
    user.xp += amount;
    const newRankData = getRank(user.xp);
    user.rank = newRankData.current.name; // Update user object's rank

    // Update the currently logged-in user's data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // NEW LOGIC: Update the master list in storage
    let allStudents = getStudents();
    const studentIndex = allStudents.findIndex(s => s.name === user.name);
    if (studentIndex !== -1) {
        allStudents[studentIndex].xp = user.xp;
        allStudents[studentIndex].rank = user.rank;
    }
    saveStudents(allStudents); // Save the updated list back to storage

    // Show modal
    const modal = document.getElementById('mission-complete-modal');
    document.getElementById('xp-earned').textContent = amount;
    const rankUpMsg = document.getElementById('rank-up-message');

    if (oldRank !== user.rank) {
        rankUpMsg.textContent = `Congratulations! You've been promoted to ${user.rank}!`;
    } else {
        rankUpMsg.textContent = '';
    }

    modal.style.display = 'flex';
}

