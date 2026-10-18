# 升级到 Vitest 5

Vite+ 捆绑 Vitest `5.0.5`。CLI 与测试请使用 Node `^22.18.0 || ^24.11.0 || >=26.0.0`。

## 迁移之前

在手动更新依赖之前，先从工作区根目录运行 `vp migrate`。请保留原始锁文件与已安装的包，以便迁移能够识别源 Vitest 版本，包括较旧的 `vite-plus` 安装中的 runner。

比 Vitest 4 更旧的项目请先升级到 v4，再运行此迁移。如果无法确定原始版本，请恢复并安装原始锁文件，然后重新运行 `vp migrate`。

```bash
vp migrate
vp install
vp check
vp test
```

提交结果之前，请阅读按文件列出的审查报告。对于冲突的 `test.api` 与 `test.browser.api` 设置，或已移除且没有受支持替代方案的运行时 API，迁移会在更新依赖之前停止。解决这些阻塞项并再次运行命令。在仍存在审查项的情况下，你仍可以完成安全编辑并以成功状态退出。

你可以保留等价的静态 `test.api` 与 `test.browser.api` 值，包括属性顺序或引号风格不同的对象。迁移会移除多余的 `browser.api`。对于冲突的值或需要求值的表达式，请选择其中一种配置；v5 只使用一个 API 服务器。

## Node 运行时

迁移会在安装依赖之前把不兼容的运行时固定升级到最近的受支持最低版本。例如 `20.19.0` 变为 `22.18.0`，`24.10.0` 变为 `24.11.0`，`25.9.0` 变为 `26.0.0`。受支持的固定保持不变。无法解析的选择器仍需审查。

请把库公开的 `engines.node` 契约与其测试运行时分开。迁移不会更改该契约。你无需审查带有受支持最低版本（如 `>=22.19.0`）的引擎范围，也无需审查某个受支持的完整主版本（如 `24.x`）。请为该主版本使用不低于受支持最低版本的具体运行时固定。

Node 兼容性检查覆盖 `.node-version`、`.nvmrc`，以及 `package.json` 中的 `engines.node`、`devEngines.runtime` 与 `volta.node` 声明。CI 工作流、容器与其他文件中的 Node 版本不在这些检查范围内。

## 保留现有行为

预览构建会链接到 PR 文档站以获取 Vite+ 指引。发布构建使用 `viteplus.dev`。指向上游 Vitest 文档的链接保持不变。

对于 v4 配置，迁移会在你省略相应选项的地方添加兼容性设置。显式设置优先。每个新增设置旁都会附带注释，说明原因、采用 v5 行为的指引，以及清理清单与 Vitest 迁移指南的链接：

```ts
test: {
  // Vitest v4 兼容性：保留 mock 调用历史。
  // 当测试不再依赖 setup 或更早测试中的调用后移除。
  // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
  // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
  clearMocks: false,
}
```

