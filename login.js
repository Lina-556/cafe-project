function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    const user = users.find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        error.innerText = "اسم المستخدم أو كلمة المرور خطأ";
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "admin") {
        window.location.href = "admin.html"; // ✅ FIX
    }

    if (user.role === "worker") {
        window.location.href = "worker.html";
    }
}

function guestLogin() {

    localStorage.setItem("currentUser", JSON.stringify({
        username: "guest",
        role: "customer"
    }));

    window.location.href = "index.html";
}