class API {
  constructor() {
    this.root = "https://beanthealien-server.onrender.com/";
  }
  sendGet(path) {
    return fetch(this.root + path);
  }
  sendPost(path, body = null) {
    const p = this.root + path;
    if(body) return fetch(p, {
        ...this.headers(), body: JSON.stringify(body)
    });
    return fetch(p, this.headers());
  }
  headers() {
    return { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" } };
  }
}
const api = new API();
export { api };