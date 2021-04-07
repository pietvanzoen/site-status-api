import { StatusConfig } from "./build-statuses.ts";
import { parse } from "https://deno.land/std@0.92.0/encoding/yaml.ts";

export interface ServerConfig {
  statuses: StatusConfig[];
}

export function loadConfig(path: string): ServerConfig {
  return parse(Deno.readTextFileSync(path)) as ServerConfig;
}
