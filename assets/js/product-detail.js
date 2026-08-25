/* 商品详情页 - 直接读取全局硬编码商品 */
let currentProduct = null;
let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  allProducts = await App.fetchProducts();

  if (id) {
    currentProduct = allProducts.find((p) => p.id == id);
  }
  if (!currentProduct) {
    currentProduct = allProducts[0];
  }

  displayProduct();
  renderRelatedProducts();

  document.getElementById("addCartButton").addEventListener("click", () => {
    const qty = Number(document.getElementById("quantity").value);
    if (qty <= 0) {
      App.showToast("数量必须大于0", "error");
      return;
    }
    CartManager.add(currentProduct, qty);
  });

  document.getElementById("favBtn").addEventListener("click", function () {
    if (this.classList.contains("active")) {
      this.classList.remove("active");
      this.innerText = "☆ 收藏";
      App.showToast("已取消收藏");
    } else {
      this.classList.add("active");
      this.style.background = "#111";
      this.style.color = "white";
      this.innerText = "★ 已收藏";
      App.showToast("收藏成功");
    }
  });
});

function displayProduct() {
  document.getElementById("productImage").src = currentProduct.image;
  document.getElementById("productName").innerText = currentProduct.name;
  document.getElementById("productArtist").innerText = currentProduct.artist;
  document.getElementById("productPrice").innerText =
    "$" + currentProduct.price;
  document.getElementById("productTag").innerText = currentProduct.tag;
  document.getElementById("productCategory").innerText =
    currentProduct.category;
  document.getElementById("productMaterial").innerText =
    currentProduct.material;
  document.getElementById("productSize").innerText = currentProduct.size;
  document.getElementById("productStock").innerText = currentProduct.stock;
  document.getElementById("productDescription").innerText =
    currentProduct.description;

  const img = document.getElementById("productImage");
  img.style.display = "block";
}

function renderRelatedProducts() {
  const container = document.getElementById("relatedProducts");
  if (!container) return;
  let related = allProducts
    .filter(
      (p) =>
        p.category === currentProduct.category && p.id != currentProduct.id,
    )
    .slice(0, 3);
  if (related.length < 3) {
    let otherProducts = allProducts.filter(
      (p) => p.id != currentProduct.id && !related.includes(p),
    );
    related = related.concat(otherProducts).slice(0, 3);
  }
  if (related.length === 0) {
    container.innerHTML = "<p>暂无相关推荐</p>";
    return;
  }
  container.innerHTML = related
    .map(
      (product) => `
        <div class="product-card" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <div class="image-wrapper" style="height: 200px;">
                <div class="img-placeholder">商品图片预留位</div>
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';">
            </div>
            <div class="product-info" style="padding: 15px;">
                <h3 style="font-size: 18px;">${product.name}</h3>
                <div class="price">$${product.price}</div>
                <button onclick="openProduct(${product.id})" style="width: 100%; padding: 10px; background: #111; color: white; border: none; border-radius: 30px; margin-top: 10px;">查看详情</button>
            </div>
        </div>
    `,
    )
    .join("");
}

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}
