/* 结算页逻辑 - 丰富版 */
let selectedPayment = "paypal"; // 默认选中

document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();

  // 监听支付方式的选择
  const radios = document.querySelectorAll('input[name="payment"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      selectedPayment = e.target.value;
      // 高亮效果
      document.querySelectorAll(".payment-methods label").forEach((label) => {
        label.style.border = "2px solid #ddd";
      });
      e.target.parentElement.style.border = "2px solid #111";
    });
  });

  document
    .getElementById("paymentButton")
    .addEventListener("click", processPayment);
});

function renderCheckout() {
  const container = document.getElementById("checkoutItems");
  const cart = CartManager.get();
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>购物车为空，无法结算</p>";
    return;
  }

  container.innerHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      return `<p>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</p>`;
    })
    .join("");

  document.getElementById("checkoutTotal").innerText = "$" + total.toFixed(2);
}

function processPayment() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !address) {
    App.showToast("请完整填写您的信息！", "error");
    return;
  }

  // 获取支付方式名称（用于提示）
  let paymentName = "";
  if (selectedPayment === "paypal") paymentName = "PayPal";
  if (selectedPayment === "stripe") paymentName = "Stripe";
  if (selectedPayment === "alipay") paymentName = "支付宝";

  // 模拟支付过程
  App.showToast(`正在连接 ${paymentName} 支付网关...`);
  setTimeout(() => {
    alert(
      `演示成功！\n订单已提交给：${name}\n邮箱：${email}\n支付方式：${paymentName}\n后续将在这里接入真实支付API。`,
    );
    // 清空购物车
    localStorage.removeItem("novu_cart");
    window.location.href = "index.html";
  }, 1500);
}
