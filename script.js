
const notesInput = document.getElementById('notesInput');
const charCount = document.getElementById('charCount');
const inputWarning = document.getElementById('inputWarning');
const themeToggle = document.getElementById('themeToggle');

notesInput.addEventListener('input', () => {
    const length = notesInput.value.length;

    charCount.textContent = `${length} / 15000 characters`;

    if (length > 14000) {
        inputWarning.textContent = 'You are approaching the character limit.';
    } else {
        inputWarning.textContent = '';
    }
});

const savedTheme = localStorage.getItem('studymate_theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀';
} else {
    themeToggle.textContent = '☾';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    const isDark = document.body.classList.contains('dark-theme');

    localStorage.setItem('studymate_theme', isDark ? 'dark' : 'light');

    themeToggle.textContent = isDark ? '☀' : '☾';
});



const settingsToggle = document.getElementById('settingsToggle');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const apiKeyStatus = document.getElementById('apiKeyStatus');

settingsToggle.addEventListener('click', () => {
    settingsOverlay.hidden = false;
});

closeSettingsBtn.addEventListener('click', () => {
    settingsOverlay.hidden = true;
});

settingsOverlay.addEventListener('click', (event) => {
    if (event.target === settingsOverlay) {
        settingsOverlay.hidden = true;
    }
});

apiKeyInput.value = localStorage.getItem('studymate_api_key') || '';

saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        apiKeyStatus.textContent = 'Please enter your API key.';
        apiKeyStatus.style.color = 'var(--danger)';
        return;
    }

    try {
        localStorage.setItem('studymate_api_key', apiKey);
        apiKeyStatus.textContent = 'API key saved successfully.';
        apiKeyStatus.style.color = 'var(--accent)';
    } catch (error) {
        apiKeyStatus.textContent = 'Unable to save your API key.';
        apiKeyStatus.style.color = 'var(--danger)';
    }
});



const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = {
    summary: document.getElementById('summaryTab'),
    quiz: document.getElementById('quizTab'),
    flashcards: document.getElementById('flashcardsTab')
};

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedTab = button.dataset.tab;

        tabButtons.forEach(tab => {
            tab.classList.remove('active');
        });

        button.classList.add('active');

        Object.entries(tabContents).forEach(([name, content]) => {
            content.hidden = name !== selectedTab;
            content.classList.toggle('active', name === selectedTab);
        });
    });
});



const toast = document.getElementById('toast');

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}



document.querySelectorAll('.headline-word').forEach(word => {
    const english = word.textContent.trim();
    const hindi = word.dataset.hi;

    word.innerHTML = `
        <span class="word-face word-en">${english}</span>
        <span class="word-face word-hi">${hindi}</span>
    `;

    word.addEventListener('mouseenter', () => {
        word.classList.add('is-hindi');
    });

    word.addEventListener('mouseleave', () => {
        word.classList.remove('is-hindi');
    });

    word.addEventListener('click', () => {
        word.classList.toggle('is-hindi');
    });

    word.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            word.classList.toggle('is-hindi');
        }
    });

    word.setAttribute('tabindex', '0');
});

