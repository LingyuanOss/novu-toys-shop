/* 购物车状态管理：解决重复添加问题，支持全局事件广播 */
window.CartManager = {
  // 获取购物车数据
  get() {
    return JSON.parse(localStorage.getItem("novu_cart")) || [];
  },

  // 保存并触发全局更新事件
  save(cart) {
    localStorage.setItem("novu_cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  },

  // 添加商品（自动合并重复项）
  add(product, quantity = 1) {
    let cart = this.get();
    let index = cart.findIndex((item) => item.id === product.id);

    if (index > -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    }
    this.save(cart);
    App.showToast(`${product.name} 已加入购物车！`);
  },

  // 修改数量
  changeQty(index, delta) {
    let cart = this.get();
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    } else {
      this.save(cart);
    }
  },

  // 移除商品
  remove(index) {
    let cart = this.get();
    cart.splice(index, 1);
    this.save(cart);
  },

  // 获取总数量
  getCount() {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },

  // 更新导航栏角标
  updateBadge() {
    const badge = document.querySelector(".cart-badge");
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  },
};

// 全局监听
window.addEventListener("cart-updated", () => CartManager.updateBadge());
document.addEventListener("DOMContentLoaded", () => CartManager.updateBadge());
