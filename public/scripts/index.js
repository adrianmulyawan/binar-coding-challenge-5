class Game {
  constructor(name, score) {
    if (constructor.name === Game) {
      throw new Error("Error! You dont have permission to instace static object");
    }
    this.name = name;
    this.score = score;
  }

  setChoose() {
    console.info("Pilihan Anda");
  }

  getScore() {
    console.info("My score");
  }
}

class Computer extends Game {
  constructor(name, score) {
    super(name, score);
  }
  
  setChoose() {
    let compChoice = Math.random();
    
    // Tentukan Pilihan Computer
    if (compChoice < 0.34) return "batu";
    if (compChoice >= 0.34 && compChoice < 0.67) return "kertas"
    return "gunting";
  }

  setName() {
    const nameUser = document.querySelector("th.computer-name");
    nameUser.innerHTML = this.name;
  }
}

class Player extends Game {
  constructor(name, score) {
    super(name, score);
  }

  setChoose(pilComputer, method) {
    let myScore = this.score;
    const imageUser = document.querySelectorAll(".image-user");
    const chooseUser = document.querySelectorAll("div.area-user");
    chooseUser.forEach((userSelect) => {
      userSelect.addEventListener("click", (event) => {
        // Pilihan User
        const pilUser = event.target.getAttribute("alt");
        // Memberi efek jika gambar dipilih dan menghapus efeknya bila memilih gambar lain
        imageUser.forEach((image) => {
          if (image.classList.contains("layer-color")) {
            image.classList.remove("layer-color");
          }
        })
        event.target.classList.add("layer-color");
        // Pilihan Computer
        const getResultComputer = pilComputer.setChoose();

        // Hasil
        const result = method(pilUser, getResultComputer);
        console.info(`Pilihan ${this.name}: ${pilUser}`);
        console.info(`Pilihan ${pilComputer.name}: ${getResultComputer}`)
        console.info(`Hasilnya: ${result}`);

        // Panggil method function putar()
        putar();

        setTimeout(function() {
           // Show Hasil
          const textVs = document.querySelector("h1.text-vs");
          textVs.innerHTML = result;

          // Ambil gambar komputer
          const imgComputer = document.querySelector(".img-computer");
          imgComputer.setAttribute("src", `./images/${getResultComputer}.png`);

          const scoreUser = document.querySelector(".score-player-1");
          const scoreComputer = document.querySelector(".score-computer");

          if (result === "PLAYER WIN") {
            scoreUser.innerHTML = myScore += 1;
          }
          if (result === "COMPUTER WIN") {
            scoreComputer.innerHTML = pilComputer.score += 1;
          }
        }, 1000);

        // Reload Page
        const reloadPage = document.querySelector("img.reset-img-button");
        reloadPage.addEventListener("click", function() {
          document.location.reload(true);
        });
      });
    });
  }

  setName() {
    const nameUser = document.querySelector("th.player-1-name");
    nameUser.innerHTML = this.name;
  }
}

function getHasil(player, computer) {
  if (player === computer) return "SERI";
  if (player === "batu") return (computer === "gunting") ? "PLAYER WIN" : "COMPUTER WIN";
  if (player === "kertas") return (computer === "batu") ? "PLAYER WIN" : "COMPUTER WIN";
  if (player === "gunting") return (computer === "kertas") ? "PLAYER WIN" : "COMPUTER WIN";
}

function putar() {
  const imgComputer = document.querySelector(".img-computer");
  const image = ["gunting", "kertas", "batu"];
  let i = 0;

  const startTime = new Date().getTime();
  
  setInterval(function() {
    if (new Date().getTime() - startTime > 1000) {
      clearInterval;
      return
    }

    imgComputer.setAttribute("src", `./images/${image[i++]}.png`);
    if (i == image.length) {
      i = 0;
    }
  }, 100); 
};

// Tangkap Nama Player
const catchName = prompt("Masukan Nama Anda: ");
// Cek Nama Player
// => Jika ada nama player diisi, isi dengan catchName
// => Jika tidak ada isi dengan Player 1
let nama = (catchName === null) ?  "Player 1" : catchName;

// Instance class
const Player1 = new Player(nama, 0);
const Computer1 = new Computer("Computer",0);

// Jalankan method setChoose() dan set Name
Player1.setChoose(Computer1, getHasil);
Player1.setName();
Computer1.setName();