import "https://deno.land/x/dotenv/load.ts";
import { debug } from "https://deno.land/x/debug/mod.ts";
import { serve } from "https://deno.land/std@0.92.0/http/server.ts";
import { loadConfig } from "./lib/config.ts";
import { flow } from "./lib/helpers.ts";
import { buildStatusRequests, StatusRequest } from "./lib/build-statuses.ts";
import { logResponse, makeJSONResponse, notFound } from "./lib/api.ts";

const log = debug("main");
const logFetch = debug("fetch");

const PORT = 8080;
const s = serve({ port: PORT });

log(`Listening on http://localhost:%s`, PORT);

for await (const req of s) {
  log("Request: %s %s", req.method, req.url);
  if (req.url !== "/") {
    req.respond(logResponse(req, notFound()));
  } else {
    try {
      const config = loadConfig(
        Deno.env.get("SSAPI_CONFIG") || "./config.yaml",
      );

      const statuses = await Promise.all(config.statuses.map(flow([
        buildStatusRequests,
        ({ config, fetchArgs, parseStatus }: StatusRequest) => {
          const { url, options } = fetchArgs;
          logFetch(url);
          return fetch(url, options)
            .then((r) => r.json())
            .then((status) => ({
              ...config,
              currentStatus: parseStatus(status),
            }))
            .catch((error) => {
              log(`Error: %s returned an error: %o`, config.name, error);
              return {
                ...config,
                currentStatus: "unknown",
              };
            });
        },
      ])));

      req.respond(logResponse(
        req,
        makeJSONResponse(200, {
          statuses,
        }),
      ));
    } catch (error) {
      console.error(error);
      req.respond(logResponse(
        req,
        makeJSONResponse(500, {
          message: error.toString() || "Something went wrong",
        }),
      ));
    }
  }
}
