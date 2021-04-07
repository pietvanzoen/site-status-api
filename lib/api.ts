import { Response } from "https://deno.land/std@0.92.0/http/server.ts";

export function notFound(): Response {
  return makeJSONResponse(404, {
    message: "Not found",
  });
}

export function makeJSONResponse(status: number, body: any): Response {
  return {
    status,
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify(body),
  };
}
