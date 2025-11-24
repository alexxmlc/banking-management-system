export async function login(username, password) {
  const response = await fetch(`/auth/login`, {
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

  try {
    return await response.json();
  } catch {
    return null;
  }
}
