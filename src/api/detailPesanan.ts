const BASE_URL = "http://localhost:8000";

export async function getOrderDetails() {
  const res = await fetch(`${BASE_URL}/detail-pesanan`);
  return res.json();
}

export async function getOrderDetail(id: number) {
  const res = await fetch(`${BASE_URL}/detail-pesanan/${id}`);
  return res.json();
}

export async function createOrderDetail(body: any) {
  const res = await fetch(`${BASE_URL}/detail-pesanan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateOrderDetail(id: number, body: any) {
  const res = await fetch(`${BASE_URL}/detail-pesanan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteOrderDetail(id: number) {
  const res = await fetch(`${BASE_URL}/detail-pesanan/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
