/* script.js */

// --- STATE MANAGEMENT ---
const appState = {
    mode: 'array', // 'array' | 'stack'
    challengeMode: false,
    data: [], // Array of { id: string, val: number/string }

    // Playback Engine
    frames: [],
    currentStep: 0,
    isPlaying: false,
    speed: 3, // 1 to 5

    // Challenge state
    score: 0,
    streak: 0
};

// Utilities
function generateId() { return `item-${Math.random().toString(36).substr(2, 9)}`; }
const getDelayTime = () => 1600 - (appState.speed * 300);
const delay = () => new Promise(res => setTimeout(res, getDelayTime()));

// --- DOM ELEMENTS ---
const elements = {
    modeBtns: document.querySelectorAll('.nav-btn'),
    challengeToggle: document.getElementById('challenge-mode-toggle'),
    mobileDrawerBtn: document.getElementById('mobile-drawer-btn'),
    closeDrawerBtn: document.getElementById('close-drawer-btn'),
    rightPanel: document.getElementById('intelligence-panel'),
    arrayControls: document.getElementById('array-controls'),
    stackControls: document.getElementById('stack-controls'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    btnNext: document.getElementById('btn-next'),
    btnPrev: document.getElementById('btn-prev'),
    btnReset: document.getElementById('btn-reset'),
    speedSlider: document.getElementById('speed-slider'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    canvas: document.getElementById('canvas-container'),
    operationBadge: document.getElementById('operation-badge'),
    operationText: document.getElementById('operation-text'),
    stepExplainer: document.getElementById('step-explainer'),
    varGrid: document.getElementById('variables-grid'),
    timeComplex: document.getElementById('time-complex'),
    spaceComplex: document.getElementById('space-complex'),
    opCount: document.getElementById('op-count'),
    toastContainer: document.getElementById('toast-container'),

    // Array Inputs
    arrayInput: document.getElementById('array-input'),
    indexInput: document.getElementById('index-input'),
    btnArrInsert: document.getElementById('btn-array-insert'),
    btnArrDelete: document.getElementById('btn-array-delete'),
    btnArrLinear: document.getElementById('btn-array-linear'),
    btnArrBinary: document.getElementById('btn-array-binary'),
    btnArrRandom: document.getElementById('btn-array-random'),
    btnArrSorted: document.getElementById('btn-array-sorted'),

    // Stack Inputs
    stackInput: document.getElementById('stack-input'),
    btnStkPush: document.getElementById('btn-stack-push'),
    btnStkPop: document.getElementById('btn-stack-pop'),
    btnStkPeek: document.getElementById('btn-stack-peek'),
    btnStkClear: document.getElementById('btn-stack-clear'),

    // Challenge UI
    challengeOverlay: document.getElementById('challenge-overlay'),
    challengeQuestion: document.getElementById('challenge-question'),
    challengeOptions: document.getElementById('challenge-options'),
    scoreDisplay: document.getElementById('score-display'),
    streakDisplay: document.getElementById('streak-display')
};

// --- INITIALIZATION ---
function init() {
    setupEventListeners();
    resetState();
}

function setupEventListeners() {
    // Mode Switcher
    elements.modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            elements.modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            setMode(e.target.dataset.mode);
        });
    });

    elements.mobileDrawerBtn.addEventListener('click', () => elements.rightPanel.classList.add('drawer-open'));
    elements.closeDrawerBtn.addEventListener('click', () => elements.rightPanel.classList.remove('drawer-open'));

    elements.challengeToggle.addEventListener('change', (e) => {
        appState.challengeMode = e.target.checked;
        showToast(appState.challengeMode ? "Challenge Mode Activated" : "Challenge Mode Disabled", "success");
        if (!appState.challengeMode) elements.challengeOverlay.classList.add('hidden');
    });

    elements.speedSlider.addEventListener('input', (e) => appState.speed = parseInt(e.target.value));

    // Playback Controls
    elements.btnPlayPause.addEventListener('click', playPause);
    elements.btnNext.addEventListener('click', stepNext);
    elements.btnPrev.addEventListener('click', stepPrev);
    elements.btnReset.addEventListener('click', resetState);

    // Array Operations
    elements.btnArrInsert.addEventListener('click', () => {
        const val = parseInt(elements.arrayInput.value);
        let idx = parseInt(elements.indexInput.value);
        if (isNaN(val)) return showToast('Enter a valid value', 'error');
        if (isNaN(idx)) idx = appState.data.length; // end append
        executeArrayInsert(val, idx);
    });

    elements.btnArrDelete.addEventListener('click', () => {
        const idx = parseInt(elements.indexInput.value);
        if (isNaN(idx)) return showToast('Enter an index to delete', 'error');
        executeArrayDelete(idx);
    });

    elements.btnArrLinear.addEventListener('click', () => {
        const val = parseInt(elements.arrayInput.value);
        if (isNaN(val)) return showToast('Enter a value to search', 'error');
        executeLinearSearch(val);
    });

    elements.btnArrBinary.addEventListener('click', () => {
        const val = parseInt(elements.arrayInput.value);
        if (isNaN(val)) return showToast('Enter a value to search', 'error');
        executeBinarySearch(val);
    });

    elements.btnArrRandom.addEventListener('click', () => {
        const count = Math.floor(Math.random() * 5) + 5;
        appState.data = Array.from({ length: count }, () => ({ id: generateId(), val: Math.floor(Math.random() * 99) + 1 }));
        renderBaseData();
    });

    elements.btnArrSorted.addEventListener('click', () => {
        const count = 10;
        let arr = Array.from({ length: count }, () => ({ id: generateId(), val: Math.floor(Math.random() * 99) + 1 }));
        arr.sort((a, b) => a.val - b.val);
        appState.data = arr;
        renderBaseData();
    });

    // Stack Operations
    elements.btnStkPush.addEventListener('click', () => {
        const val = parseInt(elements.stackInput.value);
        if (isNaN(val)) return showToast('Enter a value to push', 'error');
        executeStackPush(val);
    });
    elements.btnStkPop.addEventListener('click', executeStackPop);
    elements.btnStkPeek.addEventListener('click', executeStackPeek);
    elements.btnStkClear.addEventListener('click', () => {
        appState.data = [];
        renderBaseData();
    });
}

