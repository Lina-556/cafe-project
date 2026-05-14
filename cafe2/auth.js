function login() {

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (!email || !pass) {
        alert("عبّي البيانات");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify({
        email,
        role
    }));

    if (role === "worker") window.location.href = "worker.html";
    else if (role === "admin") window.location.href = "admin.html";
    else window.location.href = "index.html";
}

function guestLogin() {
    localStorage.setItem("currentUser", JSON.stringify({
        email: "guest",
        role: "customer"
    }));

    window.location.href = "index.html";
}

function goRegister() {
    window.location.href = "register.html";
}