const generateBtn = document.getElementById('generateBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

let studyMaterial = null;

async function generateStudyMaterial() {
    const notes = notesInput.value.trim();
    const apiKey = localStorage.getItem('studymate_api_key');
    const style = document.getElementById('styleSelect').value;
    const difficulty = document.getElementById('difficultySelect').value;

    if (!notes) {
        showToast('Please enter your notes first.');
        notesInput.focus();
        return;
    }

    if (!apiKey) {
        showToast('Please save your Gemini API key in Settings.');
        return;
    }

    generateBtn.disabled = true;
    loadingOverlay.hidden = false;

    try {
        const prompt = `You are an expert AI study assistant.
                        Create study material from the following notes.
                        Explanation style: ${style}
                        Quiz difficulty: ${difficulty}

                        Return:
                        1. A clear, well-structured summary.
                        2. Exactly 5 multiple-choice questions.
                        3. Exactly 8 flashcards.
                        
                        For each quiz question:
                        - Provide exactly 4 answer options.
                        - Give the correct answer as a zero-based index (0, 1, 2 or 3).
                        - Include a short explanation.
                        
                        For each flashcard:
                        - Provide a concise front and back.
                        
                        Use only information supported by the supplied notes.
                        Do not invent facts.
                        
                        STUDY NOTES:
                        ${notes}
                        `;

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: 'OBJECT',
                            properties: {
                                summary: { type: 'STRING' },
                                quiz: {
                                    type: 'ARRAY',
                                    minItems: 5,
                                    maxItems: 5,
                                    items: {
                                        type: 'OBJECT',
                                        properties: {
                                            question: { type: 'STRING' },
                                            options: {
                                                type: 'ARRAY',
                                                minItems: 4,
                                                maxItems: 4,
                                                items: { type: 'STRING' }
                                            },
                                            correctAnswer: {
                                                type: 'INTEGER'
                                            },
                                            explanation: { type: 'STRING' }
                                        },
                                        required: [
                                            'question',
                                            'options',
                                            'correctAnswer',
                                            'explanation'
                                        ]
                                    }
                                },
                                flashcards: {
                                    type: 'ARRAY',
                                    minItems: 8,
                                    maxItems: 8,
                                    items: {
                                        type: 'OBJECT',
                                        properties: {
                                            front: { type: 'STRING' },
                                            back: { type: 'STRING' }
                                        },
                                        required: ['front', 'back']
                                    }
                                }
                            },
                            required: ['summary', 'quiz', 'flashcards']
                        }
                    }
                })
            }
        );

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Invalid API key or API access denied.');
            }

            if (response.status === 429) {
                throw new Error('API quota exceeded. Check your Gemini usage limits.');
            }

            if (response.status === 503) {
                    throw new Error('Gemini is temporarily overloaded. Please wait a minute and try again.');
}

            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();

        const generatedText = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || '')
            .join('');

        if (!generatedText) {
            throw new Error('The AI returned an empty response.');
        }

        const result = JSON.parse(generatedText);

        if (
            typeof result.summary !== 'string' ||
            !result.summary.trim() ||
            !Array.isArray(result.quiz) ||
            result.quiz.length !== 5 ||
            !Array.isArray(result.flashcards) ||
            result.flashcards.length !== 8
        ) {
            throw new Error('The AI response has an invalid structure.');
        }

        const validQuiz = result.quiz.every(question =>
            typeof question.question === 'string' &&
            Array.isArray(question.options) &&
            question.options.length === 4 &&
            question.options.every(option => typeof option === 'string') &&
            Number.isInteger(question.correctAnswer) &&
            question.correctAnswer >= 0 &&
            question.correctAnswer <= 3 &&
            typeof question.explanation === 'string'
        );

        const validFlashcards = result.flashcards.every(card =>
            typeof card.front === 'string' &&
            card.front.trim() &&
            typeof card.back === 'string' &&
            card.back.trim()
        );

        if (!validQuiz || !validFlashcards) {
            throw new Error('Some generated study material is invalid.');
        }

        studyMaterial = result;
        renderStudyMaterial(studyMaterial);
        saveStudySession(result, notes, style, difficulty);
        document.getElementById('resultsSection').hidden = false;
        document.getElementById('resultsSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
        });

        console.log('Generated study material:', studyMaterial);
        showToast('Study material generated successfully!');

    } catch (error) {
        console.error('Generation error:', error);
        showToast(error.message || 'Something went wrong. Please try again.');
    } finally {
        generateBtn.disabled = false;
        loadingOverlay.hidden = true;
    }
}

generateBtn.addEventListener('click', generateStudyMaterial);

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);
}


let currentFlashcardIndex = 0;
let knownFlashcards = new Set();
let unknownFlashcards = new Set();
let quizSubmitted = false;

