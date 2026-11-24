---
tags:
  - 代码片段
场景:
语言: Python
验证状态: 未验证
最后验证日期: 2026-11-23
cover: false
date: 2026-11-23
title: "app.mount()静态文件挂载"
---
**挂载（mount）一个子应用**：凡是 `/static/...` 开头的请求，不进你的路由表，直接交给 `StaticFiles` 去磁盘上找对应文件。

```py
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```
三个参数：

|参数|含义|
|---|---|
|`/static`|URL 前缀，前端请求用这个|
|`StaticFiles(directory="static")`|本地目录，实际读文件的地方|
|`name="static"`|给这个挂载点起名，用于反向生成 URL|