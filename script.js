// =========================================================================
// 1. SISTEM PENGESAHAN BORANG HUBUNGI & SIMULASI POP-UP (contact.html)
// =========================================================================

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", function (event) {
            // Sentiasa sekat hantaran asal untuk memproses validasi JS penuh (Kriteria Rubrik 1.8)
            event.preventDefault(); 
            
            let isValid = true;

            // 1.1 Validasi Nama Penuh
            const fullName = document.getElementById("fullName").value.trim();
            const nameError = document.getElementById("nameError");
            if (fullName === "") {
                nameError.textContent = "Please enter your full name.";
                isValid = false;
            } else if (fullName.length < 3) {
                nameError.textContent = "Name must be at least 3 characters long.";
                isValid = false;
            } else {
                nameError.textContent = "";
            }

            // 1.2 Validasi Alamat Emel
            const email = document.getElementById("email").value.trim();
            const emailError = document.getElementById("emailError");
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === "") {
                emailError.textContent = "Please enter your email address.";
                isValid = false;
            } else if (!emailRegex.test(email)) {
                emailError.textContent = "Invalid email format (Example: name@email.com).";
                isValid = false;
            } else {
                emailError.textContent = "";
            }

            // 1.3 Validasi Kata Laluan (Password)
            const password = document.getElementById("password").value.trim();
            const passwordError = document.getElementById("passwordError");
            if (password === "") {
                passwordError.textContent = "Please enter a security password.";
                isValid = false;
            } else if (password.length < 6) {
                passwordError.textContent = "Password must be at least 6 characters long.";
                isValid = false;
            } else {
                passwordError.textContent = "";
            }

            // 1.4 Validasi Tarikh Lahir
            const dob = document.getElementById("dob").value;
            const dobError = document.getElementById("dobError");
            if (dob === "") {
                dobError.textContent = "Please select your date of birth.";
                isValid = false;
            } else {
                dobError.textContent = "";
            }

            // 1.5 Validasi Jantina
            const genderOptions = document.getElementsByName("gender");
            const genderError = document.getElementById("genderError");
            let genderSelected = false;
            for (const option of genderOptions) {
                if (option.checked) {
                    genderSelected = true;
                    break;
                }
            }
            if (!genderSelected) {
                genderError.textContent = "Please select your gender.";
                isValid = false;
            } else {
                genderError.textContent = "";
            }

            // 1.6 Validasi Muat Naik Gambar Profil
            const photo = document.getElementById("profileImage").value;
            const fileError = document.getElementById("fileError");
            if (photo === "") {
                fileError.textContent = "Please upload your profile photo.";
                isValid = false;
            } else {
                fileError.textContent = "";
            }

            // 1.7 Validasi Checkbox Terma & Syarat
            const terms = document.getElementById("terms");
            const termsError = document.getElementById("termsError");
            if (!terms.checked) {
                termsError.textContent = "You must agree to the terms and conditions.";
                isValid = false;
            } else {
                termsError.textContent = "";
            }

            // MODIFIKASI: Jika semua input borang valid, cetus pop-up modal interaktif (Acah-acah Berjaya)
            if (isValid) {
                showSuccessModal();
            }
        });
    }
});

// Fungsi untuk memaparkan Custom Popup Modal
function showSuccessModal() {
    const modal = document.getElementById("successModal");
    if (modal) {
        modal.classList.add("active");
    }
}

// Fungsi untuk menutup Custom Popup Modal dan reset borang
function closeModal() {
    const modal = document.getElementById("successModal");
    const form = document.getElementById("contactForm");
    if (modal) {
        modal.classList.remove("active");
    }
    if (form) {
        form.reset(); // Mengosongkan semula semua input borang selepas ditutup
    }
}


// =========================================================================
// 2. LOGIK PERMAINAN: CODE-THE-PATH MAZE RUNNER (game.html)
// =========================================================================

const mazeLayout = [
    ['S', 'E', 'W', 'E'],  // Baris 0 (S = Mula/Start, E = Kosong/Empty, W = Dinding/Wall)
    ['W', 'E', 'W', 'E'],  // Baris 1
    ['E', 'E', 'E', 'E'],  // Baris 2
    ['E', 'W', 'W', 'F']   // Baris 3 (F = Penamat/Finish)
];

