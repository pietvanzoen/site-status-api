import { debug } from "https://deno.land/x/debug/mod.ts";
import { StatusConfig } from "./build-statuses.ts";
import { parse } from "https://deno.land/std@0.92.0/encoding/yaml.ts";

const log = debug("config");

export interface ServerConfig {
  statuses: StatusConfig[];
}

export function loadConfig(path: string): ServerConfig {
  log("Loading config from %s", path);
  return parse(Deno.readTextFileSync(path)) as ServerConfig;
}
