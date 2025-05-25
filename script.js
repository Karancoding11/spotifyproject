

let currentSong = new Audio;
let songsList = [];
let currentIndex = 0;

async function getsongs() {
    let res = await fetch("songs.json");
    return await res.json();
}

const playMusic = (track, index) => {
    currentSong.src = "songs/" + track.title;
    currentSong.play();
    currentIndex = index;
    pause.src = "svg/media-pause.svg";
};

async function main() {
    let songs = await getsongs();
    songsList = songs;

    let songsul = document.querySelector(".songlist ul");
    for (const [index, song] of songs.entries()) {
        songsul.innerHTML += `
        <li data-index="${index}">
            <img src="svg/music-note-square-02-stroke-rounded.svg" alt="">
            <div class="info">
                <div class="songName">${song.title.replaceAll("%20", " ")}</div>
                <div class="songArtist">${song.artist}</div>
            </div>
            <div class="playnow"> 
                <span>Play Now</span><img id="playSong" src="svg/play.svg" alt="">
            </div>
        </li>`;
    }

    document.querySelectorAll(".songlist li").forEach((el) => {
        el.addEventListener("click", () => {
            let index = parseInt(el.getAttribute("data-index"));
            playMusic(songsList[index], index);
        });
    });


    // Play/Pause toggle
    pause.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            pause.src = "svg/media-pause.svg";
        } else {
            currentSong.pause();
            pause.src = "svg/play.svg";
        }
    });

    // Previous button
    previous.addEventListener("click", () => {
        if (currentIndex > 0) {
            playMusic(songsList[currentIndex - 1], currentIndex - 1);
        }
    });

    // Next button
    next.addEventListener("click", () => {
        if (currentIndex < songsList.length - 1) {
            playMusic(songsList[currentIndex + 1], currentIndex + 1);
        }
    });

    // Volume control
    const volumeSlider = document.getElementById("volumeSlider");
    volumeSlider.addEventListener("input", () => {
        currentSong.volume = volumeSlider.value;
    });

    // Time update
    currentSong.addEventListener("timeupdate", () => {
        const current = document.getElementById("currentTime");
        const duration = document.getElementById("duration");

        const format = (time) => {
            const min = Math.floor(time / 60);
            const sec = Math.floor(time % 60).toString().padStart(2, "0");
            return `${min}:${sec}`;
        };

        current.innerText = format(currentSong.currentTime);
        duration.innerText = format(currentSong.duration || 0);
    });
}

main();
const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");
const currentTimeElem = document.getElementById("currentTime");
const durationElem = document.getElementById("duration");

let isDragging = false;

function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

// Update circle position and time display as audio plays, only if not dragging
currentSong.addEventListener("timeupdate", () => {
    if (!isDragging && currentSong.duration) {
        const percent = currentSong.currentTime / currentSong.duration;
        circle.style.left = `${percent * 100}%`;
        currentTimeElem.textContent = formatTime(currentSong.currentTime);
        durationElem.textContent = formatTime(currentSong.duration);
    }
});

// Seekbar click to seek
seekbar.addEventListener("click", (e) => {
    const rect = seekbar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;
    circle.style.left = `${percent * 100}%`;
    currentSong.currentTime = percent * currentSong.duration;
});

// Drag circle behavior
circle.addEventListener("mousedown", () => {
    isDragging = true;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", onStopDrag, { once: true });
});

function onDrag(e) {
    const rect = seekbar.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percent = offsetX / rect.width;
    circle.style.left = `${percent * 100}%`;
    // Also update time display as you drag
    currentTimeElem.textContent = formatTime(percent * currentSong.duration);
}

function onStopDrag(e) {
    isDragging = false;
    const rect = seekbar.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percent = offsetX / rect.width;
    currentSong.currentTime = percent * currentSong.duration;

    document.removeEventListener("mousemove", onDrag);
}
// Add this to script.js
