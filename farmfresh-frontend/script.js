const API_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function setAuth(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
