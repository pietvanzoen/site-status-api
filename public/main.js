import { renderStatusHeader } from "./three.js";
const HEADER_CONTAINER = document.getElementById("status-header");
const LIST_CONTAINER = document.getElementById("status-list");
const ITEM_TEMPLATE = document.getElementById("status-item-template");
const HEADER_TEMPLATE = document.getElementById("status-header-template");
const LOADER = document.getElementById("loader");
const UPDATE_DELAY_SECONDS = 30;

const COLOR_MAP = {
  info: "#2B84D3",
  warning: "#EE8A11",
  danger: "#DF342E",
  success: "#17B279",
};

const STATUS_MAP = {
  "ok": {
    message: "Everthing is fine",
    variant: "success",
    icon: ["fa-check-circle"],
  },
  "error": {
    message: "DON'T PANIC",
    variant: "danger",
    speed: 8,
    icon: ["fa-exclamation-triangle"],
  },
  "unknown": {
    message: "Something isn't quite right",
    variant: "warning",
    icon: ["fa-exclamation-triangle"],
  },
  "loading": {
    message: "Standby...",
    variant: "info",
    icon: ["fa-spin", "fa-sync-alt"],
  },
  "fetch-error": {
    message: "Error fetching status",
    variant: "warning",
    icon: ["fa-exclamation-triangle"],
  },
  "none": {
    variant: "secondary",
    icon: [],
  },
};

function main() {
  // HEADER_CONTAINER.replaceChildren(makeStatusHeader("loading"));
  updateStatusHeader("loading");
  LIST_CONTAINER.replaceChildren(...makePlaceHolderStatusItems(5));

  updateStatus();
}

function updateStatus() {
  LOADER.classList.remove("d-none");
  return fetch("/status")
    .then((res) => res.ok ? res : Promise.reject(res))
    .then((res) => res.json())
    .then(({ statuses }) => {
      updateStatusHeader(getGlobalStatus(statuses));
      LIST_CONTAINER.replaceChildren(...makeStatusItems(statuses));
    })
    .catch((error) => {
      updateStatusHeader("fetch-error");
      console.error("Error fetching status", error);
    })
    .finally(() => {
      setTimeout(() => LOADER.classList.add("d-none"), 1000);
      setTimeout(updateStatus, UPDATE_DELAY_SECONDS * 1000);
    });
}

function updateStatusHeader(statusType) {
  const status = STATUS_MAP[statusType];
  const color = COLOR_MAP[status.variant];
  renderStatusHeader(HEADER_CONTAINER, {
    text: status.message,
    color,
    speed: status.speed,
  });
}

function getGlobalStatus(statuses) {
  const { error, unknown } = statuses.reduce(
    (globalStatus, { currentStatus }) => {
      globalStatus[currentStatus]++;
      return globalStatus;
    },
    { ok: 0, error: 0, unknown: 0 },
  );
  if (error > 0) return "error";
  if (unknown > 0) return "unknown";
  return "ok";
}

function makePlaceHolderStatusItems(size) {
  return [...Array(size)].map(() =>
    makeStatusItem({ name: "&nbsp;", currentStatus: "none" })
  );
}
function makeStatusItems(statuses) {
  return statuses.map(makeStatusItem);
}

function makeStatusItem({ name, currentStatus }) {
  const el = ITEM_TEMPLATE.content.cloneNode(true);
  const icon = el.querySelector(".status-icon");

  el.querySelector(".status-name").innerHTML = name;
  icon.classList.add(...STATUS_MAP[currentStatus].icon);
  icon.classList.add(`text-${STATUS_MAP[currentStatus].variant}`);

  return el;
}

main();
