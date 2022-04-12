## 背景
1. 项目A安装了依赖软件B，B项目内自己依赖了上游库C。
2. 现C出现了CVE漏洞，社区发布了新版本修补了漏洞。
3. 但是B并未发布新版本引入C的无漏洞版本。
4. A想要避免项目中出现C的漏洞，但无法简单通过`npm install C@4.0.7`命令安装指定版本，因为在package.json中A只与B有依赖关系。
5. 因此需要手动修改A项目中的package-lock.json文件

## 用法

1. 使用npm安装`npm install -g auto-package-lock`，或克隆项目（下载release包）到本地
2. 使用npx运行工具`npx auto-package-lock -p 目标项目路径 -m 指定的库名及版本`
3. 如果克隆项目本地，将npx后面的参数指向本地工具项目地址`npx ./auto-package-lock`

举例：

- `npx auto-package-lock -p ../demo2 -m deepmerge@4.2.2`
- `npx auto-package-lock -p /e/projects/js/demo2 -m throttle-debounce@3.0.1`

## 注意事项

1. npm版本为v6及以下的项目，后续请务必使用`npm install --no-save`安装依赖。
2. npm版本为v7及以上的项目，后续请使用`npm install`安装依赖
