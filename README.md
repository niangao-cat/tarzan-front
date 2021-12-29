===
项目git地址: 

# 引入海马汇依赖： https://docs.hips.hand-china.com/zh/docs/pro-doc/portal/front/get_started/

> TODO: description
## 使用
#设置依赖下载时跳过puppeteer
# macos/linux：exportPUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
# windows：set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

#下载依赖
yarn --registry=http://mobile-app.hand-china.com/nexus/content/groups/hippius-ui-group/

# 生成dll文件夹
yarn build:dll

# 启动项目
yarn start

// TODO: DEMONSTRATE API
```