function renderStudyMaterial(data) {
    const summaryContent = document.getElementById('summaryContent');
    const quizContent = document.getElementById('quizContent');
    const speakBtn = document.getElementById('speakBtn');

    if (speakBtn) speakBtn.hidden = true;

    summaryContent.innerHTML = `
        <div class="generated-summary">
            ${escapeHTML(data.summary).replace(/\n/g, '<br>')}
        </div>
    `;

    quizSubmitted = false;

    quizContent.innerHTML = data.quiz.map((question, index) => `
        <div class="quiz-question" data-question="${index}">
            <h3>${index + 1}. ${escapeHTML(question.question)}</h3>
            <div class="quiz-options">
                ${question.options.map((option, optionIndex) => `
                    <label class="quiz-option">
                        <input type="radio" name="question-${index}" value="${optionIndex}">
                        <span>${escapeHTML(option)}</span>
                    </label>
                `).join('')}
            </div>
            <div class="quiz-explanation" id="explanation-${index}" hidden>
                ${escapeHTML(question.explanation)}
            </div>
        </div>
    `).join('');

    document.getElementById('quizScore').hidden = true;
    document.getElementById('submitQuizBtn').disabled = false;
    document.getElementById('submitQuizBtn').textContent = 'Check Answers';

    updateQuizProgress();

    currentFlashcardIndex = 0;
    knownFlashcards.clear();
    unknownFlashcards.clear();

    renderFlashcard();

    document.getElementById('resultsSection').hidden = false;
}

function updateQuizProgress() {
    const answered = studyMaterial.quiz.filter((question, index) =>
        document.querySelector(`input[name="question-${index}"]:checked`)
    ).length;

    document.getElementById('quizProgress').textContent =
        `${answered} / ${studyMaterial.quiz.length} answered`;
}

function checkQuizAnswers() {
    if (quizSubmitted) return;

    const unanswered = studyMaterial.quiz.filter((question, index) =>
        !document.querySelector(`input[name="question-${index}"]:checked`)
    ).length;

    if (unanswered > 0) {
        showToast(`Please answer all ${unanswered} remaining questions.`);
        return;
    }

    let score = 0;

    studyMaterial.quiz.forEach((question, index) => {
        const selected = Number(
            document.querySelector(`input[name="question-${index}"]:checked`).value
        );

        const questionElement = document.querySelector(
            `[data-question="${index}"]`
        );

        const options = questionElement.querySelectorAll('.quiz-option');

        options.forEach((option, optionIndex) => {
            const radio = option.querySelector('input');
            radio.disabled = true;

            if (optionIndex === question.correctAnswer) {
                option.classList.add('correct-answer');
            }

            if (
                optionIndex === selected &&
                selected !== question.correctAnswer
            ) {
                option.classList.add('wrong-answer');
            }
        });

        if (selected === question.correctAnswer) {
            score++;
        }

        const explanation = document.getElementById(`explanation-${index}`);
        explanation.hidden = false;
    });

    quizSubmitted = true;

    const quizScore = document.getElementById('quizScore');
    quizScore.hidden = false;
    quizScore.textContent = `Your score: ${score} / ${studyMaterial.quiz.length}`;

    document.getElementById('submitQuizBtn').textContent = 'Quiz Completed';
    document.getElementById('submitQuizBtn').disabled = true;

    showToast('Quiz checked successfully!');
}

function renderFlashcard() {
    const container = document.getElementById('flashcardContent');
    const card = studyMaterial.flashcards[currentFlashcardIndex];

    container.innerHTML = `
        <div class="flashcard" id="activeFlashcard">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <span>QUESTION ${currentFlashcardIndex + 1}</span>
                    <h3>${escapeHTML(card.front)}</h3>
                    <p>Click to reveal answer</p>
                </div>
                <div class="flashcard-back">
                    <span>ANSWER</span>
                    <h3>${escapeHTML(card.back)}</h3>
                </div>
            </div>
        </div>
    `;

    document.getElementById('activeFlashcard').addEventListener('click', () => {
        document.getElementById('activeFlashcard').classList.toggle('flipped');
    });

    document.getElementById('cardProgress').textContent =
        `Card ${currentFlashcardIndex + 1} of ${studyMaterial.flashcards.length}`;

    document.getElementById('previousCardBtn').disabled =
        currentFlashcardIndex === 0;

    document.getElementById('nextCardBtn').disabled =
        currentFlashcardIndex === studyMaterial.flashcards.length - 1;

    document.getElementById('knownCount').textContent =
        `Known: ${knownFlashcards.size} | Need practice: ${unknownFlashcards.size}`;
}

document.getElementById('flashcardContent').addEventListener('click', event => {
    if (event.target.closest('#activeFlashcard')) return;
});

document.getElementById('previousCardBtn').addEventListener('click', () => {
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        renderFlashcard();
    }
});

document.getElementById('nextCardBtn').addEventListener('click', () => {
    if (currentFlashcardIndex < studyMaterial.flashcards.length - 1) {
        currentFlashcardIndex++;
        renderFlashcard();
    }
});

