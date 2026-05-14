const firebaseConfig = {
  apiKey: "AIzaSyAxJSjqPEcNta0pVX_D3MUMVZ5cvdLaySA",
  authDomain: "cafe-95b41.firebaseapp.com",
  databaseURL: "https://cafe-95b41-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cafe-95b41",
  storageBucket: "cafe-95b41.appspot.com",
  messagingSenderId: "402242933862",
  appId: "1:402242933862:web:582fb68d02be85e6e009a7"
};

// تشغيل Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();



let cart = JSON.parse(localStorage.getItem("myCart")) || [];
let favorites = JSON.parse(localStorage.getItem("myFavs")) || [];
const menuData = {
    "مشروبات ساخنة": [
        { name: "قهوة", price: 18, img:"مشروع/5668d7e806ee42fdddabc9ac381bfec2.jpg" },
        { name: "كابتشينو", price: 20, img:"مشروع/c4b403a2cea16af5166e636838a1493c.jpg" },
        { name: "سحلب", price: 22, img:"مشروع/23dad9f8412f281e1e07ff8f815b1bcf.jpg" },
        { name: "فلايت وايت", price: 15, img:"مشروع/Screenshot_20260428_200825_ChatGPT.jpg" },
        { name: "هوت شوكليت", price: 19, img:"مشروع/dfb416cb8bbffc611c0b74de70807c25.jpg" },
        { name: "شاي", price: 12, img:"مشروع/688a5576ac34e771c80c3aac83ef6016.jpg" }
    ],

    "مشروبات باردة": [
        { name: "آيس امريكانو", price: 24, img:"مشروع/82089d7142d13772fbdb4cb591e80d58.jpg" },
        { name: "سبانيش لاتيه", price: 24, img:"مشروع/4c3622653bac985842b8ae17777db85f.jpg" },
        { name: "آيس لاتيه كراميل", price: 23, img:"مشروع/7871fb07886062f9c343e2b17abc1a03.jpg" },
        { name: "كوكاكولا", price: 26, img:"مشروع/175b7cfced1828a519f8c62811dc7087 (1).jpg" },
        { name: "موهيتو", price: 18, img:"مشروع/60686333467a9241ce07a256951b6b98.jpg" },
        { name: "عصير برتقال", price: 14, img:"مشروع/46427b7aaa4bc3b73ac8863e2ea6a0fe.jpg" }
    ],

    "حلويات": [
        { name: "تشيز كيك", price: 26, img:"مشروع/8732e4bbd2d91f26058e69043bd87252.jpg" },
        { name: "كرواسون", price: 18, img:"مشروع/3fa7d46344d989858c63cc913f4f7f6d.jpg" },
        { name: "بان كيك", price: 20, img:"مشروع/6bef2f9d1e0e24e998a866e137277716.jpg" },
        { name: "دونات", price: 14, img:"مشروع/48496605f322abda51940b4c636c4ebe.jpg" },
        { name: "كوكيز", price: 12, img:"مشروع/4f9ccdd022018f52c60eeb59def2622d.jpg" },
        { name: "سان سباستيان", price: 28, img:"مشروع/f4692b2b2cc259555bf0ea60c7d6d909.jpg" }
    ]
};
let current = 0;

const slides = document.querySelectorAll(".slide");

function showSlide(index) {
    if (!slides.length) return;

    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
}

function changeSlide(step) {
    if (!slides.length) return;

    current += step;

    if (current < 0) current = slides.length - 1;
    if (current >= slides.length) current = 0;

    showSlide(current);
}

if (slides.length) {
    showSlide(current);
}

/* =======================
        المنتجات
======================= */

function displayProducts(category, element) {

    const displayArea = document.getElementById('productDisplay');
    if (!displayArea) return;

    displayArea.innerHTML = "";

    if (!menuData[category]) return;

    document.querySelectorAll('.icon-box')
        .forEach(box => box.classList.remove('active'));

    if (element) element.classList.add('active');

    menuData[category].forEach(item => {

        const isFav = favorites.some(f => f.name === item.name);

        displayArea.innerHTML += `
            <div class="product-card">

                <i class="fas fa-heart fav-icon ${isFav ? 'active' : ''}"
                   data-name="${item.name}"
                   data-price="${item.price}"
                   data-img="${item.img}">
                </i>

                <img src="${item.img}">

                <h4>${item.name}</h4>
                <p>${item.price} ₪</p>

                <button class="add-btn"
                    onclick="addToCart('${item.name}', ${item.price}, '${item.img}')">
                    +
                </button>

            </div>
        `;
    });

    updateFavIcons();
}

