#!usr/bin/env node
const shell = require('shelljs')
const utils = require('./utils')
const apkl = require('./auto-package-lock').apkl
const path = require('path')

const args = require('minimist')(process.argv.slice(2), {
    string: ["p", "m"]
});

let exit = false
if (utils.notExist(args.p)) {
    console.error('缺少project路径信息')
    exit = true
}
if (utils.notExist(args.m)) {
    console.error('缺少module信息')
    exit = true
}
if (exit) {
    return
}

shell.cd(args.p)
const project = shell.pwd().stdout
const targetModule = args.m.split('@')
const temp = path.join(__dirname,'temp')

const project_path = path.join(project,'package-lock.json')
const temp_path = path.join(temp,'package-lock.json')

//temp目录npm安装module以取得配置信息
shell.cd(temp)
shell.exec(`npm install ${args.m}`)
shell.exec(`npm install --package-lock-only --ignore-scripts`)

//目标project生成package-lock.json
shell.cd(project)
shell.exec(`npm install -no-save`)
shell.exec(`npm install --package-lock-only --ignore-scripts`)

//修改目标project中package-lock.json配置
const result = apkl(temp_path,project_path,targetModule)
if (result === undefined){
    return
}

//temp目录npm卸载module
shell.cd(temp)
shell.exec(`npm uninstall ${targetModule[0]}`)

if (result === 1){
    //目标project更新npm install
    shell.cd(project)
    shell.exec(`npm install -no-save`)
    console.log('\npackage-lock配置成功')
    console.log('使用npm v6及以下版本，后续请务必使用npm install -no-save')
}else {
    //目标project更新npm install
    shell.cd(project)
    shell.exec(`npm install`)
    console.log('\npackage-lock配置成功')
    console.log('使用npm v7及以上版本，后续可使用npm install -no-save 或直接使用 npm install')
}
