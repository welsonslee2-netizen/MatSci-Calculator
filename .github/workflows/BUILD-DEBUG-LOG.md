# iOS Build CI Debug 日志

记录 `build-ios.yml` 所有遇到过的错误、根因和修复方案，方便重复 debug。

---

## 错误 #1 — YAML 重复 key `if-no-files-found`

- **时间**: 2026-04-19
- **错误信息**: `Invalid workflow file: build-ios.yml#L1 (Line 167, Col 11): 'if-no-files-found' is already defined`
- **根因**: `Upload IPA` step 中 `if-no-files-found: error` 和 `if-no-files-found: warn` 重复定义
- **修复**: 删除重复行，保留 `if-no-files-found: warn`
- **状态**: ✅ 已解决

---

## 错误 #2 — SideLoadly 安装失败 `CFBundleIdentifier`

- **时间**: 2026-04-19
- **错误信息**: `CFBundleIdentifier` 缺失/无效，SideLoadly 报 `Guru Meditation`
- **根因**: IPA 内 `Payload/App.app/Info.plist` 不存在或内容无效
- **修复**: 
  1. 构建后添加 Info.plist 三级 fallback：中间产物 → build 目录搜索 → 从零生成
  2. `find` 排除 `*storyboardc*` 和 `*Assets.car*` 路径
- **状态**: ✅ 已解决

---

## 错误 #3 — `tee` 吞掉 xcodebuild 退出码

- **时间**: 2026-04-19
- **错误信息**: Build exit code: 0（实际构建失败）
- **根因**: `xcodebuild ... 2>&1 | tee build.log` 中 `tee` 的退出码覆盖了 xcodebuild 的
- **尝试**: `set -o pipefail` — 不可靠
- **最终修复**: 用 `grep -c "BUILD FAILED"` 检测字符串，不依赖退出码
- **状态**: ✅ 已解决

---

## 错误 #4 — AppDelegate.swift `extra argument 'restorationHandler'`

- **时间**: 2026-04-19
- **错误信息**: 
  ```
  AppDelegate.swift:46:117: error: extra argument 'restorationHandler' in call
  AppDelegate.swift:46:83: error: cannot convert value of type 'NSUserActivity' to expected argument type 'URL'
  ```
- **根因**: Capacitor 8 生成的 `AppDelegate.swift` 调用了 `ApplicationDelegateProxy.shared.application(_:continue:restorationHandler:)`，但 Xcode 16.2 / Swift 5.10 的 `ApplicationDelegateProxy` **没有** `continue` 方法，只有 `application(_:open:options:)`
- **尝试修复**:
  1. ❌ `sed` 删除 `restorationHandler` 参数 → 新错误 `extra argument 'continue'`
  2. ❌ `awk` 删除整个方法 → 删多了 `}` 导致 `expected '}' in class`
  3. ✅ `printf` 覆盖整个文件为最小可编译版本（见 #6）
- **状态**: ✅ 已解决

---

## 错误 #5 — awk 删除方法导致大括号不匹配

- **时间**: 2026-04-19
- **错误信息**: `expected '}' in class`
- **根因**: `awk` 匹配 `continueUserActivity` 方法的闭合 `}` 时，那个 `}` 同时也是 class 的闭合括号（或者缩进匹配错误），导致 class 缺少闭合 `}`
- **教训**: 不要用 awk/sed 删除 Swift 代码块——Swift 的 `{}` 嵌套太复杂，正则匹配极容易出错
- **修复**: 放弃 awk 方案，改为覆盖整个文件（见 #6）
- **状态**: ✅ 已解决

---

## 错误 #6 — YAML heredoc 缩进问题

