const API_URL_AUTH = "https://localhost:7223/api/auth";
const API_URL_POSTS = "https://localhost:7223/api/posts";

export async function registerUser(fullName, email, password) {
  const res = await fetch(`${API_URL_AUTH}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL_AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("login response:", data); // <--- verifică exact ce primești
  if (!res.ok) throw data;

  localStorage.setItem("fullName", data.fullName);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId); // folosește exact ce trimite backend-ul
  return data;
}

export async function createPost(title, content, token) {
  const res = await fetch(API_URL_POSTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  });

  const text = await res.text();
  if (!res.ok) {
    try {
      const data = JSON.parse(text);
      throw data;
    } catch {
      throw { message: text };
    }
  }

  return JSON.parse(text);
}

export async function fetchUserPosts() {
  const token = localStorage.getItem("token");
  console.log("fetchUserPosts token:", token);

  const res = await fetch(`${API_URL_POSTS}/user`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  console.log("fetch status:", res.status, res.ok);
  const text = await res.text();
  console.log("fetch body:", text);

  if (!res.ok) throw new Error("Failed to fetch user posts");
  return JSON.parse(text);
}

export async function fetchPosts() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL_POSTS, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return await res.json();
}

export async function updatePost(id, title, content) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL_POSTS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) {
    const text = await res.text();
    try { throw JSON.parse(text); } catch { throw { message: text }; }
  }
  return await res.json();
}

export async function deletePost(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL_POSTS}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const text = await res.text();
    try { throw JSON.parse(text); } catch { throw { message: text }; }
  }
  return true;
}