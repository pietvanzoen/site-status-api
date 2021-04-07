
export interface StatusConfig {
  name: string;
  freshpingCheckId?: number;
  healthcheckId?: string;
}

interface StatusUpdate {
  name: string;
  currentStatus: "ok" | "error";
}

export function buildStatuses(
  statuses: StatusConfig[],
): Promise<StatusUpdate[]> {
  console.log({ statuses });
  return Promise.all(statuses.map(fetchStatus));
}

function fetchStatus(config: StatusConfig): Promise<StatusUpdate> {
  if (config.freshpingCheckId) {
    return fetchFreshpingStatus(config);
  } else if (config.healthcheckId) {
    return fetchHealthcheckStatus(config);
  } else {
    return Promise.reject(new Error("Bad config"));
  }
}

function fetchFreshpingStatus(config: StatusConfig): Promise<StatusUpdate> {
  return fetch(
    `https://api.freshping.io/v1/public-check-statuses/${config.freshpingCheckId}/`,
  )
    .then((resp) => resp.json())
    .then((data) => {
      console.log({ name: config.name, data })
      return {
        name: config.name,
        currentStatus: data.state === "AV" ? "ok" : "error",
      };
    });
}

function fetchHealthcheckStatus(config: StatusConfig): Promise<StatusUpdate> {
    const headers = new Headers();
  headers.append("x-api-key", Deno.env.get("HEALTHCHECKIO_API_KEY") || '');
  return fetch(
    `https://healthchecks.io/api/v1/checks/${config.healthcheckId}`,
    {
      headers,
    },
  )
    .then((resp) => resp.json())
    .then((data) => {
      console.log({ name: config.name, data })
      return {
        name: config.name,
        currentStatus: data.status === "up" ? "ok" : "error",
      };
    });

}
