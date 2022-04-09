#!/usr/bin/env node
const fs = require('fs')
const struct_length = require('./utils').struct_length
const struct_delete = require('./utils').struct_delete
const DEPENDENCIES = 'dependencies'
const PACKAGES = 'packages'
const LOCKFILEVERSION = 'lockfileVersion'
const REQUIRES = 'requires'

function apkl(temp_path,project_path,targetModule){
    if (targetModule.length > 2) {
        console.error('依赖包信息错误')
        return
    }
    const module_name = targetModule[0]
    let module_tag = targetModule[1]
    let temp_data
    let temp_pkl

//读取temp目录下的package-lock.json文件，找出目标库的配置信息
    let dependencies_data
    let packages_name
    let packages_data
    try {
        temp_data = fs.readFileSync(temp_path)
        temp_pkl = JSON.parse(temp_data.toString())

        //处理dependencies部分配置
        for (const key in temp_pkl[DEPENDENCIES]) {
            if (key === module_name) {
                dependencies_data = temp_pkl[DEPENDENCIES][key]
            }
        }
        if (dependencies_data === undefined) {
            console.error('temp路径下package-lock.json解析dependencies出错,',temp_path)
            return
        }
        module_tag = dependencies_data['version']
        //npm为v6版本及以下
        if (temp_pkl[LOCKFILEVERSION] === 1){
            let temp_child_module = {}
            for (const key in temp_pkl[DEPENDENCIES]) {
                if (key !== module_name) {
                    temp_child_module[key] = temp_pkl[DEPENDENCIES][key]
                }
            }
            if (struct_length(temp_child_module) > 0){
                dependencies_data[DEPENDENCIES] = temp_child_module
            }
        }

        if (temp_pkl[LOCKFILEVERSION] ===2 && temp_pkl[PACKAGES] !== undefined) {
            for (const key in temp_pkl[PACKAGES]) {
                const temp_key = key.split('/')
                if (temp_key[temp_key.length - 1] === module_name) {
                    packages_name = key
                    packages_data = temp_pkl[PACKAGES][key]
                }
            }
            if (packages_data === undefined) {
                console.error('temp路径下package-lock.json解析packages出错,',temp_path)
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

        //修改dependencies部分配置
        for (const key in temp_pkl[DEPENDENCIES]) {
            if (key === module_name) {
                temp_pkl[DEPENDENCIES][key] = dependencies_data
                flag = true
            }
            //更改requires中的依赖版本
            if (temp_pkl[DEPENDENCIES][key][REQUIRES] !== undefined) {
                if (temp_pkl[DEPENDENCIES][key][REQUIRES][module_name] !== undefined) {
                    temp_pkl[DEPENDENCIES][key][REQUIRES][module_name] = module_tag
                }
            }
            //去除可能存在的第二层dependencies中的依赖软件信息
            if (temp_pkl[DEPENDENCIES][key][DEPENDENCIES] !== undefined) {
                if (temp_pkl[DEPENDENCIES][key][DEPENDENCIES][module_name] !== undefined) {
                    temp_pkl[DEPENDENCIES][key][DEPENDENCIES] = struct_delete(temp_pkl[DEPENDENCIES][key][DEPENDENCIES],module_name)
                }
                if (struct_length(temp_pkl[DEPENDENCIES][key][DEPENDENCIES]) === 0){
                    temp_pkl[DEPENDENCIES][key] = struct_delete(temp_pkl[DEPENDENCIES][key],DEPENDENCIES)
                }
            }
        }
        if (flag) {
            flag = false
        } else {
            console.error('project路径下package-lock.json解析dependencies出错,',project_path)
            return
        }

        //修改packages部分配置
        if (temp_pkl[LOCKFILEVERSION] ===2 && temp_pkl[PACKAGES] !== undefined && packages_data !== undefined) {
            if (temp_pkl[PACKAGES][''][DEPENDENCIES][module_name] !== undefined){
                temp_pkl[PACKAGES][''][DEPENDENCIES][module_name] = module_tag
                flag = true
            }
            for (const key in temp_pkl[PACKAGES]) {
                if (key === packages_name) {
                    temp_pkl[PACKAGES][key] = packages_data
                    flag = true
                }
                if (temp_pkl[PACKAGES][key][DEPENDENCIES] !== undefined) {
                    if (temp_pkl[PACKAGES][key][DEPENDENCIES][module_name] !== undefined) {
                        temp_pkl[PACKAGES][key][DEPENDENCIES][module_name] = module_tag
                    }
                }
            }
            if (!flag) {
                console.error('temp路径下package-lock.json解析packages出错,',project_path)
                return
            }
        }
    } catch (err) {
        console.error('project路径package-lock.json读取失败\n',err)
        return
    }

    //修改后的package-lock配置信息写回目标项目文件
    try{
        fs.writeFileSync(project_path,JSON.stringify(temp_pkl,null,2)+'\n')
    }catch (err){
        console.error('project路径package-lock.json写入失败\n',err)
        return
    }

    if (temp_pkl[LOCKFILEVERSION] ===1){
        return 1
    }else if(temp_pkl[LOCKFILEVERSION] ===2){
        return 2
    }else {
        console.error('package-lock.json文件配置出错，lockfileVersion不为1或2')
    }
}

exports.apkl = apkl

