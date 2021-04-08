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

export function buildStatusRequests(config: StatusConfig): StatusRequest {
  const { service, name, id } = config;
  const { url, options = {}, parseStatus } = SERVICE_STRATEGIES[service];
  return {
    config,
    fetchArgs: { url: url(id), options },
    parseStatus,
  };
}

export interface StatusConfig {
  name: string;
  service: string;
  id: string | number;
}

export interface StatusRequest {
  config: StatusConfig;
  fetchArgs: FetchArgs;
  parseStatus: StatusParser;
}

export interface FetchArgs {
  url: string;
  options: RequestInit;
}

type CurrentStatus = "ok" | "error" | "unknown";
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
