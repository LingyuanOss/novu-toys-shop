/* 购物车页面逻辑 - 完全读取真实商品图片 */
let discount = 0;
let appliedCoupon = "";

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  window.addEventListener("cart-updated", renderCart);

  document.getElementById("checkoutButton").addEventListener("click", () => {
    if (CartManager.get().length === 0) {
      App.showToast("请先添加商品", "error");
    } else {
      window.location.href = "checkout.html";
    }
  });

  document
    .getElementById("applyCouponBtn")
    .addEventListener("click", applyCoupon);
});

function renderCart() {
  const container = document.getElementById("cartItems");
  const cart = CartManager.get();
  let subtotal = 0;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>你的购物车还是空的</h2>
        <a href="shop.html"><button>去挑选喜欢的手办吧</button></a>
      </div>
    `;
    discount = 0;
    appliedCoupon = "";
    updateTotal(0);
    return;
  }

  container.innerHTML = cart
    .map((item, index) => {
      subtotal += item.price * item.quantity;
      return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>$${item.price}</p>
          <div class="quantity-control">
            <button onclick="CartManager.changeQty(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="CartManager.changeQty(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="CartManager.remove(${index})">移除</button>
        </div>
      </div>
    `;
    })
    .join("");

  if (appliedCoupon) calculateDiscount(subtotal);
  else discount = 0;

  updateTotal(subtotal);
}

function applyCoupon() {
  let code = document.getElementById("couponInput").value.trim().toUpperCase();
  let cart = CartManager.get();
  let subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (code === "NOVU10") {
    discount = 10;
    appliedCoupon = code;
    App.showToast("优惠码已应用！");
  } else if (code === "TOYS20") {
    discount = 20;
    appliedCoupon = code;
    App.showToast("优惠码已应用！");
  } else {
    discount = 0;
    appliedCoupon = "";
    App.showToast("无效的优惠码", "error");
  }

  calculateDiscount(subtotal);
  updateTotal(subtotal);
}

function calculateDiscount(subtotal) {
  if (discount > subtotal) discount = subtotal;
  const discountRow = document.getElementById("discountRow");
  const discountAmount = document.getElementById("discountAmount");
  if (discount > 0) {
    discountRow.style.display = "flex";
    discountAmount.innerText = "-$" + discount.toFixed(2);
  } else {
    discountRow.style.display = "none";
  }
}

function updateTotal(value) {
  let finalTotal = Math.max(0, value - discount);
  document.getElementById("subtotal").innerHTML = "$" + value.toFixed(2);
  document.getElementById("total").innerHTML = "$" + finalTotal.toFixed(2);
}