| 新增设置                                                                                                                    | 移除前需要检查的行为                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`test.clearMocks: false`](https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default)                            | 检查依赖 setup、`beforeAll` 或更早测试中 mock 调用的断言。v5 会在每个测试之前清除该历史。                      |
| [`test.sharedViteServer: false`](https://vitest.dev/guide/migration/#inline-projects-share-the-vite-server-by-default)      | 检查使用共享服务器的插件与配置钩子。v5 会为符合条件的内联项目只初始化一次。                                    |
| [内联 `extends: false`](https://vitest.dev/guide/migration/#inline-projects-inherit-the-root-config-by-default)             | 检查继承的根选项、插件与 setup 文件。v5 会合并数组，因此要避免重复的 setup。                                   |
| [`browser.locators.exact: false`](https://vitest.dev/guide/migration/#locators-are-strict-by-default)                       | 为完全匹配、区分大小写的匹配更新定位器，或在单个定位器上退出该行为。                                           |
| [Glob 阈值 `perFile: true`](https://vitest.dev/guide/migration/#glob-coverage-thresholds-no-longer-inherit-perfile)         | 保留以按文件强制覆盖率。移除以把匹配文件作为一个整体检查。                                                     |
| [`fakeTimers.toNotFake: ['Temporal']`](https://vitest.dev/guide/migration/#fake-timers-and-setsystemtime-now-mock-temporal) | 检查在使用假定时器时使用全局 Temporal polyfill 的测试。若想使用 mock 时间，只移除 `Temporal`；保留其他排除项。 |

新项目使用 v5 默认值。你可能可以在不改代码或仅做小幅本地修复的情况下移除部分生成的兼容性设置。移除之前请遵循以下检查。这些选项在 v5 中仍然受支持；如果移除需要大量测试改动，请暂时保留兼容性。

迁移不会改动你现有的设置与注释。它不会为更早迁移留下的设置添加注释，因为无法把这些设置与你自己的选择区分开。重复运行不会复制注释，也不会恢复你已移除的注释。

如果你的项目没有测试配置，可以直接使用 v5 默认值，无需审查提示或新的兼容性配置。其他迁移步骤（例如合并代码检查配置）可能会创建 `vite.config.ts`；在同一次迁移中，v4 兼容性设置会应用到该新配置。

升级到 v5 之后，你可以重新运行 `vp migrate`，而不会重新应用 v4 兼容性默认值，包括在没有配置的项目中。重新运行迁移之前，请先完成依赖安装。

在丢弃原始依赖之前，请解决或保存首次运行的审查报告。后续运行使用的是当前的 Vitest 版本与文件，因此可能不会重复那些依赖原始 v4 行为的审查。

### 移除不需要的兼容性设置

首先，在兼容性设置完整保留的情况下验证迁移后的项目。然后借助迁移 diff 与 `Vitest v4 compatibility` 注释，找出根配置、工作区配置与内联项目配置中的新增项。原有的用户设置与来源不明的设置保持不变。

每次只移除一个新增设置。检查移除后项目实际使用的值，包括继承的选项、插件与 setup 文件。先在改动代码之前运行受影响的测试套件。在相关场景中包含浏览器与覆盖率运行；Node 测试套件通过并不能验证浏览器定位器。对于 `fakeTimers.toNotFake`，只移除新增的 `Temporal` 条目，并保留其他排除项。

你可以做小幅、本地化的应用、测试或 setup 修复来保留测试意图，例如纠正定位器或在少数测试中调整 mock setup。保持断言与测试覆盖完整，并审查任何快照变化。如果移除需要广泛的测试改动或共享 setup 重构，请暂时保留兼容性并记录后续工作。

如果受影响的测试通过、在未新增跳过的情况下运行同一组测试，并且最终行为可以接受，就保留该移除。同时移除它生成的注释。如果验证仍然失败、必需的测试套件无法运行，或结果仍不确定，请恢复该设置与注释。只撤销仅与清理相关的试验性改动；保留已完成的迁移修复与无关工作。请区分延后的重写与你无法验证的设置。

测试通过并不能证明覆盖率约束未发生变化。除非你打算从按文件阈值切换到聚合检查，否则请保留生成的 glob 阈值 `perFile: true` 设置。代理应就该项改动征求你的批准。参见 [Vitest 的覆盖率阈值迁移](https://vitest.dev/guide/migration/#glob-coverage-thresholds-no-longer-inherit-perfile)。

在逐项检查之后，把所有已接受的移除一并放入完整验证套件运行。为每个候选项报告配置路径、移除决定、代码改动、验证命令与结果，以及任何剩余工作。如果你出于项目选择而保留某个选项，请用该理由替换其兼容性注释。

## 源码变更

迁移会利用语法与导入绑定进行针对性编辑。对于动态选项、含义不明的包装器，或契约无法接受 `async` 的回调，你会得到一个审查项。

```ts
// 之前
test.sequential('result', () => {
  expect(result).resolves.toBe(42);
});

// 之后
test('result', { concurrent: false }, async () => {
  await expect(result).resolves.toBe(42);
});
```

在浏览器测试中，对于 v4 的字符串与正则表达式断言，请使用 `toMatchTextContent`。v4 的字符串匹配器接受部分文本，因此 fixture 中相同的文本并不能证明你要的是 v5 的精确匹配。如果你想要新语义，请自行选择 `toHaveTextContent`。

Node 的 `@testing-library/jest-dom` 断言保持不变。在混合 Node/浏览器包中，迁移会在重命名匹配器之前检查静态项目成员关系。你必须审查共享文件、动态配置与命令行浏览器覆盖。通过 `expect.element()` 发起的调用可以明确识别浏览器断言，不存在这种歧义。

在查询结果之前，请 await 来自 `vitest-browser-vue` 与 `vitest-browser-svelte` 的 `render`。把 `toThrow('')` 与 `toThrowError('')` 替换为 `/^$/`，以保留对空消息的断言。

对于程序化加载配置，请把 `{ viteConfig, vitestConfig }` 解构替换为 `resolveConfig()` 的返回值及其 `.test` 属性。直接迁移的 `vitest list` 命令会获得 `--no-static-parse`；受支持的 `Vitest.collect(filters, options)` 调用会获得 `{ staticParse: false }`。如果你想要 v5 的静态收集，请保留显式的静态解析选择。

## 基准测试

请使用直接的 `bench` 调用，搭配内联的零参数回调，或对未变更本地函数的引用。你可以使用动态名称；迁移会在注册时捕获一次。它会保留工作负载回调，并在测试中通过 v5 的 `bench` fixture 运行它。简单的 `bench.skip`、`bench.only` 与 `bench.todo` 调用会变为对应的测试修饰符。普通 `describe` 与 `suite` 回调内的调用会保留其外层作用域。

```ts
// 之前
import { bench } from 'vitest';
bench('parse', () => JSON.parse('{"value":1}'));

// 之后
import { test } from 'vitest';
test('parse', async ({ bench }) => {
  await bench('parse', () => JSON.parse('{"value":1}')).run();
});
```

请保留由 `benchmark.include` 匹配的基准测试文件。`vitest bench` 与 `vp test bench` 命令仍然受支持。迁移不会移除它们。

你可以把内置的 `benchmark.reporters` 设置（`default` 与 `verbose`）以及字面量 `benchmark.outputFile` 或 `benchmark.outputJson` 路径迁移到顶层 reporters。现有的 reporter 目标优先于建议的移动：冲突路径、终端 reporter 选择与 JSON stdout 使用方需要手动解决。项目特有设置、配置合并以及自定义或动态 reporter 也需要审查。在 v5 中，普通测试与基准测试共享 reporters。

对于 `vitest bench --outputJson=bench.json` 这样的字面量命令，迁移会选择 JSON reporter 并保留文件路径。v5 的 JSON 报告包含测试结果及每个测试的基准数据。如果你在 Vitest 之外使用这些报告，请更新那些期望 v4 格式的读取方。

请审查带基准选项的调用、导入或重新赋值的回调、回调参数或包装器。基线 `compare` 设置与 `--compare` 标志仍是阻塞项。请在测试中设置按基准的结果存储与显式比较。替代方案参见 [Vitest 基准测试迁移指南](https://vitest.dev/guide/migration/#benchmarking-api-rewrite)与[基准测试指南](https://vitest.dev/guide/benchmarking)。如果需要在多个工作负载之间生成比较表，请使用 `bench.compare()`。

## 入口与包

断言与受支持的 runner API 请使用 `vite-plus/test`。覆盖率 provider 与 `@vitest/ui` 请保持捆绑 runner 的确切版本 `5.0.5`。项目使用 `@vitest/web-worker` 时，请保持其版本对齐。

| v4 导入                                  | v5 导入或操作                                          |
| ---------------------------------------- | ------------------------------------------------------ |
| `vitest/coverage`, `vitest/reporters`    | `vite-plus/test/node`                                  |
| `vitest/environments`, `vitest/snapshot` | `vite-plus/test/runtime`                               |
| `vitest/mocker`                          | `vite-plus/test/mocker`                                |
| `vitest/runners`, `vitest/suite`         | 审查 `vite-plus/test` 中的 `TestRunner` 及其静态方法。 |
| 与根兼容的 `@vitest/expect` 符号         | `vite-plus/test`；审查不受支持的辅助函数。             |
| `@vitest/runner`                         | 把受支持的符号迁移到根 API，并审查剩余的导入。         |
| `vitest/internal/module-runner`          | 重新设计该集成；不存在公开的替代方案。                 |
| `@vitest/ws-client`                      | 如需要可保留；上游不再为其添加 v5 特性。               |

Vite+ 1.0 移除了 `vite-plus/test/coverage`、`/reporters`、`/environments` 与 `/snapshot`。运行 `vp migrate` 可把这些现有的 Vite+ 导入重写为上面所示的同一批 `node` 或 `runtime` 入口。Vite+ 保留了 `vite-plus/test/mocker` 以支持独立的 `@vitest/mocker` API。它不提供部分 runner 或 expect 插件 shim。

## 社区 WebDriverIO provider

Vite+ 1.0 移除了 `vite-plus/test/browser-webdriverio` 导出。请使用 `@vitest/browser-webdriverio`，并选择支持你测试的 provider 版本与框架 peer。该包由社区按其自己的发布节奏维护。

`vp migrate` 会把旧有的 provider 导入改为 `@vitest/browser-webdriverio`，并确保 provider 版本至少为 `5.0.0`。它在 provider 缺失时添加 `^5.0.0`，升级较旧的版本，并收窄仍允许 v4 的范围。它还会更新所引用的 catalog 条目，并移除强制使用旧 provider 的 overrides。已高于该最低要求的版本与范围保持不变。迁移会确保所需的 `webdriverio` peer 已安装，且不会升级现有的框架版本。

对于使用该 provider 的项目，`vp migrate` 会添加与捆绑 Vitest 版本匹配的 `@vitest/browser` override。Yarn 使用 `resolutions`。这可防止 provider 的版本范围在锁文件中保留较旧的浏览器包。

此迁移之后的 provider 升级由你管理；Vite+ 不会让社区发布与 Vitest 保持同步。来自社区包的现有导入保持不变。对于迁移工具无法验证的自定义依赖，请先解决诊断问题再重试迁移。参见[上游包迁移指南](https://vitest.dev/guide/migration/#package-migration)。

旧有的 Vite+ WebDriverIO `/context` 导入会移到 `vite-plus/test/browser/context`。请把运行时浏览器 API 保留在这个共享入口上；社区 provider 的 `/context` 入口只包含类型。

可选的 peer 声明仍遵循 Vitest 的依赖元数据。它不提供 Vite+ 导出，也不同步 provider 发布。

## 报告与截图

迁移不会编辑或报告仅影响标题格式、报告输出、产物路径或依赖弃用的改动。它会保持常规 reporter 设置不变，也不会添加 `stdout: true`。已移除的基准测试 API 与标志仍需迁移，以便命令能够运行。

如果你在 Vitest 之外使用生成的报告或产物，请检查以下路径。当文件仍位于这些目录时，请保留旧的忽略条目。迁移会把 `.vitest/` 添加到 `.gitignore`，但不会删除旧条目。

| 输出      | v4 默认值                     | v5 默认值                                  |
| --------- | ----------------------------- | ------------------------------------------ |
| 附件      | `.vitest-attachements/`       | `.vitest/attachments/`                     |
| 失败截图  | `__screenshots__/`            | `.vitest/attachments/failure-screenshots/` |
| Blob 报告 | `.vitest-reports/blob-*.json` | `.vitest/blob/blob-*.json`                 |
| HTML      | `html/index.html`             | `.vitest/index.html`                       |
| JSON      | stdout                        | `.vitest/json/output.json`                 |
| JUnit     | stdout                        | `.vitest/junit/output.xml`                 |

HTML reporter 的选项现在使用 `outputDir`，而不再是取值为文件的 `outputFile`。如果你需要自定义目标位置，请自行设置 `outputDir`。其他 reporter 仍支持 `outputFile`。参见[上游报告变更](https://vitest.dev/guide/migration/#generated-reports-and-artifacts-use-the-vitest-directory)。

请把自定义的 `browser.screenshotDirectory` 复制到 `browser.expect.toMatchScreenshot.screenshotDirectory`。在移动或重新生成基准图片之前请先审查它们；v4 可能把它们保存到非预期的位置。默认的基准截图目录仍为 `__screenshots__`。

## 解决迁移发现的问题

每个 Vitest v5 的 `BLOCK` 或 `REVIEW` 项都包含一个 `Docs` 链接。请按链接查看相关的 API 变更或迁移规则。阻塞项会阻止依赖更新；审查项要求你检查结果，但不会阻止安全编辑。

对于动态配置或共享文件，请在编辑之前确定实际生效的 Vitest 项目设置。解析配置函数、展开与外部继承，或手动完成兼容性改动。在混合 runner 项目中，确认未导入的全局变量归哪个 runner 所有。

对于解析器失败或改动重叠的情况，请保留原始文件并手动应用文档中的改动。解决问题后再次运行 `vp migrate`。成功退出仍可能包含审查项；请保留该报告，直到你完成手动改动。

## 审查清单

请使用迁移报告中的文件位置审查这些改动。除 Node 测试外，还要运行浏览器与覆盖率套件。

对于 jest-dom 匹配器类型，请在 `compilerOptions.types` 中加载 `@testing-library/jest-dom/vitest`，或从 `tsconfig.json` 包含的 TypeScript setup 文件中导入它。根 `@testing-library/jest-dom` 类型入口是对 Jest 的增强。被 `allowJs: false` 排除的 JavaScript setup 文件不会为类型检查加载 Vitest 增强。在更改类型入口之前，请审查共享的 Jest/Vitest 配置。

在 `vitest@5.0.1` 中，先加载浏览器声明还可能让 TypeScript 拒绝有效的 Node jest-dom 断言：`toHaveTextContent(/pattern/)` 以及 `toHaveStyle()` 中的 CSS 自定义属性。我们已用上游导入与 Vite+ 导入复现了该冲突。`@testing-library/jest-dom@6.9.1` 与 `7.0.1` 均可复现。请检查每个测试 `tsconfig.json` 加载的声明；仅添加 jest-dom 类型入口可能无法解决冲突。在受影响项目的 Node 与浏览器匹配器类型分别通过检查之前，请让该项目停留在基于 v4 的版本上。

| 领域            | 必需的审查                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 测试选择        | 完整名称使用 `>` 分隔符。检查跨越套件边界的名称过滤器；普通的单段过滤器无需审查。                                        |
| 提升的 mock     | 在检查被捕获的变量之后，把嵌套的 `vi.mock`、`vi.unmock` 与 `vi.hoisted` 调用移到顶层。                                   |
| 浏览器 automock | 无工厂的 mock 保留 mock 默认值。如果你需要真实实现，请选择 `{ spy: true }`。                                             |
| 构造函数 mock   | 检查 `vi.fn`、`vi.spyOn` 与 `mockImplementation` 的原型、方法与 `instanceof`。                                           |
| 基准测试        | 审查迁移无法转换的基准调用、比较组以及被移除的报告选项。保留 `benchmark.enabled` 与 `benchmark.include` 等受支持的选项。 |
| 异步断言        | await 或返回 `resolves`、`rejects`、文件快照、轮询与浏览器断言。审查 `expect.poll` 的超时，不要用延长超时来掩盖失败。    |
| 匹配器类型      | 更新旧的 `Assertion<T>`、`Matchers<T>` 与 `jest.Matchers` 声明中的返回值与接收值类型参数。                               |
| 浏览器命令      | 接受 `SerializedLocator` 对象，而不是选择器字符串。                                                                      |
| 浏览器 UI       | 使用 Vitest 打印的 URL，包括 UI token 与 orchestrator 的 `sessionId`。在固定视口下检查有头/无头截图。                    |
| 项目配置        | 检查动态项目、根配置合并、嵌套项目，以及假设每个项目只执行一个服务器或一次配置的钩子。                                   |
| 测试收集        | 审查动态命令包装器以及需要手动修改静态解析选项的程序化 `collect()` 调用。                                                |
| 覆盖率          | 对比 v4/v5 在配置的 `coverage.include` 与 `coverage.exclude` 下的解析文件集。相对路径匹配可能改变被度量的集合。          |
| Worker ID       | 审查基于 `VITEST_POOL_ID` 或 `VITEST_WORKER_ID` 的算术与索引；ID 从 1 开始。                                             |
| 自定义环境      | 用 `Object.defineProperty` 恢复 `populateGlobal().originals` 条目；该映射包含描述符。                                    |
| DOM 全局        | 检查 jsdom/happy-dom 测试中的赋值；全局赋值也会更新 window。                                                             |
| Temporal        | 审查使用 Temporal 与 `vi.setSystemTime()` 的作用域。没有假定时器时，`toNotFake` 无法保留行为。                           |
| 已移除的 API    | 在更新包之前替换不受支持的 runner 与内部导入。仅类型的引用仍需要审查与类型检查。                                         |

## 在配置目录下运行

Vitest v5 不再向父目录查找配置。在子目录中运行时，请同时传入父级配置与预期的测试目录：

```bash
vp test --config ../vite.config.ts --dir .
```

API 示例与新的基准测试设计参见[上游 Vitest 5 迁移指南](https://vitest.dev/guide/migration/)。
