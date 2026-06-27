# 个人简介网站 - 技术架构文档

## 1. 项目概述

- **项目名称**: Personal Portfolio Website
- **项目类型**: 单页静态网站（SPA）
- **核心功能**: 展示个人简介、技能、项目和联系方式
- **目标用户**: 潜在雇主、客户、同行开发者

## 2. 技术栈

| 类别 | 技术选择 |
|------|----------|
| 标记 | HTML5 语义化标签 |
| 样式 | CSS3（CSS Variables, Flexbox, Grid, @keyframes）|
| 脚本 | Vanilla JavaScript ES6+ |
| 图标 | Lucide Icons (CDN) |
| 字体 | Google Fonts (Space Grotesk, Noto Sans SC, JetBrains Mono) |

## 3. 文件结构

```
/workspace/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 交互脚本
└── .trae/
    └── documents/
        ├── prd.md
        └── tech-doc.md
```

## 4. 模块设计

### 4.1 Hero Section
- 全屏布局 (100vh)
- 渐变文字标题
- 打字机效果副标题
- 动态背景光效

### 4.2 About Section
- 头像区域（带装饰边框）
- 自我介绍文字
- 淡入动画

### 4.3 Skills Section
- 技能网格布局
- 每项技能: 图标 + 名称 + 进度条
- 进度条使用 CSS 渐变动画

### 4.4 Projects Section
- 卡片网格
- 悬停展开效果
- 技术栈标签

### 4.5 Contact Section
- 社交链接按钮组
- 邮箱链接
- 悬停动效

### 4.6 Navigation
- 固定顶部导航栏
- 滚动时背景模糊
- 平滑滚动锚点

## 5. 关键实现

### 5.1 滚动动画
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
```

### 5.2 打字机效果
```javascript
function typeWriter(element, text, speed = 100) {
  // 逐字添加，配合 CSS 闪烁光标
}
```

### 5.3 主题变量
```css
:root {
  --bg-primary: #0a0a0f;
  --accent-primary: #6366f1;
  /* ... */
}
```

## 6. 性能优化

- CSS/JS 内联或单文件，减少请求
- 使用 CSS transform 代替 top/left
- 使用 will-change 优化动画元素
- 图片使用懒加载（如有）

## 7. 浏览器兼容

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
