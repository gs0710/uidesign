function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.display =
    sidebar.style.display === "none" ? "block" : "none";
}

function login() {
  window.location.href = "dashboard.html";
}
