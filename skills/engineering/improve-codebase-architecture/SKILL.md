---
name: improve-codebase-architecture
description: 扫描代码库中的深化机会，直接描述需要修改的内容，然后围绕你选中的候选项继续追问。
disable-model-invocation: true
---

# 改进代码库架构

暴露 architectural friction，并提出 **deepening opportunities**：把 shallow modules 变成 deep modules 的 refactors。目标是 testability 和 AI-navigability。

这个命令由项目的 domain model 提供信息，并建立在共享 design vocabulary 上：

- 调用 Skill 工具并指定 `codebase-design`，获取 architecture vocabulary（**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**）及其 principles（deletion test、"the interface is the test surface"、"one adapter = hypothetical seam, two = real"）。每条建议都准确使用这些术语，不要漂移到 "component"、"service"、"API" 或 "boundary"。
- `GLOSSARY.md` 中的 domain language 会为好的 seams 命名；`docs/adr/` 中的 ADRs 记录这个命令不应重新争论的 decisions。

## 流程

### 1. 探索

**先划定扫描范围：YAGNI。** 深化 module 的收益在于让未来修改更容易，因此要更关注最近仍在变化的 codebase 区域。开始探索前先决定去哪里看：

- 如果用户点名了方向（module、subsystem 或 pain point），就按该方向探索，跳过下面的推断。
- 否则，向前回看一段足够长的 commit history（`git log --oneline`），找出反复出现的 files 和 areas，让这些 hot spots 成为首要关注点。如果变更分散、没有明显 hot spot，再扩大范围。

先读取项目 domain glossary（`GLOSSARY.md`）以及你将触碰区域的 ADRs。

然后 spawn 一个 sub-agent 来遍历 codebase。不要套死板 heuristics；自然探索，并记录你感到 friction 的地方：

- 理解一个概念是否需要在许多小 modules 之间来回跳？
- 哪些 modules 是 **shallow** 的，即 interface 几乎和 implementation 一样复杂？
- 是否存在为了 testability 抽出的 pure functions，但真正 bugs 藏在它们如何被调用之处（没有 **locality**）？
- 哪些 tightly-coupled modules 泄漏到了 seams 之外？
- Codebase 的哪些部分未测试，或很难通过当前 interface 测试？

对任何你怀疑 shallow 的东西应用 **deletion test**：删除它会让复杂度集中，还是只把复杂度移动到别处？"yes, concentrates" 才是你要的 signal。

<<<<<<< HEAD
### 2. Present candidates directly
=======
### 2. 用 HTML 报告呈现候选项
>>>>>>> upstream/HEAD

直接在对话中呈现 candidates——不生成 HTML、不写文件、不打开浏览器。每个 candidate 用紧凑结构列出：

- **Files** - 涉及哪些 files/modules
- **Problem** - 当前 architecture 为什么造成 friction
<<<<<<< HEAD
- **Solution** - 会改变什么，用 plain English 描述，含 before → after 的转变
- **Benefits** - 用 locality 与 leverage 解释收益，以及 tests 如何改善
- **Recommendation strength** - `Strong`、`Worth exploring`、`Speculative` 之一
=======
- **Solution** - 会改变什么，用平实的语言描述
- **Benefits** - 用 locality 与 leverage 解释收益，以及 tests 如何改善
- **Before / After diagram** - side-by-side，自绘，说明 shallowness 与 deepening
- **Recommendation strength** - `Strong`、`Worth exploring`、`Speculative` 之一，渲染为 badge

Report 末尾包含**首选推荐区**：你会先处理哪个 candidate，以及为什么。
>>>>>>> upstream/HEAD

**用 `GLOSSARY.md` vocabulary 表达 domain，用 `/codebase-design` vocabulary 表达 architecture。** 如果 `GLOSSARY.md` 定义了 "Order"，就说 "Order intake module"，不要说 "FooBarHandler"，也不要说 "Order service"。

**ADR conflicts**：如果 candidate 与现有 ADR 冲突，只有在 friction 真实到值得重新打开 ADR 时才提出。候选中明确标记（例如 warning：_"contradicts ADR-0007 - but worth reopening because..."_）。不要列出 ADR 理论上禁止的每个 refactor。

末尾给出 **Top recommendation**：你会先处理哪个 candidate，以及为什么。

现在不要提出 interfaces。展示完 candidates 后问用户："Which of these would you like to explore?"

### 3. Grilling 循环

用户选中 candidate 后，调用 Skill 工具并指定 `grilling`，与用户走完 decision tree：constraints、dependencies、deepened module 的形状、seam 后面放什么、哪些 tests 能保留。

Side effects 随 decisions 成形而内联发生；调用 Skill 工具并指定 `domain-modeling`，让 domain model 保持最新：

- **要用 `GLOSSARY.md` 中不存在的概念命名 deepened module？** 把 term 加入 `GLOSSARY.md`。若文件不存在，按需创建。
- **对话中打磨了 fuzzy term？** 立即更新 `GLOSSARY.md`。
- **用户以 load-bearing reason 拒绝了 candidate？** 提议写 ADR，表述为：_"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ 只有当未来 explorer 确实需要该 reason 以避免再次提出同样建议时才提议；跳过临时原因（"not worth it right now"）和显而易见原因。
- **想探索 deepened module 的 alternative interfaces？** 调用 Skill 工具并指定 `codebase-design`，并使用其中的 design-it-twice parallel sub-agent pattern。