function setMode(mode) {
    appState.mode = mode;
    elements.arrayControls.style.display = mode === 'array' ? 'block' : 'none';
    elements.stackControls.style.display = mode === 'stack' ? 'block' : 'none';
    resetState();
    showToast(`Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`, 'success');
}

function resetState() {
    appState.isPlaying = false;
    appState.frames = [];
    appState.currentStep = 0;
    elements.challengeOverlay.classList.add('hidden');

    if (appState.mode === 'array') {
        const raw = [10, 25, 42, 5, 17];
        appState.data = raw.map(val => ({ id: generateId(), val }));
    } else {
        const raw = [42, 25, 10];
        appState.data = raw.map(val => ({ id: generateId(), val }));
    }

    updatePlayPauseUI();
    updateIntelligencePanel({ action: 'IDLE', message: 'System reset. Ready for input.', variables: {}, stats: { time: '-', space: '-', ops: 0 } });
    renderBaseData();
}

function showToast(message, type = 'default') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- PLAYBACK ENGINE ---
async function runPlayback() {
    while (appState.isPlaying && appState.currentStep < appState.frames.length) {
        const frame = appState.frames[appState.currentStep];
        await renderFrame(frame);

        if (appState.challengeMode && frame.challenge) {
            appState.isPlaying = false;
            updatePlayPauseUI();
            triggerChallenge(frame.challenge);
            break;
        }

        await delay();
        if (!appState.isPlaying) break;

        appState.currentStep++;
    }

    if (appState.currentStep >= appState.frames.length) {
        appState.isPlaying = false;
        updatePlayPauseUI();
    }
}

function playPause() {
    if (appState.frames.length === 0) return showToast('No operation active', 'error');
    if (appState.currentStep >= appState.frames.length) appState.currentStep = 0;
    appState.isPlaying = !appState.isPlaying;
    updatePlayPauseUI();
    if (appState.isPlaying) runPlayback();
}

async function stepNext() {
    appState.isPlaying = false;
    updatePlayPauseUI();
    elements.challengeOverlay.classList.add('hidden');
    if (appState.currentStep < appState.frames.length - 1) {
        appState.currentStep++;
        await renderFrame(appState.frames[appState.currentStep]);
    }
}

async function stepPrev() {
    appState.isPlaying = false;
    updatePlayPauseUI();
    elements.challengeOverlay.classList.add('hidden');
    if (appState.currentStep > 0) {
        appState.currentStep--;
        await renderFrame(appState.frames[appState.currentStep]);
    }
}

// --- RENDERER ---
function renderBaseData() {
    renderFrame({ state: appState.data, activeIndices: [], action: 'IDLE', stats: {}, variables: {} });
}

