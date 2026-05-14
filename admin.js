function formatOrderId(id) {
    return String(id || 0).padStart(3, "0");
}

/* حماية الصفحة */
(function () {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || user.role !== "admin") {
        window.location.href = "login.html";
    }
})();

window.onload = function () {
    updateDashboard();
};

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function normalizeOrder(order) {
    return {
        ...order,
        status: (order.status || "new").toLowerCase().trim()
    };
}

function updateDashboard() {

    let orders = getOrders().map(normalizeOrder);

    // 🔥 تأكد من الحالات
    const newOrders = orders.filter(o => o.status === "new");
    const doneOrders = orders.filter(o => o.status === "done");

    document.getElementById("newOrders").textContent = newOrders.length;
    document.getElementById("doneOrders").textContent = doneOrders.length;

    document.getElementById("sales").textContent =
        calculateSales(orders) + " ₪";

    renderOrders(orders);
    updateChart(newOrders.length, doneOrders.length);
}

/* ===== عرض الطلبات ===== */
function renderOrders(orders) {

    const box = document.getElementById("ordersList");
    box.innerHTML = "";

    if (!orders.length) {
        box.innerHTML = "<p>لا يوجد طلبات حالياً</p>";
        return;
    }

    // 🔥 ترتيب حسب الأحدث
    const sorted = [...orders].reverse();

    sorted.forEach((order, index) => {

        let itemsHTML = "";

        (order.items || []).forEach(item => {
            itemsHTML += `
                <div class="item-line" style="display:flex;align-items:center;gap:10px;">
                    <img src="${item.img || 'https://via.placeholder.com/40'}"
                         style="width:40px;height:40px;border-radius:8px;object-fit:cover;">
                    <div>${item.name} × ${item.qty || 1}</div>
                </div>
            `;
        });

        box.innerHTML += `
            <div class="order-card">

                <div class="order-top">
                    <!-- 🔥 رقم مرتب من 1 -->
                    <div>طلب #${index + 1}</div>

                    <span class="status ${order.status}">
                        ${order.status === "done" ? "جاهز" : "جديد"}
                    </span>
                </div>

                <div class="time">🕒 ${order.time || "بدون وقت"}</div>

                ${itemsHTML}

                ${
                    order.status !== "done"
                        ? `<button class="btn-done" onclick="markDone(${order.id})">تجهيز الطلب</button>`
                        : ""
                }

            </div>
        `;
    });
}

/* ===== تغيير حالة ===== */
function markDone(id) {

    let orders = getOrders();

    orders = orders.map(o => {
        if (o.id === id) {
            return { ...o, status: "done" };
        }
        return o;
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    updateDashboard();
}

/* ===== المبيعات ===== */
function calculateSales(orders) {

    return orders.reduce((total, order) => {

        const sum = (order.items || []).reduce((s, item) => {
            return s + (item.price || 0) * (item.qty || 1);
        }, 0);

        return total + sum;

    }, 0);
}

/* ===== chart ===== */
let chart;

function updateChart(newCount, doneCount) {

    const canvas = document.getElementById("chart");
    if (!canvas) return;

    if (chart) {
        chart.data.datasets[0].data = [newCount, doneCount];
        chart.update();
        return;
    }

    chart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["جديد", "جاهز"],
            datasets: [{
                data: [newCount, doneCount],
                backgroundColor: ["#c69c6d", "#3d7d4f"]
            }]
        }
    });
}