// Kedudukan permulaan asal robot
let robotRow = 0;
let robotCol = 0;
let robotDir = 'DOWN'; // Haluan permulaan: UP, RIGHT, DOWN, LEFT
let isPlaying = false;

function initMaze() {
    const mazeElement = document.getElementById("maze");
    if (!mazeElement) return; // Keluar dari fungsi jika bukan halaman game.html

    mazeElement.innerHTML = ''; // Mengosongkan grid sebelum dijana semula

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            // Menetapkan gaya reka bentuk CSS mengikut jenis petak grid
            if (mazeLayout[r][c] === 'W') cell.classList.add("wall");
            if (mazeLayout[r][c] === 'S') cell.classList.add("start");
            if (mazeLayout[r][c] === 'F') cell.classList.add("end");

            // Memeriksa posisi koordinat semasa robot melangkah
            if (r === robotRow && c === robotCol) {
                // Ikon robot 🤖 akan sentiasa dilukis mengikut posisinya tanpa ghaib
                cell.innerHTML = `<span id="robot" class="robot ${robotDir}">🤖</span>`;
            } else if (mazeLayout[r][c] === 'F') {
                // Paparkan bendera di garisan penamat jika robot belum sampai
                cell.innerHTML = '🏁';
            }

            mazeElement.appendChild(cell);
        }
    }
}

function updateRobotGrid() {
    initMaze();
}

async function runCommands() {
    if (isPlaying) return;
    isPlaying = true;
    
    const input = document.getElementById("commandInput").value.toUpperCase().split('\n');
    const statusText = document.getElementById("gameStatus");
    
    for (let i = 0; i < input.length; i++) {
        let command = input[i].trim();
        if (command === "") continue;

        statusText.textContent = `Executing: ${command}...`;

        if (command === "FORWARD") {
            let nextRow = robotRow;
            let nextCol = robotCol;

            if (robotDir === 'UP') nextRow--;
            if (robotDir === 'DOWN') nextRow++;
            if (robotDir === 'LEFT') nextCol--;
            if (robotDir === 'RIGHT') nextCol++;

            // Memeriksa jika pergerakan melanggar dinding atau terkeluar dari grid sempadan
            if (nextRow >= 0 && nextRow < 4 && nextCol >= 0 && nextCol < 4 && mazeLayout[nextRow][nextCol] !== 'W') {
                robotRow = nextRow;
                robotCol = nextCol;
            } else {
                statusText.textContent = "💥 Crash! The robot hit a wall.";
                isPlaying = false;
                return;
            }
        } else if (command === "LEFT") {
            const dirs = ['UP', 'LEFT', 'DOWN', 'RIGHT'];
            let idx = dirs.indexOf(robotDir);
            robotDir = dirs[(idx + 1) % 4];
        } else if (command === "RIGHT") {
            const dirs = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
            let idx = dirs.indexOf(robotDir);
            robotDir = dirs[(idx + 1) % 4];
        } else {
            statusText.textContent = `❌ Error: Unknown command "${command}".`;
            isPlaying = false;
            return;
        }

        updateRobotGrid();
        await new Promise(resolve => setTimeout(resolve, 600)); // Masa senggang pergerakan (600ms animasi)
    }

    // Memeriksa status akhir setelah semua senarai arahan selesai diproses
    if (mazeLayout[robotRow][robotCol] === 'F') {
        statusText.textContent = "🎉 Congratulations! The robot reached the finish line!";
    } else {
        statusText.textContent = "🛑 Stopped: Robot stopped before reaching the destination.";
    }
    isPlaying = false;
}

function resetGame() {
    robotRow = 0;
    robotCol = 0;
    robotDir = 'DOWN';
    isPlaying = false;
    document.getElementById("gameStatus").textContent = "Status: Game reset successfully.";
    document.getElementById("commandInput").value = "";
    updateRobotGrid();
}

// Menjalankan fungsi labirin secara automatik sebaik sahaja struktur DOM selesai dimuatkan
document.addEventListener("DOMContentLoaded", function() {
    initMaze();
    
    const runBtn = document.getElementById("runBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (runBtn) runBtn.addEventListener("click", runCommands);
    if (resetBtn) resetBtn.addEventListener("click", resetGame);
});