#!/usr/bin/env node
const fs = require('fs')

function apkl(temp_path,project_path,targetModule){
    if (targetModule.length > 2) {
        console.error('依赖包信息错误')
        return
    }
    const module_name = targetModule[0]
    const module_tag = targetModule[1]
    let temp_data
    let temp_pkl

//读取temp目录下的package-lock.json文件，找出目标库的配置信息
    let dependencies_data
    let packages_name
    let packages_data
    try {
        temp_data = fs.readFileSync(temp_path)
        temp_pkl = JSON.parse(temp_data.toString())

        for (const key in temp_pkl['dependencies']) {
            if (key === module_name) {
                dependencies_data = temp_pkl['dependencies'][key]
            }
        }
        if (dependencies_data === undefined) {
            console.error('temp路径下package-lock.json解析dependencies出错')
            return
        }

        if (temp_pkl['lockfileVersion'] ===2 && temp_pkl['packages'] !== undefined) {
            for (const key in temp_pkl['packages']) {
                const temp_key = key.split('/')
                if (temp_key[temp_key.length - 1] === module_name) {
                    packages_name = key
                    packages_data = temp_pkl['packages'][key]
                }
            }
            if (packages_data === undefined) {
                console.error('temp路径下package-lock.json解析packages出错')
            }
        }
    } catch (err) {
        console.error('temp路径package-lock.json读取失败', err)
        return
    }

//读取目标项目的package-lock.json文件，将目标库的配置信息修改完毕
    try {
        temp_data = fs.readFileSync(project_path)
        temp_pkl = JSON.parse(temp_data.toString())
        let flag = false

        for (const key in temp_pkl['dependencies']) {
            if (key === module_name) {
                temp_pkl['dependencies'][key] = dependencies_data
                flag = true
            }
            if (temp_pkl['dependencies'][key]['requires'] !== undefined) {
                if (temp_pkl['dependencies'][key]['requires'][module_name] !== undefined) {
                    temp_pkl['dependencies'][key]['requires'][module_name] = module_tag
                }
            }
        }
        if (flag) {
            flag = false
        } else {
            console.error('project路径下package-lock.json解析dependencies出错')
            return
        }

        if (temp_pkl['lockfileVersion'] ===2 && temp_pkl['packages'] !== undefined && packages_data !== undefined) {
            if (temp_pkl['packages']['']['dependencies'][module_name] !== undefined){
                temp_pkl['packages']['']['dependencies'][module_name] = module_tag
                flag = true
            }
            for (const key in temp_pkl['packages']) {
                if (key === packages_name) {
                    temp_pkl['packages'][key] = packages_data
                    flag = true
                }
                if (temp_pkl['packages'][key]['dependencies'] !== undefined) {
                    if (temp_pkl['packages'][key]['dependencies'][module_name] !== undefined) {
                        temp_pkl['packages'][key]['dependencies'][module_name] = module_tag
                    }
                }
            }
            if (!flag) {
                console.error('temp路径下package-lock.json解析packages出错')
                return
            }
        }
    } catch (err) {
        console.error('project路径package-lock.json读取失败\n',err)
        return
    }

    try{
        fs.writeFileSync(project_path,JSON.stringify(temp_pkl,null,2)+'\n')
    }catch (err){
        console.error('project路径package-lock.json写入失败\n',err)
        return
    }

    if (temp_pkl['lockfileVersion'] ===1){
        return 1
    }else if(temp_pkl['lockfileVersion'] ===2){
        return 2
    }else {
        console.error('package-lock.json文件配置出错，lockfileVersion不为1或2')
    }
}

exports.apkl = apkl

