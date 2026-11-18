// Bridge rpiv questionnaire waits to Herdr's managed agent-state integration.
// Keep this separate from herdr-agent-state.ts, which Herdr overwrites on update.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  const pending = new Set<string>();

  pi.events.on("rpiv:ask-user:blocked", (data: unknown) => {
    if (!data || typeof data !== "object") return;
    const { active, toolCallId } = data as { active?: unknown; toolCallId?: unknown };
    if (typeof toolCallId !== "string" || !toolCallId) return;

    if (active === true && !pending.has(toolCallId)) {
      pending.add(toolCallId);
      pi.events.emit("herdr:blocked", { active: true, label: "Waiting for user answer" });
    } else if (active === false && pending.delete(toolCallId)) {
      pi.events.emit("herdr:blocked", { active: false });
    }
  });

  pi.on("session_shutdown", () => {
    for (const _id of pending) pi.events.emit("herdr:blocked", { active: false });
    pending.clear();
  });
}
