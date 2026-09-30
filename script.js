const birthdayConfig = {
  name: "Dorra",
  nickname: "Dardoura",
  music: "assets/music.mp3",
  finalMessage: [
    "Happy Birthday, Dardoura.",
    "I hope this year is kind to you.",
    "I hope you laugh more, smile more, dream bigger, and find little reasons to be happy even on ordinary days.",
    "You deserve beautiful moments.",
    "And I hope this little surprise gave you one of them.",
    "Stay exactly as beautiful as you are. 🤍"
  ]
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const scenes = {
  intro: $("#intro"),
  room: $("#room"),
  card: $("#cardScene"),
  notes: $("#notes"),
  question: $("#question"),
  cake: $("#cakeScene"),
  gift: $("#giftScene"),
  final: $("#finalScene")
};

let musicOn = false;
let lampOff = false;
let cardOpened = false;
let giftOpened = false;
let notesOpened = 0;
let wishDone = false;
let questionDone = false;
let secretMoonTaps = 0;
let finalTimer;

function showScene(name) {
  Object.entries(scenes).forEach(([key, el]) => {
    el.classList.toggle("active", key === name);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function createStars() {
  const layer = $("#stars");
  for (let i = 0; i < 95; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    const size = 1 + Math.random() * 2.2;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.animationDelay = `${Math.random() * 4}s`;
    s.style.animationDuration = `${2.3 + Math.random() * 3.5}s`;
    layer.appendChild(s);
  }
}
createStars();

const music = $("#bgMusic");
music.volume = 0.32;

async function toggleMusic() {
  try {
    if (musicOn) {
      music.pause();
      musicOn = false;
    } else {
      await music.play();
      musicOn = true;
    }
    $("#musicBtn").innerHTML = musicOn ? "♫ <span>Music on</span>" : "♪ <span>Music</span>";
  } catch (e) {
    $("#musicBtn").innerHTML = "♪ <span>Add music.mp3</span>";
    musicOn = false;
  }
}
$("#musicBtn").addEventListener("click", toggleMusic);

$("#enterBtn").addEventListener("click", async () => {
  showScene("room");
  try {
    await music.play();
    musicOn = true;
    $("#musicBtn").innerHTML = "♫ <span>Music on</span>";
  } catch {}
});

function showToast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("show"), 2300);
}

$("#lamp").addEventListener("click", () => {
  lampOff = !lampOff;
  $("#lamp").classList.toggle("off", lampOff);
  showToast(lampOff ? "A little darker... 🌙" : "Better. Warm again. ✨");
});

$$(".balloon").forEach(b => {
  b.addEventListener("click", () => {
    b.animate([
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(-24px) scale(1.08)" },
      { transform: "translateY(0) scale(1)" }
    ], {duration: 650, easing: "ease-out"});
    showToast(b.dataset.note);
  });
});

$("#card").addEventListener("click", () => {
  cardOpened = true;
  showScene("card");
});

$("#continueRoom").addEventListener("click", () => showScene("notes"));
$("#cardNext").addEventListener("click", () => showScene("notes"));

$$(".note").forEach(note => {
  note.addEventListener("click", () => {
    notesOpened++;
    $("#noteResult").textContent = note.dataset.message;
    note.animate([
      {transform:"rotate(0) scale(1)"},
      {transform:"rotate(-1deg) scale(1.02)"},
      {transform:"rotate(0) scale(1)"}
    ], {duration:420});
    if (notesOpened >= 2) $("#notesNext").classList.remove("hidden");
  });
});

$("#notesNext").addEventListener("click", () => showScene("question"));

$$(".choice").forEach(choice => {
  choice.addEventListener("click", () => {
    questionDone = true;
    $("#answer").textContent = choice.dataset.choice === "yes"
      ? "Good. Keep reminding yourself. You really are. ✨"
      : "Then let me remind you: you matter more than you think. 🤍";
    $("#questionNext").classList.remove("hidden");
  });
});

$("#questionNext").addEventListener("click", () => showScene("cake"));

$("#cake").addEventListener("click", () => {
  if (wishDone) return;
  showToast("The big moment is waiting for later ✨");
});

$("#wishBtn").addEventListener("click", () => {
  if (wishDone) return;
  wishDone = true;
  $$(".cake-candle").forEach((c, i) => {
    setTimeout(() => c.classList.add("extinguished"), i * 330);
  });
  $("#wishBtn").disabled = true;
  $("#wishBtn").style.opacity = ".55";
  $("#wishText").textContent = "I hope it comes true. 🤍";
  const scene = $("#cakeScene");
  scene.animate([{filter:"brightness(1)"},{filter:"brightness(.55)"},{filter:"brightness(1)"}], {duration:1200});
  setTimeout(() => {
    const more = document.createElement("p");
    more.className = "wish-text";
    more.textContent = "And I hope this year gives you many more reasons to smile.";
    scene.appendChild(more);
    setTimeout(() => showScene("gift"), 1700);
  }, 1000);
});

$("#giftBig").addEventListener("click", () => {
  if (giftOpened) return;
  giftOpened = true;
  $("#giftBig").classList.add("open");
  $("#giftHint").textContent = "There. 🤍";
  setTimeout(() => $("#giftMessage").classList.remove("hidden"), 700);
});

$("#giftNext").addEventListener("click", () => {
  showScene("final");
  startFinalEnding();
});

function startFinalEnding() {
  clearTimeout(finalTimer);
  $("#ending").classList.add("hidden");
  finalTimer = setTimeout(() => $("#ending").classList.remove("hidden"), 4300);
}

$("#replayBtn").addEventListener("click", () => {
  notesOpened = 0; wishDone = false; giftOpened = false; questionDone = false;
  $("#noteResult").textContent = "";
  $("#answer").textContent = "";
  $("#notesNext").classList.add("hidden");
  $("#questionNext").classList.add("hidden");
  $("#wishText").textContent = "";
  $("#wishBtn").disabled = false;
  $("#wishBtn").style.opacity = "1";
  $$(".cake-candle").forEach(c => c.classList.remove("extinguished"));
  $("#giftBig").classList.remove("open");
  $("#giftMessage").classList.add("hidden");
  $("#giftHint").textContent = "Open the gift.";
  $("#lamp").classList.remove("off");
  lampOff = false;
  showScene("intro");
});

const modal = $("#modal");
$("#modalClose").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

const bigMoon = document.querySelector(".big-moon");
if (bigMoon) {
  bigMoon.style.cursor = "pointer";
  bigMoon.addEventListener("click", () => {
    secretMoonTaps++;
    if (secretMoonTaps >= 3) {
      secretMoonTaps = 0;
      $("#modalText").textContent = "Okay... you weren't supposed to find this. 😭🤍";
      modal.classList.remove("hidden");
      $$("#stars .star").forEach(s => s.animate([
        {transform:"scale(1)",opacity:.5},
        {transform:"scale(2.4)",opacity:1},
        {transform:"scale(1)",opacity:.5}
      ], {duration:900, easing:"ease-out"}));
    }
  });
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") modal.classList.add("hidden");
});

window.addEventListener("load", () => {
  const title = document.querySelector(".hero-title");
  if (title) title.innerHTML = `<span>Hey,</span> ${birthdayConfig.name}<span class="soft">...</span>`;
});

if (!birthdayConfig.music) {
  $("#musicBtn").style.display = "none";
}
