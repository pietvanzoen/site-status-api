import { debug } from "https://deno.land/x/debug/mod.ts";

import {
  Response,
  ServerRequest,
} from "https://deno.land/std@0.92.0/http/server.ts";

const log = debug("api");

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

export function logResponse(req: ServerRequest, res: Response): Response {
  log("%s %s %d", req.method, req.url, res.status);
  return res;
}
