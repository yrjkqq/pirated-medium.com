# pirated-medium.com
A pirate version of medium.com

## roadmap

1. 学习 gin 的使用
   1. 如何解析 json 数据？[Model binding and validation](https://gin-gonic.com/docs/examples/binding-and-validation/)
2. 加入 mysql-driver 
3. 后端基础功能实现，准备好开发业务 [**2020.03.22**]
4. 前端使用 next.js apollo-react client 实现 ssr
   1. next.js ts styledComponents [**2020.03.22**]
   2. 加入 apollo [api-routes-apollo-server-and-client-auth](https://github.com/zeit/next.js/tree/canary/examples/api-routes-apollo-server-and-client-auth)
5. 前端调通后端接口，准备好开发业务
6. 开始按照开发顺序进行开发
   1. 实现 medium.com 未登录首页的 tags 列表
   2. ...
7. ...




## how to develop?

1. 按照使用 medium 的顺序进行开发
   1. 进入到首页
      1. 推荐 tags 列表
      2. 固定文字内容
      3. 用户评语列表
      4. 点击 "Get started" 按钮弹出登录框
   2. 登录框操作
      1. 选择注册
         1. 可以选择使用微信或者 qq 进行登录
         2. 或者使用邮箱进行注册
      2. 直接登录
         1. 选择使用微信、qq 还是邮箱进行登录
   3. 实现登录
   4. 登录后进入到文章首页
   5. ....
2. 进入到一个页面需要什么功能，先写接口，再画界面


## wiki

1. server 编译成 windows app
   ```bash
   sudo GOOS=windows GOARCH=386 go build -o server.exe
   ```
2. windows 下批量转换 CRLF to LF, 安装 dos2unix.exe, [递归转换](https://waterlan.home.xs4all.nl/dos2unix/zh_CN/man1/dos2unix.htm)
   ```shell
   for /R %G in (*.tsx) do dos2unix "%G"
   ```
   

## todo

1. ...
2. ...


## inspired by

1. https://github.com/zhxuc/wipi
2. https://github.com/wenjianzhang/go-admin


## Acknowledge

1. [with-apollo-and-redux](https://github.com/zeit/next.js/tree/canary/examples/with-apollo-and-redux)
2. [typesafe-actions](https://github.com/piotrwitek/typesafe-actions#action-helpers)
3. [react-redux-typescript-guide](https://github.com/piotrwitek/react-redux-typescript-guide#reducers)