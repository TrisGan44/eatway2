const BASE_URL = "http://localhost:8000";

export interface LoginResponse {
  accessToken?: string;
  user?: {
    role?: string;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}

// GET ALL
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
}

// GET BY ID
export async function getUser(id: number) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  return res.json();
}

// CREATE
export async function createUser(body: any) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// UPDATE
export async function updateUser(id: number, body: any) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// DELETE
export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE"
  });
  return res.json();
}

// LOGIN
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data: LoginResponse = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = typeof data?.message === "string" ? data.message : "Login failed";
    throw new Error(message);
  }

  return data;
}
