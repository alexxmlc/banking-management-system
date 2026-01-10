export async function login(username, password, code) {
  const response = await fetch(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.trim(),
      password,
      ...(code ? { code } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorText(response));
  }

  return response.json();

}


async function readErrorText(res) {
  const text = await res.text().catch(() => "");
  return text || `${res.status} ${res.statusText}`;
}


export async function uploadDocument(file) {
  const fd = new FormData();
  // IMPORTANT: numele trebuie să fie exact "document" ca în @RequestPart MultipartFile document
  fd.append("document", file);

  const res = await fetch(`/documents/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    throw new Error(await readErrorText(res));
  }
  return res.json(); // ExtractedData
}


export async function register(userData) {
  const res = await fetch(`/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error(await readErrorText(res));
  }

  // dacă backend-ul nu întoarce JSON (posibil), nu crăpăm:
  const text = await res.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }

}

export async function get2faQrPng(userId) {
  const res = await fetch(`/auth/2fa/setup/${encodeURIComponent(userId)}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error(await readErrorText(res));

  const blob = await res.blob();
  return URL.createObjectURL(blob); // <-- folosești asta în <img src=...>
}

// POST /auth/2fa/verify/{userId} body: { code: "123456" }
export async function verify2faCode(userId, code) {
  const res = await fetch(`/auth/2fa/verify/${encodeURIComponent(userId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (res.status === 400) return false; // cod greșit
  if (!res.ok) throw new Error(await readErrorText(res));
  return true;
}

//helper pentru request-uri
function authHeaders(){
  const token = localStorage.getItem("token");
  return token ? {Authorization: `Bearer ${token}`} : {};
}


//NOTIFICARI

//iau notificarile utilizatorului
export async function getMyNotifications(){
  const res = await fetch(`/api/notifications`, {
    //se foloseste metoda GET
    method: "GET",
    //adaug header-ele
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(await readErrorText(res));

  return res.json(); //face return la List<NotificationDto>
}

//iau notificarile necitite ale utilizatorului
export async function getUnreadCount(){
  const res = await fetch(`/api/notifications/unread-count`, {
    method: "GET",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(await readErrorText(res));

  return res.json(); //o sa dea ceva gen {count : number}
}

export async function markNotificationAsRead(id) {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json"  },
  });

  if (!res.ok) throw new Error(await readErrorText(res));
  return res.json(); // { count: number }
}

export async function markAllNotificationsAsRead() {
  const res = await fetch(`/api/notifications/read-all`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(await readErrorText(res));
  return res.json(); // { count: number }
}



//ACCOUNT

//asta ia conturile de la user
export async function getMyAccounts(){
  const res = await fetch("/accounts/me", {
    method: "GET",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
  });

  if(!res.ok){
    throw new Error (await res.text());
  }

  return res.json(); //cred ca ar trebui sa returneze ceva gen List<Account>

}

//asta ii functie pentru creare cont nou
export async function createAccount(currency){
  const res = await fetch("/accounts", {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },

    body: JSON.stringify({currency}),

  });

  if(!res.ok){
    throw new Error (await res.text());
  }

  return res.json();
}


