import { debug } from "debug/mod.ts";
import { request } from "./request.ts";
import { Router, Status } from "oak/mod.ts";
import { loadConfig } from "./config.ts";
import { flow } from "./helpers.ts";
import { buildStatusRequests, StatusRequest } from "./build-statuses.ts";

const log = debug("router");
const startTime = Date.now();
const CONFIG_PATH = Deno.env.get("SSAPI_CONFIG") || "./config.yaml";

export function initRouter(): Router {
  const router = new Router();

  router.get("/status", async (ctx) => {
    const config = loadConfig(CONFIG_PATH);

    const statuses = await Promise.all(config.statuses.map(flow([
      buildStatusRequests,
      ({ config, fetchArgs, parseStatus }: StatusRequest) => {
        const { url, options } = fetchArgs;
        return request(url, options)
          .then((status) => {
            log("%o", status);
            return {
              ...config,
              currentStatus: parseStatus(status),
            };
          })
          .catch((error) => {
            log(`Error: %s returned an error: %o`, config.name, error);
            return {
              ...config,
              currentStatus: "unknown",
            };
          });
      },
    ])));

    ctx.response.body = { statuses };
  });

  router.get("/healthcheck", ({ response }) => {
    loadConfig(CONFIG_PATH);
    response.status = Status.OK;
    response.body = {
      uptime: Date.now() - startTime,
    };
  });

  return router;
}
