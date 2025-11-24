const BASE_URL = "http://localhost:8000";

export async function getCart() {
  const res = await fetch(`${BASE_URL}/carts`);
  return res.json();
}

export async function addToCart(body: any) {
  const res = await fetch(`${BASE_URL}/carts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateCart(id: number, body: any) {
  const res = await fetch(`${BASE_URL}/carts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteCart(id: number) {
  const res = await fetch(`${BASE_URL}/carts/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
