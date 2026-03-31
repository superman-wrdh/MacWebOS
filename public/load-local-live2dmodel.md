# 如何加载本地 Live2D 模型

由于浏览器的安全限制，Web 应用无法直接读取你电脑上的任意文件夹。为了在 MacWeb OS 中加载你自己的本地 Live2D 模型，你需要将模型文件放入项目的 `public` 文件夹中。

请按照以下步骤操作：

## 第一步：准备模型文件
确保你的 Live2D 模型文件夹包含以下核心文件（通常是 Cubism 2 或 Cubism 4 导出的格式）：
- `xxx.model.json` 或 `xxx.model3.json` (模型配置文件，最重要)
- `xxx.moc` 或 `xxx.moc3` (模型核心文件)
- `xxx.physics.json` (物理配置文件，可选)
- `xxx.pose.json` (姿势配置文件，可选)
- 包含贴图的文件夹 (通常叫 `xxx.1024` 或 `textures`)
- 包含动作的文件夹 (通常叫 `motions`)
- 包含表情的文件夹 (通常叫 `expressions`)

## 第二步：将模型放入项目
1. 在代码编辑器中，找到项目根目录下的 `public` 文件夹。
2. 在 `public` 文件夹内创建一个名为 `models` 的新文件夹（如果没有的话）。
3. 将你的整个 Live2D 模型文件夹拖入 `public/models/` 中。

例如，如果你的模型叫 `my_waifu`，那么文件结构应该是这样的：
```text
public/
  models/
    my_waifu/
      my_waifu.model3.json
      my_waifu.moc3
      textures/
      motions/
      ...
```

## 第三步：修改代码加载模型
1. 打开 `src/components/Live2D.tsx` 文件。
2. 找到 `Live2DProps` 接口下方的 `modelUrl` 默认值。
3. 将网络链接替换为你本地模型的相对路径。

**修改前：**
```typescript
export const Live2D: React.FC<Live2DProps> = ({ 
  modelUrl = 'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json' 
}) => {
```

**修改后：**
```typescript
export const Live2D: React.FC<Live2DProps> = ({ 
  modelUrl = '/models/my_waifu/my_waifu.model3.json' 
}) => {
```

## 第四步：刷新页面
保存文件后，开发服务器会自动重新编译。刷新浏览器页面，你就能看到你的本地模型瞬间加载出来了！

## 第五步：调整模型大小
如果你觉得模型太小或太大，现在可以直接在桌面上进行调整：
1. 将鼠标悬停在 Live2D 模型上。
2. 右上角会出现一个控制面板，包含 **+** (放大) 和 **-** (缩小) 按钮。
3. 点击按钮即可等比例缩放模型。
4. 缩放比例会自动保存，下次打开页面时会保持你设置的大小。

---

### 常见问题排查
- **模型加载失败/黑屏**：请检查 `modelUrl` 的路径是否拼写正确，确保它指向的是 `.json` 配置文件，而不是 `.moc3` 文件。
- **贴图丢失/变成白块**：打开你的 `.model3.json` 文件，检查里面 `textures` 数组的路径，确保它们与实际的贴图文件路径完全一致（注意大小写）。
- **动作不生效**：同样检查 `.model3.json` 中的 `motions` 路径配置是否正确。
