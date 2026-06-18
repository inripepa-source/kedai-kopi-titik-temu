// Ambil elemen navbar & hamburger
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");

// Ketika hamburger menu diklik
if (hamburger) {
  hamburger.onclick = (e) => {
    navbarNav.classList.toggle("active");
    e.preventDefault();
  };
}

// --- LOGIKA UTAMA (PENCARIAN, KERANJANG, KONTAK & KLIK DI MANA SAJA) ---
document.addEventListener("DOMContentLoaded", function () {
  let cartData = [];

  // Ambil elemen DOM Pencarian
  const searchIcon = document.getElementById("search");
  const searchModal = document.getElementById("search-modal");
  const closeSearch = document.getElementById("close-search");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.getElementById("search-input");

  // Ambil elemen DOM Keranjang
  const cartIcon = document.getElementById("shopping-cart");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCart = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");
  const addCartButtons = document.querySelectorAll(".btn-add-cart");
  const checkoutButton = document.querySelector(".btn-checkout");

  // Ambil elemen DOM Form Kontak
  const contactForm = document.getElementById("contact-form");

  // --- 1. EVENT KLIK TOMBOL BUKA/TUTUP ---
  if (searchIcon && searchModal && closeSearch) {
    searchIcon.addEventListener("click", function (e) {
      e.preventDefault();
      searchModal.style.display = "block";
      setTimeout(() => searchInput.focus(), 100);
    });

    closeSearch.addEventListener("click", function () {
      searchModal.style.display = "none";
    });
  }

  if (cartIcon && cartSidebar && closeCart) {
    cartIcon.addEventListener("click", function (e) {
      e.preventDefault();
      cartSidebar.classList.add("active");
    });

    closeCart.addEventListener("click", function () {
      cartSidebar.classList.remove("active");
    });
  }

  // --- 2. LOGIKA PROSES PENCARIAN MENU ---
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const keyword = searchInput.value.toLowerCase().trim();
      const menuCards = document.querySelectorAll(".menu-card");
      let found = false;

      menuCards.forEach((card) => {
        const title = card
          .querySelector(".menu-card-title")
          .innerText.toLowerCase();
        if (title.includes(keyword)) {
          found = true;
          searchModal.style.display = "none";
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.add("search-highlight");
          setTimeout(() => {
            card.classList.remove("search-highlight");
          }, 2000);
        }
      });

      if (!found) {
        alert("Menu '" + searchInput.value + "' tidak ditemukan.");
      }
    });
  }

  // --- 3. LOGIKA KLIK DI MANA SAJA UNTUK MENUTUP (GLOBAL CLICK) ---
  document.addEventListener("click", function (e) {
    if (
      hamburger &&
      !hamburger.contains(e.target) &&
      !navbarNav.contains(e.target)
    ) {
      navbarNav.classList.remove("active");
    }
    if (e.target === searchModal) {
      searchModal.style.display = "none";
    }
    if (cartSidebar && cartSidebar.classList.contains("active")) {
      // Ditambahkan pengecekan agar form kontak tidak memicu penutupan/pembukaan sidebar keranjang
      if (
        !cartSidebar.contains(e.target) &&
        !cartIcon.contains(e.target) &&
        !e.target.classList.contains("btn-add-cart")
      ) {
        cartSidebar.classList.remove("active");
      }
    }
  });

  // --- 4. LOGIKA KERANJANG BELANJA ---
  addCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const menuCard = this.parentElement;
      const title = menuCard.querySelector(".menu-card-title").innerText;
      const priceText = menuCard.querySelector(".menu-card-price").innerText;

      const priceNumber =
        parseInt(priceText.replace("IDR ", "").replace("K", "")) * 1000;
      const existingItem = cartData.find((item) => item.title === title);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartData.push({ title: title, price: priceNumber, quantity: 1 });
      }

      updateCartUI();
      cartSidebar.classList.add("active");
    });
  });

  function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    if (cartData.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart-msg">Keranjangmu masih kosong.</p>';
      cartTotalContainer.innerText = "IDR 0";
      return;
    }

    let total = 0;
    cartData.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      cartItemElement.innerHTML = `
        <div class="item-detail">
          <h4>${item.title}</h4>
          <div class="item-price">
            <span>IDR ${item.price.toLocaleString("id-ID")}</span> x ${item.quantity}
          </div>
        </div>
        <button class="remove-item" data-index="${index}">×</button>
      `;
      cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalContainer.innerText = "IDR " + total.toLocaleString("id-ID");

    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemIndex = this.getAttribute("data-index");
        cartData.splice(itemIndex, 1);
        updateCartUI();
      });
    });
  }

  // --- 5. LOGIKA CHECKOUT KERANJANG (WHATSAPP PESANAN KOPI) ---
  if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
      if (cartData.length === 0) {
        alert(
          "Keranjang kamu masih kosong, silakan pilih menu terlebih dahulu!",
        );
        return;
      }

      const nomorWhatsApp = "6285326871046"; // Sesuaikan dengan nomor WA Toko Anda
      let pesanTeks = "Halo Kopi Titik Temu, saya ingin memesan:\n\n";
      let totalHarga = 0;

      cartData.forEach((item) => {
        const subTotal = item.price * item.quantity;
        totalHarga += subTotal;
        pesanTeks += `- *${item.title}* (${item.quantity}x) = IDR ${subTotal.toLocaleString("id-ID")}\n`;
      });

      pesanTeks += `\n*Total Pembayaran:* IDR ${totalHarga.toLocaleString("id-ID")}\n\nTerima kasih!`;
      const urlWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesanTeks)}`;
      window.open(urlWhatsApp, "_blank");
    });
  }

  // --- 6. LOGIKA FORM KONTAK (WHATSAPP PESAN HUBUNGI KAMI) ---
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Mencegah halaman refresh

      // Ambil data dari form input kontak
      const nama = document.getElementById("contact-name").value;
      const email = document.getElementById("contact-email").value;
      const telepon = document.getElementById("contact-phone").value;

      // Masukkan nomor WhatsApp Toko Anda di sini (Gunakan kode negara 62 di depan)
      const nomorWhatsAppToko = "6285326871046";

      // Susun format pesan teks khusus Hubungi Kami
      let pesanKontak = `Halo Kopi Titik Temu, ada pesan baru dari Form Kontak Website:\n\n`;
      pesanKontak += `*Nama:* ${nama}\n`;
      pesanKontak += `*Email:* ${email}\n`;
      pesanKontak += `*No. HP:* ${telepon}\n\n`;
      pesanKontak += `Saya ingin menanyakan informasi lebih lanjut mengenai kafe atau ketersediaan reservasi tempat. Terima kasih!`;

      // Buka link WhatsApp tanpa mengaktifkan atau membuka sidebar keranjang belanja
      const urlWhatsAppKontak = `https://wa.me/${nomorWhatsAppToko}?text=${encodeURIComponent(pesanKontak)}`;
      window.open(urlWhatsAppKontak, "_blank");

      // Bersihkan isi form kembali
      contactForm.reset();
    });
  }
});
