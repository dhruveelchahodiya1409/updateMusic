let currentSong = new Audio();
let songs;
let currFolder;

// SECONDS TO MINUTES FUNCTION
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

// FETCH ALL SONGS
async function getSongs(folder) {
  currFolder = folder;
  let s = await fetch(`http://127.0.0.1:5500/${folder}/`);
  console.log(s);
  let response = await s.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let a = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < a.length; index++) {
    const element = a[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // ADD TO LIST
  // let songLi = document
  //   .querySelector(".songList")
  //   .getElementsByTagName("ul")[0];

  // songLi.innerHTML = "";

  // for (const song of songs) {
  //   songLi.innerHTML =
  //     songLi.innerHTML +
  //     `<li class="flex ">
  //   <img class="invert" src="image/music.svg" alt="" srcset="">
  //   <div class="info">
  //       <div>${song
  //         .replaceAll("%20", " ")
  //         .replaceAll("%2C", ",")
  //         .replaceAll("%5B", "[")
  //         .replaceAll("%5D", "]")
  //         .replaceAll("%23", "#")}</div>
          
  //   </div>
  //   <div class="playNow flex">
  //       <!-- <span>Play Now</span> -->
  //       <img src="image/play.svg" alt="">
  //   </div>
    
  //   </li>`;
  // }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

// PLAY MUSIC
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/Project/Music WebSite/image/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00";
};

// DISPLAY SONG ALBUM

async function displaySongs() {
  let s = await fetch(`http://127.0.0.1:5500/Project/Music%20WebSite/songs/`);
  let response = await s.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  cardContainer = document.querySelector(".cardContainer");
  let as = div.getElementsByTagName("a");
  let array = Array.from(as);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[1];
      let s = await fetch(
        `http://127.0.0.1:5500/Project/Music%20WebSite/songs/${folder}/info.json`
      );
      let response = await s.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder=${folder} class="card rounded">
      <div class="play flex">
        <svg
          width="38px"
          height="38px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="background-color: white"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="black"
            stroke-width="1.5"
          />
          <path
            d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
            stroke="black"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img class="rounded" src="songs/${folder}/cover.png" alt="Hits" srcset="" />
      <h4>${response.title}</h4>
    </div>`;
    }
  }

  // LOAD THE PLAY LIST
  const card = Array.from(document.getElementsByClassName("card"));
  card.forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(
        `Project/Music%20WebSite/songs/${item.currentTarget.dataset.folder}`
      );
      playMusic(songs[0])
    });
  });
}

async function main() {
  songs = await getSongs("Project/Music%20WebSite/songs/PlayList1");
  playMusic(songs[0], true);

  // Diplay Almub
  displaySongs();

  // PLAY PREVIOUS AND NEXT

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/Project/Music WebSite/image/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/Project/Music WebSite/image/play.svg";
    }
  });

  // SEEK BAR TIME UPDATE

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // SEEK BAR CIRCLE

  document.querySelector(".seekBar").addEventListener("click", (e) => {
    document.querySelector(".circle").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentSong.currentTime =
      (currentSong.duration *
        (e.offsetX / e.target.getBoundingClientRect().width) *
        100) /
      100;
  });

  // HAMBURGER ICON

  document.querySelector(".hamburgerClick").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  // CLOSE ICON FOR LEFT
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = -140 + "%";
  });

  // PREVIOUS BTN

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // NEXT BTN
  nextSong.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 > length) {
      playMusic(songs[index + 1]);
    }
  });

  // VOLUME
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // MUTE THE SONG

  mute.addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 20;
    }
  });
}

main();
