---
tags:
  - 卡点
date: 2026-11-23
技术栈: Python
解决用时:
状态: 未解决
cover: false
title: "直接将对象append进列表的值中了"
---
列表添加进json文件的时候就报错了

`json` 模块只认识 `dict / list / str / int / float / bool / None` 这几种。`Book(...)` 是自定义对象，`json.dump` 不知道该怎么把它写进 JSON，于是抛：

```
TypeError: Object of type Book is not JSON serializable
```

