---
title: "day09.Python-AI应用实战"
node_token: PI4Zwgf5Ai77WokfXFOcRvaYnRd
obj_token: G49ZdHZWpoq8CvxHlOHcIyVmnzf
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/PI4Zwgf5Ai77WokfXFOcRvaYnRd
edited_at: "1786326346"
exported_at: "2026-11-21T13:24:18.742Z"
cover: false
date: 2026-11-21
---
# 作业一：优先完成课程中案例的所有代码【必做】

# 作业二：基于FastAPI完成书籍管理系统开发【选做】

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

> 内嵌电子表格（v1 不转换），token: TbJqsIIrOhTudqtAjqZc5sxEnmc_ARiVaH

## **需要实现的功能**

> [!tip] 🍀
> 如下功能，详细的接口描述，可以参照接口文档 【提供的文件夹中有】。

### **功能一：访问前端页面**

> 内嵌电子表格（v1 不转换），token: TbJqsIIrOhTudqtAjqZc5sxEnmc_pRZcSy

### **功能二：查询全部书籍列表**

> 内嵌电子表格（v1 不转换），token: TbJqsIIrOhTudqtAjqZc5sxEnmc_kWqDPm

响应中的 `data` 是一个数组，每个元素是一条书籍记录。

### **功能三：新增书籍**

> 内嵌电子表格（v1 不转换），token: TbJqsIIrOhTudqtAjqZc5sxEnmc_h3M3gp

> [!tip] 提示
> 逻辑：先查询出来，查询出来的是一个列表，列表中是一个一个的字典对象；然后把接收到的书籍对象，转为字典追加到列表尾部；再将列表数据写入json文件；

### **功能四：根据编号删除书籍 **

> 内嵌电子表格（v1 不转换），token: TbJqsIIrOhTudqtAjqZc5sxEnmc_gMP4vr

> [!tip] 提示
> 逻辑：先查询出来，查询出来的是一个列表，列表中是一个一个的字典对象；然后，遍历比对，如果id一致，就执行删除操作； 然后再将删除后的列表数据，写入json文件；