export const SERVICE_STRATEGIES: { [name: string]: ServiceStrategy } = {
  freshping: {
    url: (id) => `https://api.freshping.io/v1/public-check-statuses/${id}/`,
    parseStatus: (data) => data.state === "AV" ? "ok" : "error",
  },

  healthcheckio: {
    url: (id) => `https://healthchecks.io/api/v1/checks/${id}`,
    options: {
      headers: {
        "x-api-key": Deno.env.get("HEALTHCHECKIO_API_KEY") || "",
      },
    },
    parseStatus: (data) => data.status === "up" ? "ok" : "error",
  },
};

export function buildStatusRequests(
  { service, name, id }: StatusConfig,
): StatusRequest {
  const { url, options = {}, parseStatus } = SERVICE_STRATEGIES[service];
  return [
    [url(id), options],
    (data: any) => ({
      name,
      currentStatus: parseStatus(data),
    }),
  ];
}

export interface StatusConfig {
  name: string;
  service: string;
  id: string | number;
}

export type StatusRequest = [FetchArgs, StatusUpdateParser];

export type FetchArgs = [string, RequestInit];
type CurrentStatus = "ok" | "error";
interface StatusUpdate {
  name: string;
  currentStatus: CurrentStatus;
}
type StatusParser = (input: any) => CurrentStatus;
type StatusUpdateParser = (data: any) => StatusUpdate;

interface ServiceStrategy {
  url: (id: string | number) => string;
  options?: RequestInit;
  parseStatus: StatusParser;
}
