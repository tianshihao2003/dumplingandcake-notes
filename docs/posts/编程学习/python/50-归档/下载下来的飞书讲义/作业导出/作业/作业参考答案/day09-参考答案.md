---
title: "day09-参考答案"
node_token: OrQwwatoOiAcl2knTQccFi7xnkh
obj_token: VuRud5d19osBh8xgrNRctDHcnKb
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/OrQwwatoOiAcl2knTQccFi7xnkh
edited_at: "1795413568"
exported_at: "2026-11-24T12:38:51.851Z"
cover: false
date: 2026-11-24
---
```python
import os
import json
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel

# 实例化FastAPI
app = FastAPI(title="书籍管理系统", description="书籍管理系统的练习案例", version="V0.1")

# ==================== Pydantic数据模型 ====================
class ApiResponse(BaseModel):
    code: int = 200             # 状态码
    message: str = "操作成功"    # 提示信息
    data: Any = None            # 数据

# {"id": "BK001", "title": "...", "author": "...", "publisher": "...", "total_pages": 360, "price": 39.50}
class BookModel(BaseModel):
    id: str             # 书籍编号
    title: str          # 书籍标题
    author: str         # 书籍作者
    publisher: str      # 书籍出版社
    total_pages: int    # 书籍总页数
    price: float        # 书籍价格

# ==================== API接口-操作函数(绑定路径与函数) ====================
# 2. 查询全部书籍 --> 请求参数、路径、请求方式、响应数据 ， 参照接口文档 【逻辑： 加载 data/books.json 中的数据, 组装并返回】
@app.get("/api/books")
def load_books() -> ApiResponse:
    print("查询全部书籍")

    # 判断文件是否存在
    if not os.path.exists("data/books.json"):
        return ApiResponse(code=200, message="数据文件不存在")

    # 读取文件
    with open("data/books.json", "r", encoding="utf-8") as f:
        books = json.load(f)

    return ApiResponse(code=200, message="请求成功", data=books)

# 3. 新增书籍 --> 请求参数、路径、请求方式、响应数据 ， 参照接口文档  【逻辑： 加载 data/books.json 中的现有数据, 将新的数据放在列表尾部, 然后再存入文件中】
# {"id": "BK001", "title": "...", "author": "...", "publisher": "...", "total_pages": 360, "price": 39.50}
@app.post("/api/books")
def add_book(book: BookModel) -> ApiResponse:
    print("新增书籍")
    # 加载 data/books.json 中的现有数据
    with open("data/books.json", "r", encoding="utf-8") as f:
        books: list = json.load(f)

    # 将新的数据放在列表尾部
    books.append(book.__dict__)

    # 然后再存入文件中
    with open("data/books.json", "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii= False, indent=4)

    return ApiResponse(code=200, message="操作成功")

# 4. 删除书籍 --> 请求参数、路径、请求方式、响应数据 ， 参照接口文档 【逻辑： 加载 data/books.json 中的现有数据, 找到要删除的这本书籍, 从列表中删除掉, 然后再存入文件中】
# /api/books/N007 , /api/books/N008
@app.delete("/api/books/{book_id}")
def delete_book(book_id: str) -> ApiResponse:
    print("删除书籍")
    # 加载 data/books.json 中的现有数据
    with open("data/books.json", "r", encoding="utf-8") as f:
        books: list = json.load(f)

    # 找到要删除的这本书籍, 从列表中删除掉
    for book in books:
        if book["id"] == book_id:
            books.remove(book)

    # 然后再存入文件中
    with open("data/books.json", "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=4)

    return ApiResponse(code=200, message="操作成功")

# 5. 启动FastAPI服务
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```