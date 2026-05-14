(function () {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || user.role !== "worker") {
        window.location.href = "login.html";
    }

})();

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function loadOrders() {

    const container = document.getElementById("ordersList");
    const orders = getOrders();

    container.innerHTML = "";

    orders.forEach((order, index) => {

        let itemsHTML = "";

        (order.items || []).forEach(item => {
            itemsHTML += `
                <div class="item">
                    <img src="${item.img || 'https://via.placeholder.com/40'}">
                    <div>${item.name} × ${item.qty || 1}</div>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="order-card">

                <div class="order-top">
                    <div>طلب #${index + 1}</div>

                    <div class="status ${order.status}">
                        ${order.status === "done" ? "تم" : "جديد"}
                    </div>
                </div>

                <p>${order.time || ""}</p>

                ${itemsHTML}

                ${
                    order.status !== "done"
                    ? `<button class="btn-done" onclick="markDone(${order.id})">تم التجهيز</button>`
                    : ""
                }

                <button class="btn-delete" onclick="deleteOrder(${order.id})">حذف</button>

            </div>
        `;
    });
}

function markDone(id) {

    let orders = getOrders();

    orders = orders.map(o => {
        if (o.id === id) o.status = "done";
        return o;
    });

    saveOrders(orders);
    loadOrders();
}

function deleteOrder(id) {

    let orders = getOrders();

    orders = orders.filter(o => o.id !== id);

    saveOrders(orders);
    loadOrders();
}

window.onload = loadOrders;