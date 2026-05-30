async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  }

  throw { message: jsonResponse };
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
    return data.Result;
  }

  async findProductById(id) {
    const data = await this.request(`product/${id}`);
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
