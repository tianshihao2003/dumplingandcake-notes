---
tags:
  - 代码片段
场景:
语言: Python
验证状态: 未验证
最后验证日期: 2026-11-23
cover: false
date: 2026-11-23
title: "FileResponse()返回磁盘文件"
---
```py
from fastapi import FastAPI
from fastapi.responses import FileResponse

app = FastAPI()

@app.get("/")
def root():
    return FileResponse("static/index.html")   # 内容原样发出，不包一层 JSON
```

## 1. `FileResponse("static/index.html")`

它是个**响应类**，你 `return` 它，FastAPI 就会把磁盘上这个文件的内容原样发回去，并自动带上正确的响应头。

解决什么问题：`@app.get("/")` 的返回值默认会被当成 JSON 序列化。你要返回一个 HTML 页面，就需要告诉 FastAPI「别序列化，把这个文件发出去」。
