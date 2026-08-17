const SECRET_CODE = "1612"

// ---------------- 1. QUIZ DATA ----------------
const QUIZ_DATA = [
  {
    question: "[VERY EASY] What did we do for our first date?",
    options: ["See the sunset", "Board game", "Arcade", "Pickleball"],
    correctIndex: 3,
    feedback: "This one is very easy though"
  },
  {
    question: "[EASY] Who is the G.O.A.T ?",
    options: ["Lamine Yamal", "Kylian Mbappe", "Lionel Messi", "Erling Halaand"],
    correctIndex: 2,
    feedback: "There's only one G.O.A.T"
  },
  {
    question: "[MEDIUM] When was Stubborn Sitter photo clicked? Like where did we go before taking that photo in the link",
    options: ["Green Lake", "Gas Works and Fremont troll", "Volunteer Park", "Arboretum"],
    correctIndex: 1,
    feedback: "I needed a photo for your contact details in my phone"
  },
  {
    question: "[MEDIUM] Where did we exchange numbers?",
    options: ["At the bus stop", "In the link", "At the link station", "Instagram message"],
    correctIndex: 1,
    feedback: "After the Mox boarding date ig"
  },
  {
    question: "[HARD] What color shirt was I wearing when I first met you?",
    options: ["Black", "Grey", "Blue", "Red"],
    correctIndex: 2,
    feedback: "Even I don't remember this btw"
  }
];

// ---------------- 2. REASONS I LIKE YOU DATA ----------------
// Customize these 3 reasons to anything you like!
const REASONS_LIST = [
  "Your smile and cuteness",
  "Sound effects you make while telling about something",
  "You are smart and independent ft Apple Maps",
  "You tolerate my stupid jokes, random questions, and useless facts"
];

// ---------------- 3. MAP PLACES (NAMES ONLY) ----------------
const PLACES_IN_ORDER = [
  {
    name: "Pickleball",
    coords: [47.5664334581024, -122.33487661949067]
  },
  {
    name: "Sunset",
    coords: [47.61256476071375, -122.2104525446207]
  },
  {
    name: "Arcade",
    coords: [47.61787832589846, -122.17071157709864]
  },
  {
    name: "Board games",
    coords: [47.62759383150202, -122.13375199220141]
  },
  {
    name: "Gas Works Park",
    coords: [47.64573919359973, -122.33377384647024]
  },
  
  {
    name: "Fremont Troll",
    coords: [47.65114950011755, -122.34698381948552]
  },
  
  {
    name: "Arboretum",
    coords: [47.63638114972098, -122.29546582641798]
  },
  
  {
    name: "Green Lake",
    coords: [47.67937775569642, -122.3299747717152]
  },
  
  {
    name: "Northgate",
    coords: [47.7089869486265, -122.32552592804467]
  },
    
  {
    name: "Volunteer Park",
    coords: [47.63268388490116, -122.31565002502995]
  },
  
  {
    name: "Mercer Island",
    coords: [47.59113921128052, -122.22498903877262]
  },
  
  {
    name: "Bellevue downtown park",
    coords: [47.6125680450539, -122.20359413568431]
  },
  
  {
    name: "Bellevue Square",
    coords: [47.6162725869773, -122.20607593042978]
  },
  
  {
    name: "Clyde Beach",
    coords: [47.614489244944906, -122.2174276214497]
  },
  
  {
    name: "Movie",
    coords: [47.7046184600854, -122.21435501514203]
  },
];

// State Variables
let currentStep = 0;
let answeredCorrectly = false;
let map = null;
let markers = [];
let reasonIndex = 0;

// DOM Elements
const screenLock = document.getElementById('screen-lock');
const lockForm = document.getElementById('lock-form');
const passcodeInput = document.getElementById('passcode-input');
const lockFeedback = document.getElementById('lock-feedback');

const screenIntro = document.getElementById('screen-intro');
const screenQuiz = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const replayMapBtn = document.getElementById('replay-map-btn');

const progressText = document.getElementById('quiz-progress-text');
const progressPercent = document.getElementById('quiz-progress-percent');
const progressBar = document.getElementById('quiz-progress-bar');

const questionText = document.getElementById('quiz-question');
const optionsContainer = document.getElementById('quiz-options');
const feedbackText = document.getElementById('quiz-feedback');
const mapStatus = document.getElementById('map-status');

const revealReasonBtn = document.getElementById('reveal-reason-btn');
const reasonsList = document.getElementById('reasons-list');
const reasonsEndMsg = document.getElementById('reasons-end-msg');

// ---------------- PASSCODE UNLOCK HANDLER ----------------
lockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const enteredCode = passcodeInput.value.trim();

  if (enteredCode === SECRET_CODE) {
    lockFeedback.classList.add('d-none');
    screenLock.classList.add('d-none');
    screenIntro.classList.remove('d-none');
  } else {
    passcodeInput.classList.add('shake-element');
    lockFeedback.textContent = "Incorrect code! Try again";
    lockFeedback.classList.remove('d-none');
    passcodeInput.value = '';

    setTimeout(() => {
      passcodeInput.classList.remove('shake-element');
    }, 400);
  }
});

