## 背景

1. 项目 A 安装了依赖软件 B，B 项目内自己依赖了上游库 C。
2. 现 C 出现了 CVE 漏洞，社区发布了新版本修补了漏洞。
3. 但是 B 并未发布新版本引入 C 的无漏洞版本。
4. A 想要避免项目中出现 C 的漏洞，但无法简单通过`npm install C@4.0.7`命令安装指定版本，因为在 package.json 中 A 只与 B 有依赖关系。
5. 因此需要手动修改 A 项目中的 package-lock.json 文件

## 用法

### npm 安装

1. 使用 npm 安装`npm install -g auto-package-lock`
2. 使用 node 运行工具`npx auto-package-lock -p 目标项目路径 -m 指定的库名及版本`

举例：

- `node auto-package-lock -p ../demo2 -m deepmerge@4.2.2`
- `node auto-package-lock -p /e/projects/js/demo2 -m throttle-debounce@3.0.1`

### 本地调用

1. 克隆项目（下载 release 包）到本地
2. 命令行`cd`进入工具路径，使用 node 运行工具`npx ./index.js -p 目标项目路径 -m 指定的库名及版本`

举例：

- `node ./index.js -p ../demo2 -m deepmerge@4.2.2`
- `node ./index.js -p /e/projects/js/demo2 -m throttle-debounce@3.0.1`

## 参数

两个必需参数

- -p 目标项目的路径（project_path）
- -m 想要锁定版本的的库名称及地址（module）

## 注意事项

1. npm 版本为 v6 及以下的项目，后续请务必使用`npm install --no-save`安装依赖。
2. npm 版本为 v7 及以上的项目，后续可直接使用`npm install`安装依赖
