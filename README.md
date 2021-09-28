# vue-shop

## 第一次更新

### 介绍

vue-shop 是基于 vue 的 pc 端项目，所使用到的技术有

1. vue vue-Router vueX
2. axios
3. vant-ui
4. Echarts

### 基本功能

1. 登录
2. 管理用户
3. 管理角色，分配权限
4. 管理商品、订单
5. 图形化展示销量



### 下载依赖

```
npm install
```

### 启动

```
npm run serve
```

### 浏览

在浏览器中键入 http://localhost:8080 即可预览项目



### 其他应该注意的事情

1. 本项目是观看自 b 站 黑马 vue 实战 黑马电商管理项目 仿写，有兴趣可移至 b 站浏览

2. 商品分类界面使用的 TreeTable 使用起来较为卡顿，遂使用 VXETable 代替
3. 增加了点击首页，侧边栏收起
4. 增加右上角头像，具有回到首页以及退出登录等功能
5. 商品修改那块代码是移植 b 站某位老哥的代码，一时忘记是谁了，如有侵权请联系
6. 线上接口使用的是 b 站 ' 神奈川__ ' 老哥的接口
7. 如有问题欲 探讨请添加 QQ 1834563532



## 第二次更新

### 项目优化

1. 将 main.js 细分成 main-dev.js 和 main-prod.js ，前者用于开发环境，后者用于生产环境
2. 在生产环境中使用 cdn 引入外部资源来代替使用 import 引入的资源，减小打包的体积
   1. cdn 资源在 index.html 中引入
   2. 需要通过 vue.config.js 来指定开发和生产入口

3. 在 Roles 组件中，使用的 element.ui 的树形表，在打包上线后会出现数据无法显示的 bug，在给树形图添加一个 id 后，开发环境下也会出现 bug 
4. 在使用 cdn 替代 vueRouter 时，开发环境下会报错
5. 使用 VXETable 替代 TreeTable ，在进行打包时没有对 VXETable 进行 cdn 引用，故打包体积会较大
