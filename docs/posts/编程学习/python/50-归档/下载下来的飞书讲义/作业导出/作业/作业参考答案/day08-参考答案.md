---
title: "day08-参考答案"
node_token: RGYSwPIsJi4wzlkaH0QcwNr4nUg
obj_token: GtYadeErbodlv8xNQjacPnnQnYf
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/RGYSwPIsJi4wzlkaH0QcwNr4nUg
edited_at: "1787749824"
exported_at: "2026-11-24T12:38:51.371Z"
cover: false
date: 2026-11-24
---
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
           - 返回: 至少包含 3 本图书信息的列表, 图书信息定义在代码中即可
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

from fastapi import FastAPI
from pydantic import BaseModel

# 1. 创建 FastAPI 实例对象
app = FastAPI(
    title="图书信息查询系统",
    description="一个简单的图书馆图书信息查询API",
    version="1.0.0"
)

# 2. 使用 Pydantic 模型定义图书数据结构
class Book(BaseModel):
    id: int          # 图书ID
    name: str        # 图书名称
    author: str      # 作者
    price: float     # 价格
    stock: int       # 库存数量

books = [
    Book(id=1, name="《三国演义》", author="罗贯中", price=59.80, stock=120),
    Book(id=2, name="《红楼梦》", author="曹雪芹", price=68.00, stock=85),
    Book(id=3, name="《Python编程: 从入门到实践》", author="Eric Matthes", price=89.90, stock=200),
    Book(id=4, name="《活着》", author="余华", price=28.00, stock=150),
    Book(id=5, name="《百年孤独》", author="加西亚·马尔克斯", price=55.50, stock=60),
]

# 3. 接口 (1): 根路径 - 返回欢迎信息
@app.get("/", summary="首页")
def welcome():
    print("欢迎使用图书信息查询系统!")
    return {"message": "欢迎使用图书信息查询系统!"}

# 4. 接口 (2): 获取所有图书列表
@app.get("/books", summary="获取所有图书列表", response_model=list[Book])
def get_books():
    print("获取图书列表...")
    return books

# 5. 接口 (3): 获取图书总数量
@app.get("/books/count", summary="获取图书总数")
def get_books_count():
    print("获取图书总数...")
    return {"total": len(books)}

# 6. 启动 FastAPI 服务
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```