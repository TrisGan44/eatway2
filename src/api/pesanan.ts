const BASE_URL = "http://localhost:8000";

export async function getOrders() {
  const res = await fetch(`${BASE_URL}/pesanans`);
  return res.json();
}

export async function getOrder(id: number) {
  const res = await fetch(`${BASE_URL}/pesanans/${id}`);
  return res.json();
}

export async function createOrder(body: any) {
  const res = await fetch(`${BASE_URL}/pesanans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateOrder(id: number, body: any) {
  const res = await fetch(`${BASE_URL}/pesanans/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteOrder(id: number) {
  const res = await fetch(`${BASE_URL}/pesanans/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
