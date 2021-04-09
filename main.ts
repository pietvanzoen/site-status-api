import "dotenv/load.ts";
import { debug } from "debug/mod.ts";
import { Application } from "oak/mod.ts";
import { handleError } from "./lib/error-handler.ts";
import { initRouter } from "./lib/router.ts";
import { logger, responseTime } from "./lib/response-logger.ts";

const PORT = Deno.env.get("PORT") || "8080";

const log = debug("main");
const app = new Application();
const router = initRouter();

app.use(logger);
app.use(responseTime);
app.use(handleError);
app.use(router.routes());
app.use(router.allowedMethods());

log(`Listening on http://localhost:${PORT}`);
await app.listen(`0.0.0.0:${PORT}`);
