#!/bin/bash

# $0 sh文件调用地址
# $1 目标项目地址（例如 E:/projects/js/demo)
# $2 指定npm包名与版本（例如 dayjs@1.10.8）

cd `dirname $0`
apkl_path=`pwd`
#echo $apkl_path
 npm install

cd temp
temp_path=`pwd`
#echo $temp_path
 npm install $2
 npm install --package-lock-only --ignore-scripts

cd $apkl_path
cd $1
project_path=`pwd`
#echo $project_path
 npm install -no-save
 npm install --package-lock-only --ignore-scripts

cd $apkl_path
node index.js --temp_path $temp_path --project_path $project_path --module $2

