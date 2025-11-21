const BASE_URL = "/auth";

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json(); // JwtResponse
}

export async function register(userData) {
  // userData = { username, email, password, phoneNumber, address } de ex.
  const response = await fetch(`/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Register failed");
  }

  // Some backends return 201 with no body for register.
  // Since your UI doesn't use the response, we can safely just return nothing.
  try {
    return await response.json();
  } catch {
    return null;
  }
}
