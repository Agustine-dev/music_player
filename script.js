let track_index = 0;

let nowPlaying = document.querySelector(".now-playing");
let shuffleBtn = document.querySelector(".shuffleBtn");
let shuffledBtn = document.querySelector(".shuffledBtn");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
let playPause = document.querySelector(".playpause");
let nextBtn = document.querySelector(".next-track");
let prevBtn =  document.querySelector(".prev-track");
let seekSlider = document.querySelector(".seek_slider");
let volumeSlider = document.querySelector(".volume-slider");

let curTime = document.querySelector(".current-time");
let totalDuration = document.querySelector(".total-duration");

//global values
let isPlaying = false;
let updateTimer;

var inp = document.getElementById("get-files")

const addToPlay = () => {
for (let i = 0; i < inp.files.length; i++) {
    const element = inp.files[i];
    const reader = new FileReader();

    reader.addEventListener("load", (ev) => {
        const result = ev.target.result;
    });

    reader.addEventListener("progress", (ev) => {
        if(ev.loaded && ev.total) {
            const percent = (ev.loaded) / (ev.total) * 100
            console.log(`Progress here: ${Math.round(percent)}`)
        }
    })

    reader.readAsDataURL(element);
}
};

shuffleBtn.addEventListener("click", () => {
    if(confirm("Do you want to shuffle playlist?")) {
        shuffle(track_list);
        shuffleBtn.classList.add("d-none");
        shuffledBtn.classList.remove("d-none");    
    } else {
        alert("Top tier playlist right here")
    }
});

shuffledBtn.addEventListener("click", () => {
    window.location.reload();
})

//Create the audio element of the player
let curr_track = document.createElement('audio')
let track_list = [
    {
        name:"Beautiful",
        artist: "Nyashinski",
        image_url: "",
        path: "sample/beautiful.m4a"
    },
    {
        name:"Omo Ope",
        artist: "Asake ft Buju",
        image_url: "",
        path: "sample/Omo Ope.mp3"

    },
    {
        name:"Loyal",
        artist: "Magixx",
        image_url: "../hanson.jpg",
        path: "sample/loyal.mp3"

    },
    {
        name:"Jolie",
        artist: "Khalid",
        image_url: "../hanson.jpg",
        path: "sample/Jolie.m4a"

    },
    {
        name:"ShowMan",
        artist: "Nyashinski",
        image_url: "../hanson.jpg",
        path: "sample/showman.m4a"
    }
]

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }

    return array;
}


function  loadTrack(track_index) {
    //clear previous timer
    clearInterval(updateTimer);
    resetValues();

    //load new track

    curr_track.src = track_list[track_index].path
    curr_track.load();

    //update details of track
    track_art.style.backgroundImage = "url(" + track_list[track_index].image_url +")";
    track_name.textContent = track_list[track_index].name;
    track_artist.textContent = track_list[track_index].artist;
    // nowPlaying.textContent = "Playing " + (track_index + 1) + " OF " + track_list.length

    //set an interval of 1000 milliseconds
    //for updating the seek slider

    updateTimer = setInterval(seekUpdate, 1000);

    //play next on track end

    curr_track.addEventListener("ended", nextTrack);

    //apply random background-color
    random_bg_color();

}


function random_bg_color() {
    //Get a random number between 64 and 256
    // (to get lighter colors)
    let mArr = [];
    let color1 = '';
    let color2 = '';
    let color3 = '';
    let color4 = '';
    let color5 = '';
    let color6 = '';
    let color7 = '';
    let color8 = '';
    let color9 = '';
    let color10 = '';
    let color11 = '';

    for (let i = 0; i < 12; i++) {
        const arr = [];
        while (arr.length < 3) {
            let r = Math.floor(Math.random() * 256) + 32;
            arr.push(r);
            if(arr.length >= 3) {
                mArr.push(arr)
                color1 = `rgb(${mArr[0]})`;
                color2 = `rgb(${mArr[1]})`;
                color3 = `rgb(${mArr[2]})`;
                color4 = `rgb(${mArr[3]})`;
            }
        }
    }


document.body.style.background = `no-repeat linear-gradient(300deg, ${color1}, ${color2}, ${color3},${color4})`;

    
}

function resetValues() {
    curTime.textContent = "00:00";
    totalDuration.textContent = "00:00";
    seekSlider.value = 0;
}

function playPauseTrack() {
    //Switch between playing an dpausing depending on state
    if(!isPlaying) playTrack();
     else pauseTrack();
}

function playTrack() {
    //play the loaded track
    curr_track.play();
    isPlaying = true;

    playPause.textContent = 'Pause'
}

function pauseTrack() {
    //pause Loaded Track
    curr_track.pause();
    isPlaying = false;
    //replace text
    playPause.textContent = "Play"
}

function nextTrack() {
    //Go Back to first Track if last one is current playing
    if(track_index < track_list.length - 1){
        track_index +=1
    } else {
        track_index = 0
    }

    //load and play new Track
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    //Go back to the last track
    if(track_index > 0) track_index -= 1;
     else track_index = track_list.length - 1;

    loadTrack(track_index)
    playTrack();
}

function seekTo() {
    //calculate seek position by percentage of seek slider
    seekto = curr_track.duration * (seekSlider.value/100);
    //set the current track position to the calcuated seek position
    curr_track.currentTime = seekto;
}

function setVolume() {
    //Set the volume according to the percentage of the volume slider set

    curr_track.volume = volumeSlider.value / 100;
}
function seekUpdate() {
    let seekPosition = 0;

    //check whether number is elligible
    if(!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seekSlider.value = seekPosition;


        //calculate the time left and total duration
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration/60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        // add a zero to the single digit time values
        if(currentSeconds < 10) {
            currentSeconds =  "0" + currentSeconds;
        }
        if(durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        if(currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }
        if(durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }

        //display the updated duration
        curTime.textContent = currentMinutes+ ":" + currentSeconds;
        totalDuration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

loadTrack(track_index);