document.getElementById('knownBtn').addEventListener('click', () => {
    knownFlashcards.add(currentFlashcardIndex);
    unknownFlashcards.delete(currentFlashcardIndex);

    if (currentFlashcardIndex < studyMaterial.flashcards.length - 1) {
        currentFlashcardIndex++;
    }

    renderFlashcard();
});

document.getElementById('unknownBtn').addEventListener('click', () => {
    unknownFlashcards.add(currentFlashcardIndex);
    knownFlashcards.delete(currentFlashcardIndex);

    if (currentFlashcardIndex < studyMaterial.flashcards.length - 1) {
        currentFlashcardIndex++;
    }

    renderFlashcard();
});

document.getElementById('quizContent').addEventListener('change', event => {
    if (event.target.matches('input[type="radio"]')) {
        updateQuizProgress();
    }
});

document.getElementById('submitQuizBtn').addEventListener('click', checkQuizAnswers);


async function copySummary() {
    const summary = studyMaterial?.summary;

    if (!summary) {
        showToast('Generate a summary first.');
        return;
    }

    try {
        await navigator.clipboard.writeText(summary);
        showToast('Summary copied!');
    } catch (error) {
        const textarea = document.createElement('textarea');
        textarea.value = summary;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast('Summary copied!');
    }
}

function downloadSummary() {
    const summary = studyMaterial?.summary;

    if (!summary) {
        showToast('Generate a summary first.');
        return;
    }

    const blob = new Blob([summary], {
        type: 'text/plain;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'StudyMate-Summary.txt';
    link.click();

    URL.revokeObjectURL(url);
    showToast('Summary downloaded!');
}

document.getElementById('copyBtn').addEventListener('click', copySummary);
document.getElementById('downloadBtn').addEventListener('click', downloadSummary);



const HISTORY_KEY = 'studymate_history';

function getStudyHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveStudySession(data, notes, style, difficulty) {
    const history = getStudyHistory();

    const session = {
        id: Date.now(),
        title: notes.trim().split('\n')[0].slice(0, 65),
        notes,
        style,
        difficulty,
        date: new Date().toISOString(),
        material: data
    };

    history.unshift(session);

    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
        renderHistory();
    } catch (error) {
        showToast('Could not save history. Browser storage may be full.');
    }
}

function renderHistory(searchTerm = '') {
    const historyList = document.getElementById('historyList');
    const history = getStudyHistory();

    const filteredHistory = history.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredHistory.length === 0) {
        historyList.innerHTML = `
            <p class="history-empty">
                ${history.length === 0
                    ? 'Your study history will appear here.'
                    : 'No matching sessions found.'}
            </p>
        `;
        return;
    }

    historyList.innerHTML = filteredHistory.map(session => `
        <div class="history-item" data-session-id="${session.id}">
            <div class="history-item-info">
                <h3>${escapeHTML(session.title || 'Untitled session')}</h3>
                <p>${new Date(session.date).toLocaleString()}</p>
                <span>${escapeHTML(session.style)} · ${escapeHTML(session.difficulty)}</span>
            </div>
            <button class="history-open-btn" type="button">
                Open session
            </button>
        </div>
    `).join('');
}

function openHistorySession(id) {
    const session = getStudyHistory().find(item => item.id === Number(id));

    if (!session) {
        showToast('Session not found.');
        return;
    }

    studyMaterial = session.material;

    notesInput.value = session.notes;
    charCount.textContent = `${session.notes.length} / 15000`;

    document.getElementById('styleSelect').value = session.style;
    document.getElementById('difficultySelect').value = session.difficulty;

    renderStudyMaterial(studyMaterial);

    showToast('Previous session restored.');

    document.getElementById('resultsSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

document.getElementById('historyList').addEventListener('click', event => {
    const item = event.target.closest('.history-item');

    if (item) {
        openHistorySession(item.dataset.sessionId);
    }
});

document.getElementById('historySearch').addEventListener('input', event => {
    renderHistory(event.target.value.trim());
});

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    const history = getStudyHistory();

    if (history.length === 0) {
        showToast('Your history is already empty.');
        return;
    }

    if (confirm('Are you sure you want to clear all study history?')) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
        showToast('Study history cleared.');
    }
});

renderHistory();