// Start Quiz Handler
startBtn.addEventListener('click', () => {
  currentStep = 0;
  screenIntro.classList.add('d-none');
  screenQuiz.classList.remove('d-none');
  loadQuestion();
});

// Load Current Question
function loadQuestion() {
  answeredCorrectly = false;
  nextBtn.classList.add('d-none');
  feedbackText.className = "alert d-none border-secondary small mb-3";
  optionsContainer.innerHTML = '';

  const currentQ = QUIZ_DATA[currentStep];
  const total = QUIZ_DATA.length;
  const pct = Math.round(((currentStep + 1) / total) * 100);

  progressText.textContent = `Question ${currentStep + 1} of ${total}`;
  progressPercent.textContent = `${pct}% Completed`;
  progressBar.style.width = `${pct}%`;

  questionText.textContent = currentQ.question;

  currentQ.options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.className = "btn btn-outline-light text-start p-3 rounded-3 border-secondary border-opacity-50 option-btn";
    btn.textContent = optText;
    btn.addEventListener('click', () => handleSelect(btn, index));
    optionsContainer.appendChild(btn);
  });

  nextBtn.textContent = (currentStep + 1 === total) ? "Unlock Birthday Page ➔" : "Next Question ➔";
}

// Option Selected Handler with Strict Validation
function handleSelect(selectedBtn, index) {
  if (answeredCorrectly) return;

  const currentQ = QUIZ_DATA[currentStep];
  const isCorrect = index === currentQ.correctIndex;

  if (isCorrect) {
    answeredCorrectly = true;

    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === index) {
        btn.className = "btn btn-success text-start p-3 rounded-3 fw-bold";
        btn.textContent += " ✅";
      } else {
        btn.className = "btn btn-dark text-start p-3 rounded-3 opacity-40";
      }
    });

    feedbackText.textContent = currentQ.feedback;
    feedbackText.className = "alert alert-success border-success bg-success bg-opacity-10 text-success small mb-3";
    nextBtn.classList.remove('d-none');

  } else {
    selectedBtn.className = "btn btn-danger text-start p-3 rounded-3 fw-bold shake-btn";
    
    setTimeout(() => {
      selectedBtn.classList.remove('shake-btn');
    }, 400);

    feedbackText.textContent = "❌ Not quite! Give it another guess.";
    feedbackText.className = "alert alert-danger border-danger bg-danger bg-opacity-10 text-danger small mb-3";
  }
}

nextBtn.addEventListener('click', () => {
  if (currentStep + 1 < QUIZ_DATA.length) {
    currentStep++;
    loadQuestion();
  } else {
    showResults();
  }
});

// ---------------- REASONS CLICK HANDLER ----------------
revealReasonBtn.addEventListener('click', () => {
  if (reasonIndex < REASONS_LIST.length) {
    const reasonBox = document.createElement('div');
    reasonBox.className = "p-3 rounded-3 bg-slate-800 bg-opacity-50 border border-secondary text-light small reason-item";
    reasonBox.innerHTML = `<strong class="text-danger">#${reasonIndex + 1}:</strong> ${REASONS_LIST[reasonIndex]}`;
    reasonsList.appendChild(reasonBox);
    
    reasonIndex++;

    if (reasonIndex === REASONS_LIST.length) {
      revealReasonBtn.textContent = "Click for reason #5 ✨";
    } else {
      revealReasonBtn.textContent = `Click for reason #${reasonIndex + 1} ✨`;
    }
  } else {
    // 4th Click: Hide button & show final message
    revealReasonBtn.classList.add('d-none');
    reasonsEndMsg.classList.remove('d-none');
  }
});

// Show Results & Initialize Leaflet Map
function showResults() {
  screenQuiz.classList.add('d-none');
  screenResult.classList.remove('d-none');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  // Allow DOM to settle before rendering map on mobile
  setTimeout(() => {
    if (!map) {
      map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: false // Prevents accidental scrolling on mobile
      }).setView([47.612, -122.27], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);
    }

    // Force map to recalculate container width on phone screens
    map.invalidateSize();
    dropPinsSequentially();
  }, 400);
}

// Sequential Map Pin Animation (Only displays location names)
function dropPinsSequentially() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  mapStatus.textContent = "";

  PLACES_IN_ORDER.forEach((place, index) => {
    setTimeout(() => {
      map.flyTo(place.coords, 12, { duration: 1 });

      const marker = L.marker(place.coords).addTo(map);
      const popupContent = `
        <div class="px-2 py-1">
          <h6 class="fw-bold mb-0 text-white">${place.name}</h6>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      setTimeout(() => marker.openPopup(), 400);
      markers.push(marker);
    }, index * 1500);
  });
}

replayMapBtn.addEventListener('click', dropPinsSequentially);

restartBtn.addEventListener('click', () => {
  screenResult.classList.add('d-none');
  screenIntro.classList.remove('d-none');
});