/* =======================
        السلة
======================= */

function addToCart(name, price, img) {

    let item = cart.find(i => i.name === name);

    if (item) {
        item.qty = (item.qty || 1) + 1;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }

    localStorage.setItem("myCart", JSON.stringify(cart));

    updateCartCount();
}


function checkout() {

    let cart = JSON.parse(localStorage.getItem("myCart")) || [];

    if (cart.length === 0) {
        showToast("السلة فارغة!");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let newOrder = {
        id: Date.now(),
        items: cart,
        status: "جديد"
    };

    orders.push(newOrder);

    localStorage.setItem("orders", JSON.stringify(orders));

    // تفريغ السلة
    localStorage.removeItem("myCart");

    cart = [];

    renderCart();
    updateCartCount();
    calculateTotal();

    showToast("تم إرسال الطلب ☕");
}


/* ====== 🔥 أهم تعديل هنا ====== */

function renderCart() {

    let cart = JSON.parse(localStorage.getItem("myCart")) || [];
    let container = document.getElementById("cartItemsList");

    if (!container) return;

    container.innerHTML = "";

    cart.forEach((item, index) => {

        container.innerHTML += `
            <div class="cart-item">

                <div>
                    <h4>${item.name}</h4>
                    <p>الكمية: ${item.qty}</p>
                    <p>${item.price * item.qty} ₪</p>
                </div>

                <i class="fas fa-trash delete-icon"
                   onclick="removeFromCart(${index})"></i>

            </div>
        `;
    });

    calculateTotal();
}

/* ====== 🔥 حذف المنتج ====== */

function removeFromCart(index) {

    let cart = JSON.parse(localStorage.getItem("myCart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("myCart", JSON.stringify(cart));

    renderCart();
    updateCartCount();
}

/* =======================
        المجموع
======================= */

function calculateTotal() {

    let cart = JSON.parse(localStorage.getItem("myCart")) || [];

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    let el = document.getElementById("totalPriceDisplay");

    if (el) {
        el.innerText = `المجموع الكلي: ${total.toFixed(2)} ₪`;
    }
}

/* =======================
        عداد السلة
======================= */

function updateCartCount() {

    let el = document.getElementById("cart-count");
    if (!el) return;

    let total = cart.reduce((sum, item) => sum + item.qty, 0);

    el.innerText = total;
}

/* =======================
        تشغيل الصفحة
======================= */

window.addEventListener("load", () => {

    if (document.getElementById('productDisplay')) {
        displayProducts("مشروبات ساخنة");
    }

    if (document.getElementById('cartItemsList')) {
        renderCart();
    }

    updateCartCount();
});

/* =======================
        المفضلة
======================= */

function toggleFavorite(name, price, img) {

    const index = favorites.findIndex(item => item.name === name);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ name, price, img });
    }

    localStorage.setItem("myFavs", JSON.stringify(favorites));

    renderFavorites();
}
function renderFavorites() {

    const favList = document.getElementById("favItemsList");
    if (!favList) return;

    favList.innerHTML = "";

    if (favorites.length === 0) {
        favList.innerHTML = "<p style='text-align:center;padding:20px;'>لا توجد مفضلة ❤️</p>";
        return;
    }

    favorites.forEach((item, index) => {

        favList.innerHTML += `
            <div class="cart-item">

                <img src="${item.img}" width="50">

                <div style="flex:1; margin-right:10px;">
                    <h4>${item.name}</h4>
                    <p>${item.price} ₪</p>
                </div>

                <i class="fas fa-trash"
                   style="color:red; cursor:pointer;"
                   onclick="removeFavorite(${index})">
                </i>

            </div>
        `;
    });
}

/* =======================
        تشغيل الصفحة
======================= */

