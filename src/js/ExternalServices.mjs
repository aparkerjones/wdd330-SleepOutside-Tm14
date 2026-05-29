async function convertToJson(res) {
  let jsonResponse = {};

  try {
    jsonResponse = await res.json();
  } catch (error) {
    jsonResponse = { message: "Unexpected server response." };
  }

  if (res.ok) {
    return jsonResponse;
  }

  throw { name: "servicesError", message: jsonResponse };
}

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ExternalServices {
  constructor(url = baseURL) {
    this.baseURL = url;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    return convertToJson(response);
  }

  async checkout(payload) {
    return this.request("checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
}
