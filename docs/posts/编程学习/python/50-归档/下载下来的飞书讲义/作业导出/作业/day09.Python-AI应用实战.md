---
title: "day09.Python-AI应用实战"
node_token: PI4Zwgf5Ai77WokfXFOcRvaYnRd
obj_token: G49ZdHZWpoq8CvxHlOHcIyVmnzf
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/PI4Zwgf5Ai77WokfXFOcRvaYnRd
edited_at: "1795342034"
exported_at: "2026-11-23T01:26:07.648Z"
cover: false
date: 2026-11-23
---
# 作业一：优先完成课程中案例的所有代码【必做】

# 作业二: 预习day10   MYSQL的安装

# 作业三：基于FastAPI完成书籍管理系统开发【选做-自习时间可以尝试做一下】

## 需求

> 不支持的块类型 33（v1 跳过）

- **需求说明：**开发一个书籍管理系统，使用 Python + FastAPI 搭建后端服务，配合 HTML / CSS / JavaScript 实现前端页面。书籍数据存储在本地 JSON 文件中，不依赖数据库。

- **最终效果**：浏览器访问 `http://localhost:8000`，可以看到书籍列表，可以新增书籍、删除书籍。

- **目录说明：**

```python
book/
├── static/              # 前端静态文件
│   ├── index.html       # 页面结构
│   ├── style.css        # 样式
│   └── app.js           # 交互逻辑（调用 API）
├── data/                # 数据存储目录
│   └── books.json       # 书籍数据文件
├── main.py              # 后端核心代码（所有接口写在这一个文件里）
└── 接口文档.md           # API 接口文档
```

- **书籍信息：**

| 字段 | 说明 | 类型 | 必填 | 备注 |
| --- | --- | --- | --- | --- |
| id | 编号 | 字符串(str) | 是 |  |
| title | 书名 | 字符串(str) | 是 | — |
| author | 作者 | 字符串(str) | 是 | — |
| publisher | 出版社 | 字符串(str) | 是 | — |
| total_pages | 总页数 | 整数(int) | 是 | 正整数 |
| price | 价格 | 浮点数(float) | 是 |  |

## **需要实现的功能**

> [!tip] 🍀
> 如下功能，详细的接口描述，可以参照接口文档 【提供的文件夹中有】。

### **功能一：访问前端页面**

| 项目 | 内容 |
| --- | --- |
| 接口 | GET / |
| 说明 | 返回 static/index.html 文件 |
| 无请求参数 | — |

### **功能二：查询全部书籍列表**

| 项目 | 内容 |
| --- | --- |
| 接口 | GET /api/books |
| 说明 | 读取 JSON 文件，返回全部书籍，不需要查询条件 |
| 无请求参数 | — |
| 响应格式 | {"code": 200, "message": "查询成功", "data": [...]} |

响应中的 `data` 是一个数组，每个元素是一条书籍记录。

### **功能三：新增书籍**

| 项目 | 内容 |
| --- | --- |
| 接口 | POST /api/books |
| 说明 | 接收 JSON 格式的书籍数据，追加到文件中 |
| 请求体 | {"id": "BK001", "title": "...", "author": "...", "publisher": "...", "total_pages": 360, "price": 39.50} |
| 响应格式 | {"code": 200, "message": "新增成功", "data": null} |

> [!tip] 提示
> 逻辑：先查询出来，查询出来的是一个列表，列表中是一个一个的字典对象；然后把接收到的书籍对象，转为字典追加到列表尾部；再将列表数据写入json文件；

### **功能四：根据编号删除书籍 **

| 项目 | 内容 |
| --- | --- |
| 接口 | DELETE /api/books/{book_id} |
| 说明 | 按编号（路径参数）查找并删除指定书籍 |
| 路径参数 | book_id：书籍编号，字符串类型，如 BK001 |
| 响应 | 成功 → {"code": 200, "message": "删除成功", "data": null} |
|  | 不存在 → {"code": 404, "message": "编号 xxx 的书籍不存在", "data": null} |

> [!tip] 提示
> 逻辑：先查询出来，查询出来的是一个列表，列表中是一个一个的字典对象；然后，遍历比对，如果id一致，就执行删除操作； 然后再将删除后的列表数据，写入json文件；