async function renderFrame(frame) {
    if (!frame) return;
    updateIntelligencePanel(frame);

    elements.canvas.innerHTML = '';
    const container = document.createElement('div');
    container.id = 'ds-container';

    if (appState.mode === 'array') {
        container.className = 'array-container';
        frame.state.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'array-element';
            el.id = item.id;
            el.textContent = item.val;

            const activeDef = frame.activeIndices.find(a => a.idx === idx);
            if (activeDef) el.classList.add(`state-${activeDef.type}`);

            const indexLabel = document.createElement('span');
            indexLabel.className = 'index-label';
            indexLabel.textContent = idx;
            el.appendChild(indexLabel);
            container.appendChild(el);
        });
    } else {
        container.className = 'stack-container';
        frame.state.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'stack-element';
            el.id = item.id;
            el.textContent = item.val;

            const activeDef = frame.activeIndices.find(a => a.idx === idx);
            if (activeDef) el.classList.add(`state-${activeDef.type}`);
            container.appendChild(el);
        });
    }

    elements.canvas.appendChild(container);
    // Simple basic DOM swap. If we want FLIP, we can apply it here, but rewriting innerHTML prevents standard FLIP easily.
    // Given scope, re-creating DOM allows clean animations if CSS transitions are well defined. 
    // Notice elements recreate, so no FLIP translation for now. CSS transform transitions handle hover/active smoothly.
}

function updatePlayPauseUI() {
    if (appState.isPlaying) {
        elements.playIcon.style.display = 'none';
        elements.pauseIcon.style.display = 'block';
    } else {
        elements.playIcon.style.display = 'block';
        elements.pauseIcon.style.display = 'none';
    }
}

function updateIntelligencePanel(frame) {
    if (frame.action) {
        elements.operationBadge.className = frame.action === 'IDLE' ? 'operation-badge state-idle' : 'operation-badge state-active';
        elements.operationText.textContent = frame.action;
    }
    if (frame.message) elements.stepExplainer.textContent = frame.message;

    if (frame.stats) {
        if (frame.stats.time) elements.timeComplex.textContent = frame.stats.time;
        if (frame.stats.space) elements.spaceComplex.textContent = frame.stats.space;
        if (frame.stats.ops !== undefined) elements.opCount.textContent = frame.stats.ops;
    }

    if (frame.variables) {
        elements.varGrid.innerHTML = '';
        const keys = Object.keys(frame.variables);
        if (keys.length === 0) {
            elements.varGrid.innerHTML = '<div class="var-item"><span class="var-name">-</span><span class="var-value mono">-</span></div>';
        } else {
            for (const [key, val] of Object.entries(frame.variables)) {
                let displayVal = val !== undefined ? val : '-';
                elements.varGrid.innerHTML += `<div class="var-item"><span class="var-name">${key}</span><span class="var-value mono">${displayVal}</span></div>`;
            }
        }
    }
}

// --- CHALLENGE SYSTEM ---
function triggerChallenge(challenge) {
    elements.challengeOverlay.classList.remove('hidden');
    elements.challengeQuestion.textContent = challenge.question;
    elements.challengeOptions.innerHTML = '';

    challenge.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'challenge-btn';
        btn.textContent = opt.text;
        btn.onclick = () => {
            if (opt.correct) {
                btn.classList.add('correct');
                appState.score += 100 * appState.streak;
                appState.streak++;
                showToast("Correct! +Points", "success");
            } else {
                btn.classList.add('wrong');
                appState.streak = 1;
                showToast("Incorrect prediction.", "error");
            }
            elements.scoreDisplay.textContent = appState.score;
            elements.streakDisplay.textContent = appState.streak;

            setTimeout(() => {
                elements.challengeOverlay.classList.add('hidden');
                appState.isPlaying = true;
                updatePlayPauseUI();
                runPlayback();
            }, 1000);
        };
        elements.challengeOptions.appendChild(btn);
    });
}

// ============================================
// --- DATA STRUCTURE ALGORITHMS (FRAMES GEN) ---
// ============================================

function startOperation(frames) {
    appState.frames = frames;
    appState.currentStep = 0;
    appState.isPlaying = true;
    updatePlayPauseUI();
    runPlayback();
}

