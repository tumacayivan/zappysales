// Thin fetch wrapper. Centralizing it here means:
//   - components don't repeat headers / error handling
//   - the base URL is configurable in one place
//   - swapping fetch for axios/react-query later is a one-file change

const BASE = '/api';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ---- Users ----
export const listUsers          = ()             => request('/users');
export const getUser            = (id)           => request(`/users/${id}`);
export const createUser         = (payload)      => request('/users', { method: 'POST', body: payload });
export const updateUser         = (id, payload)  => request(`/users/${id}`, { method: 'PUT', body: payload });
export const deleteUser         = (id)           => request(`/users/${id}`, { method: 'DELETE' });

// ---- Addresses (nested under a user) ----
export const listAddresses      = (userId)                 => request(`/users/${userId}/addresses`);
export const createAddress      = (userId, payload)        => request(`/users/${userId}/addresses`, { method: 'POST', body: payload });
export const updateAddress      = (userId, addrId, payload)=> request(`/users/${userId}/addresses/${addrId}`, { method: 'PUT', body: payload });
export const deleteAddress      = (userId, addrId)         => request(`/users/${userId}/addresses/${addrId}`, { method: 'DELETE' });
