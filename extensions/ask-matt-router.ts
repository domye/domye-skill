import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * ask-matt 路由器引导扩展。
 *
 * 注册 `/ask-matt` 命令，作为 user-invoked skill `/skill:ask-matt` 的便捷引导入口：
 * 用户在 Pi 里输入 `/ask-matt <情境描述>` 即可让 ask-matt 推荐当前情境合适的 skill 或 flow。
 *
 * ask-matt 是 user-invoked skill（disable-model-invocation: true），不会进入模型上下文；
 * 因此本引导默认可选：想关闭时用 Pi 原生 `pi config` 或 settings 包过滤禁用本扩展即可。
 */
export default function (pi: ExtensionAPI) {
  pi.registerCommand("ask-matt", {
    description:
      "ask-matt 路由器：根据当前情境推荐合适的 skill 或 flow（/skill:ask-matt 的引导入口）",
    handler: async (args, _ctx) => {
      const query = (args ?? "").trim();
      pi.sendUserMessage(query ? `/skill:ask-matt ${query}` : "/skill:ask-matt", {
        expandPromptTemplates: true,
        deliverAs: "followUp",
      });
    },
  });
}