// Array Operations
function executeArrayInsert(val, index) {
    if (appState.data.length >= 10) return showToast('Array full limit (10)', 'error');
    if (index < 0 || index > appState.data.length) return showToast('Index out of bounds', 'error');

    const frames = [];
    const state = [...appState.data];
    let ops = 0;

    frames.push({
        state: [...state], activeIndices: [], action: 'INSERT',
        message: `Attempting to insert ${val} at index ${index}`,
        stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { idx: index, val }
    });

    for (let i = state.length; i > index; i--) {
        ops++;
        frames.push({
            state: [...state], activeIndices: [{ idx: i - 1, type: 'active' }], action: 'SHIFT',
            message: `Shifting element at ${i - 1} right to make space.`,
            stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { i, 'i-1': i - 1 }
        });
        state[i] = state[i - 1];
        frames.push({
            state: [...state], activeIndices: [{ idx: i, type: 'found' }], action: 'SHIFT',
            message: `Element shifted.`,
            stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { i }
        });
    }

    ops++;
    state[index] = { id: generateId(), val };
    frames.push({
        state: [...state], activeIndices: [{ idx: index, type: 'target' }], action: 'INSERT COMLPETE',
        message: `Value ${val} safely inserted.`,
        stats: { time: 'O(N)', space: 'O(1)', ops }, variables: {}
    });

    appState.data = state;
    startOperation(frames);
}

function executeArrayDelete(index) {
    if (index < 0 || index >= appState.data.length) return showToast('Invalid index', 'error');
    const frames = [];
    const state = [...appState.data];
    let ops = 0;

    frames.push({
        state: [...state], activeIndices: [{ idx: index, type: 'target' }], action: 'DELETE',
        message: `Targeting index ${index} for deletion.`,
        stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { idx: index }
    });

    for (let i = index; i < state.length - 1; i++) {
        ops++;
        frames.push({
            state: [...state], activeIndices: [{ idx: i + 1, type: 'active' }], action: 'SHIFT',
            message: `Shifting element at ${i + 1} left to fill gap.`,
            stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { i }
        });
        state[i] = state[i + 1];
        frames.push({
            state: [...state], activeIndices: [{ idx: i, type: 'found' }], action: 'SHIFT',
            message: `Element shifted.`,
            stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { i }
        });
    }

    state.pop();
    ops++;
    frames.push({
        state: [...state], activeIndices: [], action: 'DELETE COMPLETE',
        message: `Last element removed. Array size is now ${state.length}.`,
        stats: { time: 'O(N)', space: 'O(1)', ops }, variables: {}
    });

    appState.data = state;
    startOperation(frames);
}

function executeLinearSearch(target) {
    const frames = [];
    let ops = 0;
    let found = false;

    frames.push({
        state: appState.data, activeIndices: [], action: 'SEARCH',
        message: `Starting Linear Search for value ${target}. Checking element by element.`,
        stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { target }
    });

    for (let i = 0; i < appState.data.length; i++) {
        ops++;
        const isMatch = appState.data[i].val === target;

        const challenge = (appState.data.length > 2 && i === Math.floor(appState.data.length / 2)) ? {
            question: `Is the current element (${appState.data[i].val}) the target (${target})?`,
            options: [
                { text: 'Yes', correct: isMatch },
                { text: 'No', correct: !isMatch }
            ]
        } : null;

        frames.push({
            state: appState.data, activeIndices: [{ idx: i, type: 'active' }], action: 'COMPARE',
            message: `Checking index ${i}. Value is ${appState.data[i].val}. Target is ${target}.`,
            stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { target, i, val: appState.data[i].val },
            challenge
        });

        if (isMatch) {
            frames.push({
                state: appState.data, activeIndices: [{ idx: i, type: 'target' }], action: 'FOUND',
                message: `Match found at index ${i}! Search complete.`,
                stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { result: i }
            });
            found = true;
            break;
        }
    }

    if (!found) {
        frames.push({
            state: appState.data, activeIndices: [], action: 'NOT FOUND',
            message: `Value ${target} was not found in the array.`,
            stats: { time: 'O(N)', space: 'O(1)', ops }, variables: { result: -1 }
        });
    }

    startOperation(frames);
}

