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

const defaultServerURL = "https://wdd330-backend.onrender.com/";
const baseURL = import.meta.env.VITE_SERVER_URL || defaultServerURL;

export default class ExternalServices {
  constructor(url = baseURL) {
    this.baseURL = url;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    return convertToJson(response);
  }

  async getData(category) {
    const data = await this.request(`products/search/${category}`);
    if (Array.isArray(data)) {
      return data;
    }

    return data.Result || [];
  }

  async findProductById(id) {
    const data = await this.request(`product/${id}`);
    if (Array.isArray(data)) {
      return data.find((item) => item.Id === id);
    }

    return data.Result;
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