window.addEventListener("load", () => {

    if (document.getElementById('productDisplay')) {
        displayProducts("مشروبات ساخنة");
    }

    if (document.getElementById('cartItemsList')) {
        renderCart();
    }

    if (document.getElementById('favItemsList')) {
        renderFavorites();
    }

    updateCartCount();
});
function updateFavIcons() {

    document.querySelectorAll(".fav-icon").forEach(icon => {

        const name = icon.dataset.name;

        const exists = favorites.some(f => f.name === name);

        icon.classList.toggle("active", exists);
    });
}
function removeFavorite(index) {

    favorites.splice(index, 1);

    localStorage.setItem("myFavs", JSON.stringify(favorites));

    renderFavorites();
    updateFavIcons();
}
document.addEventListener("click", function (e) {

    if (e.target.classList.contains("fav-icon")) {

        const name = e.target.dataset.name;
        const price = e.target.dataset.price;
        const img = e.target.dataset.img;

        toggleFavorite(name, Number(price), img);

        // تحديث شكل القلب مباشرة
        e.target.classList.toggle("active");
    }
});

// تحويل الزبون مباشرة للصفحة الرئيسية
function goToIndex() {
    localStorage.setItem("role", "customer");
    window.location.href = "index.html";

}

// تبديل التبويبات (نفس فكرتك القديمة)
function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab).classList.add('active');

    document.querySelectorAll('.role-tabs button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

// دخول العامل والمدير
function login(e, role) {
    e.preventDefault();

    localStorage.setItem("role", role);

    if (role === "worker") {
        window.location.href = "worker-dashboard.html";
    }

    if (role === "admin") {
        window.location.href = "admin-dashboard.html";
    }
}
function goToPage(page) {
    window.location.href = page;
}

loadOrders();
function markDone(id) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders = orders.map(o => {
        if (o.id === id) {
            o.status = "تم التنفيذ";
        }
        return o;
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrders();
}

function deleteOrder(id) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders = orders.filter(o => o.id !== id);

    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrders();
}

window.addEventListener("load", () => {
    loadOrders();
});

function loadOrders() {

    let container = document.getElementById("ordersList");
    if (!container) {
        console.log("ordersList NOT FOUND");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    console.log("LOADED:", orders); // 🔥 مهم جدًا

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>لا يوجد طلبات</p>";
        return;
    }

    orders.forEach(order => {

        let items = "";

        order.items.forEach(i => {
            items += `<div>${i.name} × ${i.qty}</div>`;
        });

        container.innerHTML += `
            <div style="background:#fff;padding:10px;margin:10px;border-radius:10px;">
                <h3>طلب #${order.id}</h3>
                ${items}
                <p>${order.status}</p>

                <button onclick="markDone(${order.id})">تم</button>
                <button onclick="deleteOrder(${order.id})">حذف</button>
            </div>
        `;
    });
}

function deleteOrder(id) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders = orders.filter(o => o.id !== id);

    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrders();
}


function showToast(message) {

    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 400);

    }, 2000);
}
function calculateTotal() {

    let cart = JSON.parse(localStorage.getItem("myCart")) || [];

    let total = 0;

    cart.forEach(item => {
        total += Number(item.price) * Number(item.qty);
    });

    let el = document.getElementById("totalPriceDisplay");

    if (el) {
        el.innerText = `المجموع الكلي: ${total.toFixed(2)} ₪`;
    }
}


/* =======================
        بيانات التقييمات
======================= */
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

let selectedRating = 5;
let editIndex = null;
let editRating = 5;

/* =======================
        إضافة تعليق
======================= */

function addReview() {

    const name = document.getElementById("customerName").value;
    const review = document.getElementById("customerReview").value;

    if (name.trim() === "" || review.trim() === "") {
        showToast("الرجاء تعبئة جميع الحقول");
        return;
    }

    const id = Date.now();

    firebase.database().ref("reviews/" + id).set({
        id: id,
        name: name,
        review: review,
        rating: selectedRating || 5
    }).then(() => {

        document.getElementById("customerName").value = "";
        document.getElementById("customerReview").value = "";

        selectedRating = 5;
        resetStars();

        showCoffeeToast();

    }).catch(err => {
        console.log("Firebase error:", err);
    });
}

/* =======================
        عرض التقييمات
======================= */

