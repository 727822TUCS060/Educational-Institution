// Talks to the Google Apps Script web app (Google Sheets as the database).
// To use a different deployment, set VITE_API_URL in a .env file.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://script.google.com/macros/s/AKfycbyR8IOekvcp92ovUuWLcQYkvage6SPG-_2l1YWG5mdQibrRL-ATvsEoNYgfYAXQFQfN/exec';

async function request(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error('Cannot reach the server. Check your internet connection and the API URL.');
  }
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error('Unexpected response from the server. Make sure the Apps Script is deployed for "Anyone".');
  }
  if (!json.ok) throw new Error(json.error || 'Request failed');
  return json;
}

// Public reads: 'books' | 'courses'
export const apiGet = (action) => request(`${API_URL}?action=${action}`);

// Auth + owner writes. The body is sent as plain text so the browser skips the CORS preflight
// (Apps Script web apps do not answer OPTIONS requests).
export const apiPost = (action, payload = {}, token = '') =>
  request(API_URL, { method: 'POST', body: JSON.stringify({ action, token, ...payload }) });
