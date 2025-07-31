# MyMysteryBox - 盲盒商城前端项目

## 📖 项目简介

MyMysteryBox 是一个基于 React 的盲盒商城前端项目，为用户提供盲盒购买、抽取、展示等完整的电商体验。项目采用现代化的前端技术栈，具有响应式设计、实时在线人数显示、用户管理、盲盒管理等功能。

## ✨ 主要功能

### 🎁 盲盒功能
- **盲盒浏览**: 展示所有可购买的盲盒商品
- **盲盒详情**: 查看盲盒详细信息、款式概率等
- **盲盒抽取**: 在线抽取盲盒，获得随机款式
- **抽取记录**: 查看用户历史抽取记录
- **实时在线人数**: 显示当前在线抽取人数

### 👤 用户系统
- **用户注册**: 支持手机号注册，包含密码强度验证
- **用户登录**: 手机号密码登录
- **个人主页**: 用户信息管理
- **角色管理**: 支持普通用户和管理员角色

### 🎨 展示功能
- **玩家秀**: 用户展示抽取到的盲盒款式
- **秀场创建**: 用户可以创建自己的展示页面
- **秀场浏览**: 浏览其他用户的展示内容
- **排行榜**: 展示热门玩家秀

### 🔧 管理功能
- **盲盒管理**: 管理员可以创建、编辑、删除盲盒
- **款式管理**: 为盲盒添加不同款式和概率
- **广告管理**: 首页广告展示功能

### 💳 支付系统
- **支付页面**: 简洁的支付确认界面
- **支付流程**: 完整的购买和抽取流程

## 🛠 技术栈

### 前端框架
- **React 18.3.1**: 现代化的前端框架
- **React Router DOM 7.6.3**: 路由管理
- **Vite 7.0.4**: 快速构建工具

### 样式框架
- **Tailwind CSS 3.4.17**: 实用优先的CSS框架
- **PostCSS 8.5.6**: CSS后处理器
- **Autoprefixer 10.4.21**: 自动添加CSS前缀

### 开发工具
- **ESLint 9.30.1**: 代码质量检查
- **Jest 29.7.0**: 单元测试框架
- **@testing-library**: React组件测试

### 其他依赖
- **Axios 1.10.0**: HTTP客户端
- **@tailwindcss/vite**: Tailwind CSS Vite插件

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境运行
```bash
# 启动开发服务器
npm run dev
# 或
yarn dev

# 访问 http://localhost:5173
```

### 生产环境构建
```bash
# 构建生产版本
npm run build
# 或
yarn build

# 预览生产版本
npm run preview
# 或
yarn preview
```

## 🧪 测试

### 运行所有测试
```bash
npm test
# 或
yarn test
```

### 运行特定测试
```bash
# 搜索功能测试
npm run test:search

# 盲盒功能测试
npm run test:blindbox

# 抽取功能测试
npm run test:draw
```

### 测试覆盖率
```bash
npm run test:coverage
# 或
yarn test:coverage
```

### 持续集成测试
```bash
npm run test:ci
# 或
yarn test:ci
```

## 📁 项目结构

```
MyMysteryBoxFrontend/
├── public/                    # 静态资源
│   └── vite.svg
├── src/
│   ├── components/           # 组件目录
│   │   ├── __tests__/       # 测试文件
│   │   │   ├── BlindBoxCRUD.test.jsx
│   │   │   ├── BlindBoxDraw.test.jsx
│   │   │   └── Search.test.jsx
│   │   ├── common/          # 通用组件
│   │   │   ├── Error.jsx
│   │   │   ├── ImagePreview.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── StarRating.jsx
│   │   ├── BlindBoxInfoPage.jsx
│   │   ├── BlindBoxPage.jsx
│   │   ├── DrawnStyleDetailPage.jsx
│   │   ├── Login.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── PlayerShowCreateForm.jsx
│   │   ├── PlayerShowCreatePage.jsx
│   │   ├── PlayerShowDetailPage.jsx
│   │   ├── PlayerShowsPage.jsx
│   │   ├── Register.jsx
│   │   ├── UserDrawnBlindBoxesPage.jsx
│   │   └── UserProfilePage.jsx
│   ├── hooks/               # 自定义Hooks
│   ├── assets/              # 资源文件
│   │   └── react.svg
│   ├── App.css
│   ├── App.jsx              # 主应用组件
│   ├── index.css
│   ├── main.jsx             # 应用入口
│   └── setupTests.js        # 测试配置
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── babel.config.js
├── eslint.config.js
├── jest.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🔌 API 接口

### 用户相关
- `POST /user/login` - 用户登录
- `POST /user/register` - 用户注册

### 盲盒相关
- `GET /blind-box` - 获取盲盒列表
- `GET /blind-box?id={id}` - 获取盲盒详情
- `POST /blind-box/draw?id={id}&user_id={userId}` - 抽取盲盒

### 在线人数
- `GET /online-count` - 获取在线人数

### 玩家秀相关
- `GET /player-shows/ranking` - 获取排行榜

### 文件上传
- `POST /player-show-upload` - 文件上传接口

## 🎯 核心组件说明

### BlindBoxPage.jsx
盲盒主页面，包含：
- 盲盒列表展示
- 搜索和过滤功能
- 管理员模式（创建、编辑、删除盲盒）
- 广告展示
- 在线人数显示

### PaymentPage.jsx
支付页面，包含：
- 支付确认界面
- 在线人数实时更新
- 支付成功后的盲盒抽取

### Login.jsx / Register.jsx
用户认证组件，包含：
- 手机号验证
- 密码强度检查
- 表单验证

### PlayerShowsPage.jsx
玩家秀页面，包含：
- 用户展示列表
- 排行榜功能
- 展示内容浏览

## 🎨 设计特色

### 响应式设计
- 支持桌面端和移动端
- 使用 Tailwind CSS 实现现代化UI
- 流畅的动画效果

### 用户体验
- 实时在线人数显示
- 广告弹窗功能
- 搜索和过滤功能
- 错误处理和加载状态

### 管理功能
- 管理员可以管理盲盒和款式
- 支持图片上传
- 概率设置功能

## 🔧 开发指南

### 代码规范
项目使用 ESLint 进行代码质量检查：
```bash
npm run lint
```

### 添加新功能
1. 在 `src/components/` 创建新组件
2. 在 `src/components/__tests__/` 添加测试
3. 在 `src/App.jsx` 添加路由
4. 更新相关文档

### 样式开发
项目使用 Tailwind CSS，可以通过以下方式自定义：
- 修改 `tailwind.config.js`
- 在组件中使用 Tailwind 类名
- 使用 `@apply` 指令组合样式

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

### 部署到静态服务器
构建完成后，将 `dist/` 目录部署到任何静态文件服务器。

### 环境变量
项目支持环境变量配置，可以创建 `.env` 文件：
```
VITE_API_BASE_URL=http://localhost:7001
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v0.0.0
- 初始版本发布
- 基础盲盒功能
- 用户认证系统
- 玩家秀功能
- 管理后台

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 项目讨论区

---

**MyMysteryBox** - 让盲盒购物更加有趣和便捷！ 🎁 