- **时间**: 2026-04-19
- **错误信息**: `Invalid workflow file: build-ios.yml#L75 — You have an error in your yaml syntax on line 75`
- **根因**: 在 YAML `run: |` 块内使用 `cat << 'SWIFT'` heredoc，heredoc 内的 Swift 代码没有缩进（缩进为 0），但 YAML block scalar 要求所有内容缩进一致。无缩进的行被 YAML 解析器当作新的顶级 key
- **修复**: 放弃 heredoc，改用 `printf '%s\n' 'line1' 'line2' ... > file` 逐行写入。printf 的所有参数都是带引号的字符串，不受 YAML 缩进影响
- **教训**: 
  - 在 YAML 的 `run: |` 块中**避免使用 heredoc**
  - 如果必须写多行文件内容，用 `printf` 或 `echo` 逐行，或者把文件放在仓库里用 `cp`
- **状态**: ✅ 已解决

---

## 错误 #7 — Icon 白边 / Asset Catalog 问题

- **时间**: 2026-04-19
- **错误信息**: 图标在设备上显示白边
- **根因**: `@capacitor/assets` 生成的 icon 资源不正确
- **修复**: 不用 `@capacitor/assets`，直接用 `sips` 调整图片大小后写入 `AppIcon.appiconset/AppIcon.png`，配合 `Contents.json` 声明单张 1024x1024 universal icon
- **状态**: ✅ 已解决

---

## 关键教训

### Capacitor + Xcode 版本兼容性
- **Capacitor 8 生成的 AppDelegate.swift 在 Xcode 16.2 下可能无法编译**（API 签名变更）
- 如果本地 macOS 版本高于 CI runner，`cap sync` 会在本地生成新版本代码，但 CI 的 Xcode 不认识
- **解决方案**: CI 中 `cap sync` 后用已知正确的版本覆盖原生文件

### YAML + Shell 注意事项
- **YAML `run: |` 块中不要用 heredoc**（`<< EOF`），缩进冲突会导致 YAML 解析失败
- 用 `printf` 或 base64 编码代替
- 或者把文件模板放在仓库里，CI 中 `cp` 过去

### Swift 代码修改
- **不要用 awk/sed 修改 Swift 代码**——`{}` 嵌套、泛型、多行声明等语法太复杂
- **用 Python** 做大括号深度感知的精准删除最可靠
- 直接覆盖整个文件是最安全的做法，但可能导致功能缺失（如黑屏）

### GitHub Actions 网络
- github.com:443 在某些时段连接不稳定（21119ms timeout）
- 失败后等 1-2 分钟重试通常可以成功
- 也可以用 Git Data API（REST）绕过 git push

---

## 错误 #8 — 安装后黑屏

- **时间**: 2026-04-19
- **错误信息**: App 安装成功但打开后黑屏
- **根因**: 为了修复编译错误 #4/#5，用 `printf` 覆盖了整个 `AppDelegate.swift` 为 Scene-based 版本（含 `configurationForConnecting` / `didDiscardSceneSessions`），但 **Capacitor 8 不是 Scene-based 的**——它使用传统 `UIWindow` + `didFinishLaunchingWithOptions`。覆盖后的 AppDelegate 没有创建 window 和 rootViewController，也没有调用 `ApplicationDelegateProxy`，导致 Capacitor WebView 完全没有初始化
- **修复**: 不再覆盖整个文件，改用 Python 脚本精准删除有问题的 `continueUserActivity` 方法（大括号深度感知），保留 Capacitor 生成的其余所有代码
- **教训**: 
  - **不要用 printf 覆盖整个原生模板文件**——会丢失框架的关键初始化代码
  - 只做最小化的精准修改（删除/修改单个方法）
  - 如果不确定原始模板结构，先在 CI 中 dump 出完整内容再修改

---

## 错误 #9 — 图标白边

- **时间**: 2026-04-19
- **错误信息**: App 图标在桌面上显示白边
- **根因**: `sips -z 1024 1024` 是裁剪（zoom/crop）而非缩放（resample），可能导致图片内容偏移
- **修复**: 改用 `sips --resampleWidth 1024` 进行等比缩放，保持图片完整性
- **注意**: 如果源图片 `resources/icon.png` 本身就有白色背景/边距，CI 无法修复，需要重新设计图标
- **状态**: 部分解决（CI 端已优化，源图片质量需另行检查）
