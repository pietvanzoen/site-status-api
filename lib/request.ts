export function request(url: string, init?: RequestInit) {
  return fetch(url, init)
    .then((resp) => {
      if (resp.ok) return resp;
      throw resp;
    })
    .then((resp) => resp.json());
}
