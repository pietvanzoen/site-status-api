import { Context } from "oak/mod.ts";
import { debug } from "debug/mod.ts";
import { cyan, green, red, yellow } from "std/fmt/colors.ts";
import { format } from "std/datetime/mod.ts";
const X_RESPONSE_TIME: string = "X-Response-Time";
const User_Agent: string = "User-Agent";

const log = debug("server");
export async function logger(
  { response, request }: Context,
  next: () => Promise<void>,
) {
  await next();
  const responseTime = response.headers.get(X_RESPONSE_TIME);
  const user = request.headers.get(User_Agent);
  log(
    `${request.ip} "${request.method} ${request.url.pathname}" ${
      colorStatus(response.status)
    } ${user} ${responseTime}`,
  );
}

export async function responseTime(
  { response }: Context,
  next: () => Promise<void>,
) {
  const start = Date.now();
  await next();
  const ms: number = Date.now() - start;
  response.headers.set(X_RESPONSE_TIME, `${ms}ms`);
}

function colorStatus(status: number): string {
  return status >= 500
    ? red(status.toString())
    : status >= 400
    ? yellow(status.toString())
    : status >= 300
    ? cyan(status.toString())
    : status >= 200
    ? green(status.toString())
    : red(status.toString());
}