function renderReviews() {

    const container = document.getElementById("reviewsContainer");
    if (!container) return;

    firebase.database().ref("reviews").on("value", (snapshot) => {

        const data = snapshot.val();

        container.innerHTML = "";

        if (!data) {
            container.innerHTML = "<p style='text-align:center;color:white;'>لا توجد تقييمات ⭐</p>";
            return;
        }

        Object.values(data).reverse().forEach(item => {

            let stars = "⭐".repeat(item.rating);

            container.innerHTML += `
                <div class="review-card">

                    <h3>${item.name}</h3>
                    <p>${item.review}</p>
                    <span>${stars}</span>

                    <div class="review-actions">

                        <button onclick="openEdit(${item.id})">✏️ تعديل</button>
                        <button onclick="deleteReview(${item.id})">🗑️ حذف</button>

                    </div>

                </div>
            `;
        });
    });
}

/* =======================
        حذف
======================= */

function deleteReview(id) {
    firebase.database().ref("reviews/" + id).remove();
    showToast("تم حذف التعليق");
}

/* =======================
        فتح التعديل
======================= */

function openEdit(id) {

    firebase.database().ref("reviews/" + id).once("value").then(snapshot => {

        const review = snapshot.val();

        document.getElementById("editName").value = review.name;
        document.getElementById("editReview").value = review.review;

        editRating = review.rating || 5;
        editIndex = id;

        document.getElementById("editModal").style.display = "flex";

        // 🔥 لازم تأخير بسيط عشان العناصر تكون موجودة
        setTimeout(() => {
            resetEditStars();
        }, 50);
    });
}

document.addEventListener("click", function (e) {

    // ⭐ تقييم جديد
    if (e.target.closest("#starRating i")) {

        selectedRating = Number(e.target.dataset.value);

        document.querySelectorAll("#starRating i").forEach(star => {
            star.classList.toggle(
                "active",
                Number(star.dataset.value) <= selectedRating
            );
        });
    }

    // ⭐ تعديل تقييم
    if (e.target.closest("#editStarRating i")) {

        editRating = Number(e.target.dataset.value);

        document.querySelectorAll("#editStarRating i").forEach(star => {
            star.classList.toggle(
                "active",
                Number(star.dataset.value) <= editRating
            );
        });
    }
});

/* =======================
        حفظ التعديل
======================= */

function saveEdit() {

    firebase.database().ref("reviews/" + editIndex).update({
        name: document.getElementById("editName").value,
        review: document.getElementById("editReview").value,
        rating: editRating // 🔥 هذا هو المهم
    });

    closeModal();
    showToast("تم تعديل التقييم ✏️");
}


/* =======================
        إغلاق المودال
======================= */

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

/* =======================
        نجوم الإضافة + التعديل
======================= */

document.addEventListener("click", function(e) {

    // ⭐ إضافة تقييم
    if (e.target.closest("#starRating i")) {

        selectedRating = Number(e.target.dataset.value);

        document.querySelectorAll("#starRating i").forEach(star => {
            star.classList.toggle(
                "active",
                Number(star.dataset.value) <= selectedRating
            );
        });
    }

    // ⭐ تعديل تقييم
    if (e.target.closest("#editStarRating i")) {

        editRating = Number(e.target.dataset.value);

        document.querySelectorAll("#editStarRating i").forEach(star => {
            star.classList.toggle(
                "active",
                Number(star.dataset.value) <= editRating
            );
        });
    }
});

/* =======================
        Reset Stars
======================= */

function resetStars() {
    document.querySelectorAll("#starRating i").forEach(star => {
        star.classList.remove("active");
    });
}

function resetEditStars() {

    document.querySelectorAll("#editStarRating i").forEach(star => {
        star.classList.toggle(
            "active",
            Number(star.dataset.value) <= editRating
        );
    });
}


/* =======================
        إغلاق عند الضغط خارج المودال
======================= */

window.addEventListener("click", function(e) {
    const modal = document.getElementById("editModal");

    if (e.target === modal) {
        closeModal();
    }
});


function showCoffeeToast() {

    let toast = document.createElement("div");
    toast.className = "coffee-toast";

    toast.innerHTML = `
        <span class="coffee-icon">☕</span>
        <span>شكراً لتقييمك!</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 400);

    }, 2000);
}

window.addEventListener("load", () => {
    renderReviews();
});