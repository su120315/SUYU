# 个人简介网站 PRD

## 1. Concept & Vision

一个极具视觉冲击力的个人简介网站，融合未来主义美学与极简主义细节。网站如同一个精心策划的艺术展览，访客通过流畅的滚动体验探索主人的数字身份。以"流动的光影"为核心视觉隐喻，塑造一个既专业又富有创造力的形象。

## 2. Design Language

### 美学方向
- **风格**: 未来极简主义 + 动态光影艺术
- **参考**: 高端科技产品发布会 + 艺术画廊

### 色彩系统
```css
--bg-primary: #0a0a0f;        /* 深邃夜空 */
--bg-secondary: #12121a;       /* 次级背景 */
--accent-primary: #6366f1;     /* 靛蓝紫 */
--accent-secondary: #22d3ee;  /* 青色 */
--accent-tertiary: #f472b6;    /* 粉红 */
--text-primary: #f8fafc;      /* 主文字 */
--text-secondary: #94a3b8;    /* 次级文字 */
--gradient: linear-gradient(135deg, #6366f1, #22d3ee, #f472b6);
```

### 字体
- **标题**: "Space Grotesk" - 未来感几何无衬线
- **正文**: "Noto Sans SC" - 清晰的中文阅读体验
- **装饰**: "JetBrains Mono" - 代码/技术元素

### 动效哲学
- **进入动画**: 元素从下方淡入上移，stagger 100ms
- **滚动触发**: 使用 Intersection Observer，元素进入视口时触发
- **光效流动**: 背景渐变微妙移动，模拟光影流动
- **悬停反馈**: 微妙的 scale(1.02) + 发光边框

## 3. Layout & Structure

### 页面结构
1. **Hero Section** - 全屏，名字 + 职业 + 动态背景光效
2. **About Section** - 简洁自我介绍，配合悬浮照片框
3. **Skills Section** - 技能展示，渐变进度条 + 图标
4. **Projects Section** - 项目卡片，悬停展开详情
5. **Contact Section** - 联系方式 + 社交链接

### 响应式策略
- Desktop (>1024px): 多列布局，充分展示
- Tablet (768-1024px): 双列过渡
- Mobile (<768px): 单列堆叠，保留核心体验

## 4. Features & Interactions

### 核心功能
- **滚动进度指示**: 右侧细线显示浏览进度
- **平滑滚动导航**: 点击导航锚点平滑跳转
- **主题切换**: 明/暗模式切换（默认深色）
- **打字机效果**: Hero 区域职业标题逐字显示

### 交互细节
- 卡片悬停: 边框发光 + 微微上浮 (translateY -4px)
- 按钮悬停: 背景渐变流动
- 社交图标: 悬停时旋转 + 颜色变化
- 滚动触发: 各区块元素依次淡入

## 5. Component Inventory

### Hero Section
- 大标题: 渐变文字 + 微妙动画
- 副标题: 打字机效果显示职业
- 背景: CSS 渐变动画 + 模糊光斑

### Skill Card
- 图标 + 技能名
- 渐变进度条
- 悬停: 发光边框

### Project Card
- 项目缩略图区域
- 标题 + 描述
- 技术栈标签
- 悬停: 展开更多信息

### Contact Button
- 渐变背景
- 图标 + 文字
- 悬停: 流光效果

## 6. Technical Approach

- **框架**: 纯 HTML + CSS + Vanilla JS（无依赖）
- **字体加载**: Google Fonts CDN
- **动画**: CSS @keyframes + Intersection Observer API
- **图标**: Lucide Icons CDN
