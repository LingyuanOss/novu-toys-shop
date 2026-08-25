/* 商城列表 - 直接获取全部真实图片商品 */
let allProducts = [];
let visibleCount = 6;

document.addEventListener("DOMContentLoaded", async () => {
  allProducts = await App.fetchProducts(); // 返回23个真实商品

  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  const tagParam = params.get("tag");
  const artistParam = params.get("artist");

  if (categoryParam)
    document.getElementById("categoryFilter").value = categoryParam;
  if (tagParam) document.getElementById("tagFilter").value = tagParam;
  if (artistParam) document.getElementById("searchInput").value = artistParam;

  renderProducts();
  renderFeaturedArea();

  document
    .querySelector("#searchInput")
    .addEventListener("input", applyFilters);
  document
    .querySelector("#categoryFilter")
    .addEventListener("change", applyFilters);
  document.querySelector("#tagFilter").addEventListener("change", applyFilters);
  document.querySelector("#priceSort").addEventListener("change", applyFilters);
  document.getElementById("loadMoreBtn").addEventListener("click", loadMore);
});

function applyFilters() {
  visibleCount = 6;
  renderProducts();
}

function renderProducts() {
  let keyword = document.querySelector("#searchInput").value.toLowerCase();
  let category = document.querySelector("#categoryFilter").value;
  let tag = document.querySelector("#tagFilter").value;
  let sort = document.querySelector("#priceSort").value;

  let result = allProducts.filter((p) => {
    const matchKeyword =
      p.name.toLowerCase().includes(keyword) ||
      p.artist.toLowerCase().includes(keyword);
    const matchCategory = category === "all" || p.category === category;
    const matchTag = tag === "all" || p.tag === tag;
    return matchKeyword && matchCategory && matchTag;
  });

  if (sort === "low") result.sort((a, b) => a.price - b.price);
  if (sort === "high") result.sort((a, b) => b.price - a.price);

  const displayProducts = result.slice(0, visibleCount);
  renderCards(displayProducts);

  const loadMoreArea = document.getElementById("loadMoreArea");
  if (visibleCount < result.length) loadMoreArea.style.display = "block";
  else loadMoreArea.style.display = "none";

  document.getElementById("productCount").innerHTML =
    `共 ${result.length} 件商品`;
}

function renderCards(products) {
  const container = document.querySelector(".product-container");
  if (!container) return;
  container.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
            <div class="image-wrapper">
                <div class="img-placeholder">商品图片预留位</div>
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover;" onerror="this.style.display='none';">
                <button class="quick-add" onclick="quickAddToCart(${product.id})">快速加购</button>
            </div>
            <div class="product-info">
                <span class="product-tag">${product.tag}</span>
                <h3>${product.name}</h3>
                <p class="artist">${product.artist}</p>
                <p>${product.category}</p>
                <div class="price">$${product.price}</div>
                <button onclick="openProduct(${product.id})" style="width: 100%; margin-top: 10px;">查看商品</button>
            </div>
        </div>
    `,
    )
    .join("");
}

function quickAddToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  if (product) CartManager.add(product, 1);
}

function loadMore() {
  visibleCount += 6;
  renderProducts();
}

function renderFeaturedArea() {
  const area = document.getElementById("featuredArea");
  const featured = allProducts.filter((p) => p.tag === "Exclusive").slice(0, 1);
  if (featured.length === 0 || !area) return;
  const p = featured[0];
  area.innerHTML = `
        <div style="background: linear-gradient(to right, #111, #333); color: white; padding: 30px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px;">
            <div>
                <h2 style="color: #e74c3c;">编辑推荐</h2>
                <h3 style="font-size: 32px; margin-top: 10px;">${p.name}</h3>
                <p>${p.description}</p>
                <br>
                <button onclick="openProduct(${p.id})" style="padding: 15px 40px; background: white; border: none; border-radius: 30px;">抢先查看</button>
            </div>
            <img src="${p.image}" alt="${p.name}" style="width: 250px; border-radius: 15px;" onerror="this.style.display='none';">
        </div>
    `;
}

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

/* ================= SHOP CAROUSEL LOGIC ================= */
let shopSlideIndex = 0;
const shopSlides = document.querySelectorAll("#shopCarousel .slide");
const shopDots = document.querySelectorAll("#shopCarousel .dot");
let shopTimer;
function showShopSlide(index) {
  if (!shopSlides.length) return;
  if (index >= shopSlides.length) index = 0;
  if (index < 0) index = shopSlides.length - 1;
  shopSlides.forEach((slide) => slide.classList.remove("active", "prev"));
  shopDots.forEach((dot) => dot.classList.remove("active"));
  const prevIndex = (index - 1 + shopSlides.length) % shopSlides.length;
  shopSlides[prevIndex].classList.add("prev");
  shopSlides[index].classList.add("active");
  shopDots[index].classList.add("active");
  shopSlideIndex = index;
}
function changeSlideShop(step) {
  showShopSlide(shopSlideIndex + step);
  restartShopTimer();
}
function setSlideShop(index) {
  showShopSlide(index);
  restartShopTimer();
}
function restartShopTimer() {
  clearInterval(shopTimer);
  shopTimer = setInterval(() => changeSlideShop(1), 5000);
}
showShopSlide(0);
restartShopTimer();