function executeBinarySearch(target) {
    const frames = [];
    let ops = 0;

    // Check sorted first
    const isSorted = appState.data.every((val, i, arr) => !i || (val.val >= arr[i - 1].val));
    if (!isSorted) {
        return showToast('Array must be sorted for Binary Search. Click "Sorted Data".', 'error');
    }

    let left = 0;
    let right = appState.data.length - 1;
    let found = false;

    frames.push({
        state: appState.data, activeIndices: [], action: 'BIN SEARCH',
        message: `Starting Binary Search for ${target}.`,
        stats: { time: 'O(log N)', space: 'O(1)', ops }, variables: { target, left, right }
    });

    while (left <= right) {
        ops++;
        let mid = Math.floor((left + right) / 2);
        let midVal = appState.data[mid].val;

        frames.push({
            state: appState.data, activeIndices: [
                { idx: left, type: 'active' }, { idx: right, type: 'active' }, { idx: mid, type: 'found' }
            ], action: 'CALC MID',
            message: `Left: ${left}, Right: ${right}. Calculating Mid = floor((${left}+${right})/2) = ${mid}.`,
            stats: { time: 'O(log N)', space: 'O(1)', ops }, variables: { target, left, right, mid, 'arr[mid]': midVal },
        });

        const challenge = {
            question: `Target is ${target}, Mid value is ${midVal}. What will happen to the bounds?`,
            options: [
                { text: 'Left = Mid + 1', correct: target > midVal },
                { text: 'Right = Mid - 1', correct: target < midVal },
                { text: 'Match Found', correct: target === midVal }
            ]
        };

        frames.push({
            state: appState.data, activeIndices: [{ idx: mid, type: 'found' }], action: 'COMPARE',
            message: `Comparing target (${target}) with mid value (${midVal}).`,
            stats: { time: 'O(log N)', space: 'O(1)', ops }, variables: { target, left, right, mid, 'arr[mid]': midVal },
            challenge
        });

        if (midVal === target) {
            frames.push({
                state: appState.data, activeIndices: [{ idx: mid, type: 'target' }], action: 'FOUND',
                message: `Match found at index ${mid}!`,
                stats: { time: 'O(log N)', space: 'O(1)', ops }, variables: { target, result: mid }
            });
            found = true;
            break;
        } else if (target > midVal) {
            left = mid + 1;
            frames.push({
                state: appState.data, activeIndices: [], action: 'NARROW',
                message: `${target} is greater than ${midVal}. Discarding left half. Left becomes ${left}.`,
                stats: { time: 'O(log N)', space: 'O(1)', ops }, variables: { target, left, right }
            });
        } else {
            right = mid - 1;
            frames.push({
                state: appState.data, activeIndices: [], action: 'NARROW',
                message: `${target} is less than ${midVal}. Discarding right half. Right becomes ${right}.`,
                stats: { time: 'O(log N)', space: 'O(1)', ops }, variables: { target, left, right }
            });
        }
    }

    if (!found) {
        frames.push({
            state: appState.data, activeIndices: [], action: 'NOT FOUND',
            message: `Search boundaries crossed (Left > Right). Target not in array.`,
            stats: { time: 'O(log N)', space: 'O(1)', ops }, variables: { left, right, result: -1 }
        });
    }

    startOperation(frames);
}

// Stack Operations
function executeStackPush(val) {
    if (appState.data.length >= 8) return showToast('Stack Overflow! Max 8 items.', 'error');

    const frames = [];
    const state = [...appState.data];
    let ops = 0;

    frames.push({
        state: [...state], activeIndices: [], action: 'PUSH',
        message: `Attempting to PUSH value ${val} onto the stack.`,
        stats: { time: 'O(1)', space: 'O(1)', ops }, variables: { val, top: state.length - 1 }
    });

    ops++;
    state.push({ id: generateId(), val });

    frames.push({
        state: [...state], activeIndices: [{ idx: state.length - 1, type: 'target' }], action: 'PUSH',
        message: `Value ${val} pushed. New TOP is index ${state.length - 1}.`,
        stats: { time: 'O(1)', space: 'O(1)', ops }, variables: { top: state.length - 1 }
    });

    appState.data = state;
    startOperation(frames);
}

function executeStackPop() {
    if (appState.data.length === 0) return showToast('Stack Underflow! Stack is empty.', 'error');

    const frames = [];
    const state = [...appState.data];
    let ops = 0;
    const topIdx = state.length - 1;
    const val = state[topIdx].val;

    frames.push({
        state: [...state], activeIndices: [{ idx: topIdx, type: 'active' }], action: 'POP',
        message: `Focusing on TOP element (value: ${val}) to prepare for POP.`,
        stats: { time: 'O(1)', space: 'O(1)', ops }, variables: { top: topIdx }
    });

    ops++;
    state.pop();

    frames.push({
        state: [...state], activeIndices: [], action: 'POP',
        message: `Element ${val} popped off the stack. New TOP is index ${state.length - 1}.`,
        stats: { time: 'O(1)', space: 'O(1)', ops }, variables: { top: state.length - 1 }
    });

    appState.data = state;
    startOperation(frames);
}

function executeStackPeek() {
    if (appState.data.length === 0) return showToast('Stack is empty. Nothing to peek.', 'error');

    const frames = [];
    const topIdx = appState.data.length - 1;

    frames.push({
        state: appState.data, activeIndices: [{ idx: topIdx, type: 'target' }], action: 'PEEK',
        message: `Peeking at TOP element. Value is ${appState.data[topIdx].val}.`,
        stats: { time: 'O(1)', space: 'O(1)', ops: 1 }, variables: { top: topIdx }
    });

    startOperation(frames);
}
