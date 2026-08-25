/* ================= ARTISTS CAROUSEL LOGIC ================= */
let artistSlideIndex = 0;
const artistSlides = document.querySelectorAll("#artistsCarousel .slide");
const artistDots = document.querySelectorAll("#artistsCarousel .dot");
let artistTimer;

function showArtistSlide(index) {
  if (index >= artistSlides.length) index = 0;
  if (index < 0) index = artistSlides.length - 1;

  artistSlides.forEach((slide) => slide.classList.remove("active", "prev"));
  artistDots.forEach((dot) => dot.classList.remove("active"));

  const prevIndex = (index - 1 + artistSlides.length) % artistSlides.length;
  artistSlides[prevIndex].classList.add("prev");
  artistSlides[index].classList.add("active");

  artistDots[index].classList.add("active");
  artistSlideIndex = index;
}

function changeSlideArtists(step) {
  showArtistSlide(artistSlideIndex + step);
  restartArtistTimer();
}

function setSlideArtists(index) {
  showArtistSlide(index);
  restartArtistTimer();
}

function restartArtistTimer() {
  clearInterval(artistTimer);
  artistTimer = setInterval(() => changeSlideArtists(1), 5000);
}

if (artistSlides.length > 0) {
  showArtistSlide(0);
  restartArtistTimer();
}

/* ================= ARTISTS DATA RENDER (一对一硬编码，绝不缺失/重复) ================= */
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("artistGrid");
  if (!grid) return;

  // 完全硬编码 7 位艺术家，每人绑定唯一的头像和唯一的代表作（不存在缺失）
  const ARTIST_MAP = [
    {
      name: "Luna Chen",
      avatar: "assets/images/artists/LunaChen.png",
      product: "Air bubbles in zero gravity Blind Box",
    },
    {
      name: "Ken Walker",
      avatar: "assets/images/artists/KenaWalker.png",
      product: "Ancient Relics Under the Moon Fresh Drops1",
    },
    {
      name: "Mika Studio",
      avatar: "assets/images/artists/MikaStudio.png",
      product: "Ancient Ruins Fossil Wind Mysterious Doll Fresh Drops2",
    },
    {
      name: "NOVU Studio",
      avatar: "assets/images/artists/NOVUStudio.png",
      product:
        "Cyborg Deconstructed Mechanical Hand Sculpture Collector Favorites3",
    },
    {
      name: "Nova Artist",
      avatar: "assets/images/artists/AikoS.png",
      product: "Biochemical Mechanical Deep-Sea Monster Fresh Drops3",
    },
    {
      name: "Dark Forge",
      avatar: "assets/images/artists/JamesL.png",
      product: "Dark Demon Fresh Drops6",
    },
    {
      name: "Future Toys Lab",
      avatar: "assets/images/artists/LiuXiaojie.png",
      product: "Crystal Symbiotic Ethereal Doll Fresh Drops4",
    },
  ];

  grid.innerHTML = ARTIST_MAP.map(
    (artist) => `
      <div class="artist-card" style="background: #fff; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); overflow: hidden; text-align: center; padding-bottom: 20px;">
        <div class="image-wrapper" style="height: 250px;">
          <div class="img-placeholder">${artist.name} 头像预留位</div>
          <img src="${artist.avatar}" alt="${artist.name}" style="width:100%; height:100%; object-fit: cover;" onerror="this.style.display='none';">
        </div>
        <div class="artist-info" style="padding: 20px;">
          <h3 style="font-size: 24px; margin-bottom: 10px;">${artist.name}</h3>
          <p style="color: #666; margin-bottom: 20px;">代表作品：${artist.product}</p>
          <button onclick="goArtistProducts('${artist.name}')" style="padding: 10px 30px; background: #111; color: white; border-radius: 30px; cursor: pointer;">查看TA的作品</button>
        </div>
      </div>
    `,
  ).join("");
});

function goArtistProducts(artistName) {
  window.location.href = `shop.html?artist=${encodeURIComponent(artistName)}`;
}
