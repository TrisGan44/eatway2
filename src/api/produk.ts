const BASE_URL = "http://localhost:8000";

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/produks`);
  return res.json();
}

export async function getProduct(id: number) {
  const res = await fetch(`${BASE_URL}/produks/${id}`);
  return res.json();
}

export async function createProduct(body: any) {
  const res = await fetch(`${BASE_URL}/produks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateProduct(id: number, body: any) {
  const res = await fetch(`${BASE_URL}/produks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${BASE_URL}/produks/${id}`, {
    method: "DELETE"
  });
  return res.json();
}
