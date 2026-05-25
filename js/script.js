// ambil elemen navbar
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");
// ketika hamburger menu diklik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// ketika hamburger menu diklik
hamburger.onclick = (e) => {
  navbarNav.classList.toggle("active");

  // agar tidak langsung tertutup
  e.preventDefault();
};

// klik di luar sidebar untuk menghilangkan nav
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});
