---
title: "day08.Python-AI应用实战"
node_token: YlZ0weMWPiGt3nkuzntcZ5Aqnuf
obj_token: WPnEdGs7ko1unrxjrQ8cgSPenje
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/YlZ0weMWPiGt3nkuzntcZ5Aqnuf
edited_at: "1786326346"
exported_at: "2026-11-24T12:38:48.310Z"
cover: false
date: 2026-11-24
---
# 题目一 【必做】

把目前课程中，所学习的面向对象，网络基础知识，FastAPI基础知识的内容，课上所有的案例代码，全部搞定。

# 题目二【必做】

```python
"""
==========================================================
作业: 基于 FastAPI 开发"图书信息查询"API接口
==========================================================

【作业需求】
    使用 FastAPI 框架, 开发一个简单的"图书馆图书信息查询"API接口服务,
    用于查询图书馆中的图书列表信息。

【具体要求】
    1. 安装 FastAPI 与 uvicorn 依赖库
       - 命令: uv add fastapi uvicorn  (或 pip install fastapi uvicorn)

    2. 创建一个 FastAPI 实例对象, 并指定:
       - title       = "图书信息查询系统"
       - description = "一个简单的图书馆图书信息查询API"
       - version     = "1.0.0"

    3. 使用 Pydantic 模型定义图书数据结构 (类名: Book), 包含以下字段:
       - id      : int   图书ID
       - name    : str   图书名称
       - author  : str   作者
       - price   : float 价格
       - stock   : int   库存数量

    4. 开发以下 3 个 API 接口:
       (1) GET /
           - 功能: 根路径, 返回欢迎信息
           - 返回: {"message": "欢迎使用图书信息查询系统!"}

       (2) GET /books
           - 功能: 获取所有图书列表
           - summary: "获取所有图书列表"
           - response_model: list[Book]
           - 返回: 至少包含 3 本图书信息的列表, 图形信息定义在代码中即可
           - 提示: 在控制台打印 "获取图书列表..."

       (3) GET /books/count
           - 功能: 获取图书总数量
           - summary: "获取图书总数"
           - 返回: {"total": 图书数量}

    5. 通过代码方式启动 FastAPI 服务
       - host = "0.0.0.0"
       - port = 8000

    6. 启动后测试:
       - 在浏览器访问 http://localhost:8000/                   访问首页
       - 在浏览器访问 http://localhost:8000/books              查看图书列表
       - 在浏览器访问 http://localhost:8000/books/count        查看图书数量
       - 在浏览器访问 http://localhost:8000/docs               查看自动生成的接口文档
==========================================================
"""
```