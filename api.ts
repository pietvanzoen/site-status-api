import "https://deno.land/x/dotenv/load.ts";
import {
  Response,
  serve,
  ServerRequest,
} from "https://deno.land/std@0.92.0/http/server.ts";
import { buildStatuses } from "./build-statuses.ts";
import { loadConfig } from "./config.ts";

const PORT = 8080;
const s = serve({ port: PORT });

console.log(` Listening on http://localhost:${PORT}/`);

for await (const req of s) {
  if (req.url !== "/") {
    req.respond(notFound());
  } else {
    try {
      const config = loadConfig(
        Deno.env.get("SSAPI_CONFIG") || "./config.yaml",
      );
      const statuses = await buildStatuses(config.statuses);
      req.respond(makeJSONResponse(200, {
        statuses,
      }));
    } catch (error) {
      console.error(error);
      req.respond(makeJSONResponse(500, {
        message: error.toString() || "Something went wrong",
      }));
    }
  }
}

function notFound(): Response {
  return makeJSONResponse(404, {
    message: "Not found",
  });
}

function makeJSONResponse(status: number, body: any): Response {
  const headers = new Headers();
  headers.append("content-type", "application/json");
  return {
    status,
    headers,
    body: JSON.stringify(body),
  };
}
