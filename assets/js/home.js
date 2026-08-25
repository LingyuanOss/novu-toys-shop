/* 首页渲染：Fresh Drops 固定取 1-3，Favorites 固定取 4-6，绝不重复 */
document.addEventListener("DOMContentLoaded", async () => {
  const products = await App.fetchProducts();

  // Fresh Drops 固定用前3个商品
  const newProducts = products.slice(0, 3);
  renderHomeProducts(document.getElementById("newProducts"), newProducts);

  // Collector Favorites 固定用商品的 4, 5, 6（与前3个毫无重复）
  const bestProducts = products.slice(3, 6);
  renderHomeProducts(document.getElementById("bestProducts"), bestProducts);

  renderTestimonials();
});

function renderHomeProducts(container, products) {
  if (!container) return;
  container.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
            <div class="image-wrapper">
                <div class="img-placeholder">商品图片预留位</div>
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover;" onerror="this.style.display='none';">
            </div>
            <div class="product-info">
                <span class="product-tag">${product.tag}</span>
                <h3>${product.name}</h3>
                <p class="artist">${product.artist}</p>
                <div class="price">$${product.price}</div>
                <button onclick="goProduct(${product.id})">查看商品</button>
            </div>
        </div>
    `,
    )
    .join("");
}

function renderTestimonials() {
  const grid = document.getElementById("testimonialGrid");
  if (!grid) return;
  const testimonials = [
    {
      name: "James L.",
      location: "纽约",
      text: "做工精良，细节完美！",
      avatar: "assets/images/community/JamesL.png",
    },
    {
      name: "刘小姐",
      location: "上海",
      text: "盲盒质量很好！",
      avatar: "assets/images/community/LiuXiaojie.png",
    },
    {
      name: "Aiko S.",
      location: "东京",
      text: "涂装简直是艺术品！",
      avatar: "assets/images/community/AikoS.png",
    },
  ];
  grid.innerHTML = testimonials
    .map(
      (t) => `
        <div class="testimonial-card">
            <img src="${t.avatar}" alt="${t.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;" onerror="this.style.display='none';">
            <h4>${t.name} (${t.location})</h4>
            <p>"${t.text}"</p>
        </div>
    `,
    )
    .join("");
}

function goProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

/* ================= HOME CAROUSEL LOGIC ================= */
let homeSlideIndex = 0;
const homeSlides = document.querySelectorAll("#homeCarousel .slide");
const homeDots = document.querySelectorAll("#homeCarousel .dot");
let homeTimer;
function showHomeSlide(index) {
  if (!homeSlides.length) return;
  if (index >= homeSlides.length) index = 0;
  if (index < 0) index = homeSlides.length - 1;
  homeSlides.forEach((slide) => slide.classList.remove("active", "prev"));
  homeDots.forEach((dot) => dot.classList.remove("active"));
  const prevIndex = (index - 1 + homeSlides.length) % homeSlides.length;
  homeSlides[prevIndex].classList.add("prev");
  homeSlides[index].classList.add("active");
  homeDots[index].classList.add("active");
  homeSlideIndex = index;
}
function changeSlideHome(step) {
  showHomeSlide(homeSlideIndex + step);
  restartHomeTimer();
}
function setSlideHome(index) {
  showHomeSlide(index);
  restartHomeTimer();
}
function restartHomeTimer() {
  clearInterval(homeTimer);
  homeTimer = setInterval(() => changeSlideHome(1), 5000);
}
showHomeSlide(0);
restartHomeTimer();
