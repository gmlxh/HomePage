## 介绍

基于 [原项目](https://github.com/JLinMr/Home-Vue) 修改，感谢原作者的贡献！


### 修改

图标默认采用Font Awesome，如需修改图标，请前往 [Font Awesome](https://fa6.dashgame.com/) 复制图标

- 修改联系方式 **`src/config/links.json`** 文件中的内容值即可
- 修改网站列表 **`src/config/site.json`** 文件中的内容值即可
- 修改网站名称 **`.env`** 文件中的内容即可
### 部署

* **安装** [node.js](https://nodejs.org/zh-cn/) **环境**

  > node > 16.16.0
  > npm > 8.15.0

* 然后以 **管理员权限** 运行 `cmd` 终端，并 `cd` 到 项目根目录
* 在 `终端` 中输入：

```bash
# 安装依赖
npm install
```
```bash
# 预览
npm run dev
```
```bash
# 构建
npm run build
```
建议在修改后直接把源文件推给服务器，在服务器做好调试后预览，构建

构建完成后，静态资源会在 dist 目录 中生成，可将 dist 文件夹下的文件上传至服务器，也可使用 Vercel 等托管平台一键导入并自动部署
