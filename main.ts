import "https://deno.land/x/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.92.0/http/server.ts";
import { loadConfig } from "./lib/config.ts";
import { flow } from "./lib/helpers.ts";
import { buildStatusRequests, StatusRequest } from "./lib/build-statuses.ts";
import { makeJSONResponse, notFound } from "./lib/api.ts";

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

      const statuses = await Promise.all(config.statuses.map(flow([
        buildStatusRequests,
        ([[url, options], buildStatusUpdate]: StatusRequest) =>
          fetch(url, options)
            .then((r) => r.json().then(buildStatusUpdate)),
      ])));

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
