
const API_URL = "http://localhost:8080/auth/login"; 
// change backend runs on something else

export async function login(username, password) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username, // must match LoginRequest.getUsername()
      password, // must match LoginRequest.getPassword()
    }),
  });

  if (!response.ok) {
    // 401 or other error → throw so the UI can show a message
    throw new Error("Login failed");
  }

  const data = await response.json();

  // localStorage.setItem("token", data.token);
  // localStorage.setItem("user", JSON.stringify(data));

  return data; //JwtResponse
}
