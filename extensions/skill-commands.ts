import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize } from "node:path";

/**
 * 为每个 skill 注册无前缀短命令（如 /ask-matt、/tdd、/code-review），转发到对应 /skill:<name>。
 *
 * 命令描述复用各 SKILL.md frontmatter 的 description，让 / 命令列表与补全自带介绍。
 * 仅注册本包 skills/ 目录下的 skills，避免干扰其他已装包的 skills；
 * 短名与已有 extension command 重名时自动跳过（如 /ponytail-review），避免 Pi 生成 `:1` 后缀。
 */
const SKILLS_ROOT = normalize(
  join(dirname(fileURLToPath(import.meta.url)), "..", "skills")
).toLowerCase();

export default function (pi: ExtensionAPI) {
  pi.on("resources_discover", () => {
    registerSkillCommands(pi);
  });
}

function registerSkillCommands(pi: ExtensionAPI): void {
  const commands = pi.getCommands();
  const existing = new Set(commands.map((c) => c.name));

  for (const c of commands) {
    if (c.source !== "skill") continue;
    const path = normalize(c.sourceInfo?.path ?? "").toLowerCase();
    if (!path.startsWith(SKILLS_ROOT)) continue;
    const short = c.name.replace(/^skill:/, "");
    if (existing.has(short)) continue;
    pi.registerCommand(short, {
      description: c.description ?? `加载 skill ${c.name}`,
      handler: async (args, _ctx) => {
        const query = (args ?? "").trim();
        pi.sendUserMessage(query ? `/skill:${short} ${query}` : `/skill:${short}`, {
          expandPromptTemplates: true,
          deliverAs: "followUp",
        });
      },
    });
  }
}
