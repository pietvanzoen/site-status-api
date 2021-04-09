import { Context, isHttpError, Status } from "oak/mod.ts";

export async function handleError(
  { request, response }: Context,
  next: () => Promise<void>,
) {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case Status.NotFound:
          response.status = Status.NotFound;
          response.body = {
            msg: `Route ${request.method} ${request.url.pathname} not found`,
          };
          break;
        default:
          response.status = Status.BadRequest;
          response.body = { msg: `Request cannot be processed currently` };
      }
    } else {
      response.status = Status.InternalServerError;
      response.body = { msg: err.message };
    }
  }
}
