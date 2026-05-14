let cart = [];

function addToCart(name, qty, img) {
    cart.push({ name, qty, img });
    localStorage.setItem("cart", JSON.stringify(cart));
}

function sendOrder() {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
        id: Date.now(),
        items: JSON.parse(localStorage.getItem("cart")) || [],
        time: new Date().toLocaleTimeString(),
        status: "new"
    };

    orders.push(newOrder);

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    alert("تم إرسال الطلب");
}