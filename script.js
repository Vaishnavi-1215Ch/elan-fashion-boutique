"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const bagButton = document.querySelector(".bag-button");
const cartDialog = document.querySelector("#cart-dialog");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#bag-count");
const dialogBagCount = document.querySelector("#dialog-bag-count");
const cartTotal = document.querySelector("#cart-total");
const cartEmpty = document.querySelector("#cart-empty");
const toast = document.querySelector("#toast");
const checkoutStatus = document.querySelector("#checkout-status");
const cart = [];
let toastTimer;

function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeNavigation();
    menuToggle.focus();
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function renderCart() {
  const totalItems = cart.length;
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  cartCount.textContent = String(totalItems);
  dialogBagCount.textContent = `(${totalItems})`;
  cartTotal.textContent = `$${totalPrice.toLocaleString("en-US")}`;
  cartEmpty.hidden = totalItems > 0;
  cartItems.replaceChildren();

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = item.name;
    const price = document.createElement("p");
    price.textContent = `$${item.price}`;
    details.append(name, price);
    const removeButton = document.createElement("button");
    removeButton.className = "remove-item";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${item.name} from bag`);
    removeButton.addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
      checkoutStatus.textContent = "";
    });
    row.append(details, removeButton);
    cartItems.append(row);
  });
}

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
    renderCart();
    checkoutStatus.textContent = "";
    showToast(`${button.dataset.name} added to your bag.`);
  });
});

bagButton.addEventListener("click", () => {
  closeNavigation();
  checkoutStatus.textContent = "";
  cartDialog.showModal();
  document.querySelector(".cart-close").focus();
});

document.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());

cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  checkoutStatus.textContent = cart.length
    ? "Thanks for your interest — checkout is not enabled in this demo."
    : "Your bag is waiting for something lovely.";
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
