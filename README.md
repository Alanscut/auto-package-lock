## 背景

1. 项目 A 安装了依赖软件 B，B 项目内自己依赖了上游库 C。
2. 现 C 出现了 CVE 漏洞，社区发布了新版本修补了漏洞。
3. 但是 B 并未发布新版本引入 C 的无漏洞版本。
4. A 想要避免项目中出现 C 的漏洞，但无法简单通过`npm install C@4.0.7`命令安装指定版本，因为在 package.json 中 A 只与 B 有依赖关系。
5. 因此需要手动修改 A 项目中的 package-lock.json 文件

## 用法

1. 使用 npm 安装`npm install -g auto-package-lock`，或克隆项目（下载 release 包）到本地
2. 使用 npx 运行工具`npx auto-package-lock -p 目标项目路径 -m 指定的库名及版本`
3. 如果克隆项目本地，将 npx 后面的参数指向本地工具项目地址`npx ./auto-package-lock`

举例：

- `npx auto-package-lock -p ../demo2 -m deepmerge@4.2.2`
- `npx auto-package-lock -p /e/projects/js/demo2 -m throttle-debounce@3.0.1`

## 注意事项

1. npm 版本为 v6 及以下的项目，后续请务必使用`npm install --no-save`安装依赖。
2. npm 版本为 v7 及以上的项目，后续请使用`npm install`安装依赖
