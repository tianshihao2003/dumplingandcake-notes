---
title: "day08. Python-AI应用实战(准备工作)"
node_token: QKZDw4TCDiMa1hkjPitcPyzwnse
obj_token: V26Qdjmo3oehnYxM0Y8c3SSEngh
obj_type: docx
space_id: ""
url: https://ocn0tgqr5oz2.feishu.cn/wiki/QKZDw4TCDiMa1hkjPitcPyzwnse
edited_at: "1794726044"
exported_at: "2026-11-21T13:23:57.796Z"
cover: false
date: 2026-11-21
---
# 前言

![](./static/day08-Python-AI应用实战%28准备工作%29-ccZTpnCg.png)

**Web应用由三个核心部分组成：**

- 前端程序：进行页面的布局、数据的渲染、用户的交互。

- 服务端程序：主要负责业务逻辑的处理。

- 数据库：负责数据的存储和管理。

![](./static/day08-Python-AI应用实战%28准备工作%29-cEGMFnXb.png)

![](./static/day08-Python-AI应用实战%28准备工作%29-cZ6Nungf.png)

- 前端程序：负责前端页面的布局，数据的展示，网页由 HTML(负责网页的结构)、CSS(负责网页的表现)、JavaScript(负责网页的动作) 三个部分组成 。这部分，我们直接基于VibeCoding就可以很轻松搞定。

- 服务端程序：可以基于Python中的Django、Flask 或 **FastAPI**框架来进行开发，大大简化代码书写，提高开发效率。而当前企业项目开发中，最流行的当属 FastAPI，因此我们课上采用的就是FastAPI。

- HTTP协议：规定了客户端和服务器之间数据传输的规则

- AI大模型：DeepSeek

- 数据库：Mysql数据库

# 网络协议（HTTP）

## 网络基础知识

**网络（互联网Internet）概念**：是由若干网络设备连接起来，形成的一套实现资源共享的系统。

![](./static/day08-Python-AI应用实战%28准备工作%29-cvC3Cnie.png)

思考：生活中有哪些网路设备？
         那么多网路设备，如何定位？

### IP

![](./static/day08-Python-AI应用实战%28准备工作%29-ck55Lnid.png)

IP 地址是设备在互联网中的唯一身份证，核心作用是定位网络中设备的位置，每一台联网设备都有专属 IP 且不重复。

**分类与格式**

- IPv4
  - 由 32 位二进制数组成，日常看到的是十进制四段格式，例：`132.12.86.125`
  - 每一段取值范围：`0~255`，四段组合构成完整 IP 地址

![](./static/day08-Python-AI应用实战%28准备工作%29-cDEmanic.png)

- IPv6
  - 由128 位二进制组成，设计目的是解决 IPv4 地址资源不足的问题
  - 日常开发和上网优先接触的仍是 IPv4

**特殊 IP 地址**

`127.0.0.1`：本地回环地址（本机地址），代表当前电脑自身，项目本地开发调试高频使用。 本机域名对应：`localhost`，和`127.0.0.1`作用完全一致，都可访问本机服务。

### 域名

- **域名(Domain Name)：**是由一串用点分隔的英文字母组成的。IP地址不便于记忆，因此设计出了域名，并通过DNS（域名解析服务器）来将域名和IP地址相互映射，便于记忆和访问。  保罗・莫卡派乔斯

![](./static/day08-Python-AI应用实战%28准备工作%29-cKKHVnoc.png)

1. 我们在浏览器地址栏输入 `www.baidu.com` 之后，一敲回车，首先会访问DNS（域名解析服务器），在域名解析服务器中就记录了域名与IP的对应关系，就会根据对应的域名找到对应的IP地址，比如对应的IP地址为 `110.242.69.21`。

2. 再根据IP地址`110.242.69.21`去找到对应的服务器，访问其中的服务 。

### 端口

- **端口号**（Port）是整数，取值范围在0-65535，它是用来标识计算机设备中的运行中的程序。

![](./static/day08-Python-AI应用实战%28准备工作%29-csVwbnRc.png)

**思考：**
当我在浏览器地址栏当中输入 `www.baidu.com` 之后，访问到的到底是哪一个应用呢？ 我并没有指定端口号，那这个时候我可以打开浏览器来看一下地址栏的地址。

![](./static/day08-Python-AI应用实战%28准备工作%29-ccQuwnSd.png)

- HTTP协议默认端口号为 80。

- HTTPS协议默认端口号为 443。

> [!tip] 提示
> **总结：**
>
> - **IP：**唯一定位一台互联网上的设备(`127.0.0.1`为本机地址)
> - **域名：**降低IP地址的书写与记忆成本(`localhost`为本机域名)
> - **端口：**每一个程序启动运行后都会占用一个端口（`0-65535`，HTTP协议默认端口`80`，HTTPS协议默认端口`443`）

## HTTP协议

### 介绍

![](./static/day08-Python-AI应用实战%28准备工作%29-cuksBn5f.png)

- **概念：**`Hyper Text Transfer Protocol`，超文本传输协议，规定了客户端和服务器之间数据传输的规则。(只有在请求及响应中都遵循了统一的规则，服务端才能读懂客户端发送来的请求，客户端才能解析服务端响应的结果)

### 请求数据格式

- **请求协议：**浏览器将数据以请求格式发送到服务器。包括：**请求行、请求头 、请求体**

- **请求协议组成：**

![](./static/day08-Python-AI应用实战%28准备工作%29-cRVLjnYe.png)

- **请求行(以上图中黄色部分)：**请求数据的第一行，里面包含本次请求的方式、请求的资源路径、协议。
  - 请求方式：常见的请求方式有GET、POST
    - GET: 请求参数在请求行中，没有请求体。如：`/api/courses?name=Python&status=1` 其中的?之后的`name=Python&status=1`就是请求参数，`name`、`status`是参数名，`Python`、`1`就是参数值，形式就是 `key=value&key=value`。GET请求请求参数大小在浏览器中是有限制的 。
    - POST: 请求参数在请求体中（也就是请求协议的第三部分），POST请求大小是没有限制的 。
  - 资源路径：/api/courses 这个就是资源的路径，不包含协议、IP、端口部分，这个不分也被成为URI（统一资源定位符） 。

- **请求头(以上图中绿色部分)：**第二行开始，上图黄色部分内容就是请求头。格式为key: value形式

http是个无状态的协议，所以在请求头设置浏览器的一些自身信息和想要响应的形式。这样服务器在收到信息后，就可以知道是谁，想干什么了。

| 请求头 | 含义 |
| --- | --- |
| Host | 表示请求的主机名 |
| User-Agent | 浏览器版本。 例如：Chrome浏览器的标识类似Mozilla/5.0 ...Chrome/79 ，IE浏览器的标识类似Mozilla/5.0 (Windows NT ...)like Gecko |
| Accept | 表示浏览器能接收的资源类型，如text/*，image/*或者*/*表示所有； |
| Accept-Language | 表示浏览器偏好的语言，服务器可以据此返回不同语言的网页； |
| Accept-Encoding | 表示浏览器可以支持的压缩类型，例如gzip, deflate等。 |
| Content-Type | 请求主体的数据类型 |
| Content-Length | 数据主体的大小（单位：字节） |

- **请求体**(以上图中蓝色部分) ：存储请求参数 
  - GET请求的请求参数在请求行中，故不需要设置请求体
  - 请求体和请求头之间是有一个空行隔开（作用：用于标记请求头结束）

> [!warning] 警告
> GET ：请求参数在 请求行中 ，请求参数大小有限制
>
> POST：请求参数在 请求体中 ，请求参数大小无限制

### 响应数据格式

- **响应协议：**服务器将数据以响应格式返回给浏览器。包括：**响应行 、响应头 、响应体**

- **响应协议组成：**

![](./static/day08-Python-AI应用实战%28准备工作%29-c7ZXHnUc.png)

- **响应行(以上图中黄色部分)**：响应数据的第一行。响应行由`协议及版本`、`响应状态码`、`状态码描述`组成
  - 协议/版本：`HTTP/1.1`
  - 响应状态码：`200`
    - 200：客户端请求成功
    - 400：请求参数错误
    - 404：请求资源不存在，url输入有误，或者网站资源被删除了    
    - 500：服务器发生了不可预期的错误
  - 状态码描述：`OK`

- **响应头(以上图中绿色部分)**：响应数据的第二行开始。格式为key：value形式
  - http是个无状态的协议，所以可以在请求头和响应头中设置一些信息和想要执行的动作，这样，对方在收到信息后，就可以知道你是谁，你想干什么
  - 常见的HTTP响应头有:
    - `Content-Type`：表示该响应内容的类型，例如`text/html`，`image/jpeg` ；
    - `Content-Length`：表示该响应内容的长度（字节数）；
    - `Content-Encoding`：表示该响应压缩算法，例如gzip ；
    - `Cache-Control`：指示客户端应如何缓存，例如max-age=300表示可以最多缓存300秒 ;
    - `Set-Cookie`: 告诉浏览器为当前页面所在的域设置cookie ;

- **响应体(以上图中蓝色部分)**： 响应数据的最后一部分。存储响应的数据
  - 响应体和响应头之间有一个空行隔开（作用：用于标记响应头结束）

# 调用DeepSeek

- 文档地址：https://api-docs.deepseek.com/zh-cn/

![](./static/day08-Python-AI应用实战%28准备工作%29-c9vZXnGe.png)

从官方文档，我们可以看到我们要调用DeepSeek，对应的API接口信息如下：

- **URL：**https://api.deepseek.com/chat/completions

- **方式：**POST

- **请求头：**
  - `Content-Type: application/json`
  - `Authorization: Bearer ${DEEPSEEK_API_KEY}`

- **请求体：**
```json
{
    "model": "deepseek-v4-pro",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ],
    "thinking": {"type": "enabled"},
    "reasoning_effort": "high",
    "stream": false
}
```

## Apifox调用测试

### Apifox

- **Apifox：** 是一款API设计、开发、测试的一体化协作平台，是项目开发中进行API接口测试的神器。

- **官方：**https://apifox.com/

![](./static/day08-Python-AI应用实战%28准备工作%29-ci8n3nve.png)

- **安装：**双击安装包后，正常下一步下一步的安装即可。

- **登录：**可以使用微信扫码登录 ，这样我们所测试的接口，所有的接口信息，都与账户绑定了。

- **创建项目：**点击 "+新建项目" 按钮创建一个新项目

![](./static/day08-Python-AI应用实战%28准备工作%29-cSK9QnQg.png)

![](./static/day08-Python-AI应用实战%28准备工作%29-cFTSNnUe.png)

![](./static/day08-Python-AI应用实战%28准备工作%29-cvnD7n2d.png)

### 调用测试

点击 **"⚡️快捷请求"** 然后输入接口的相关信息，就可以进行测试了。

- 选择请求方式，填写请求url地址，请求头信息。

![](./static/day08-Python-AI应用实战%28准备工作%29-cUjuonDe.png)

- 填写请求体的数据

![](./static/day08-Python-AI应用实战%28准备工作%29-cBH5cnWc.png)

请求信息填写完毕后，直接点击 **"发送"** 按钮，发送请求，就可以获取到DeepSeek响应回来的结果了。

- **请求参数解读：**
  - `model`：使用的模型名称，deepseek-v4-pro（全能旗舰版，更聪明更强大）；deepseek-v4-flash（极速轻量版，更快更便宜）
  - `messages`：与AI大模型交互的消息，是一个列表 ，列表中就是一条一条的消息，消息根据角色role的不同，常分为三类：
    - `system`：系统提示词，给大模型设定人设、角色。
    - `user`：用户提示词，用户发送给大模型的消息。
    - `assistant`：大模型返回的消息
  - `thinking`：思考模式与非思考模式的转换；如果设为 `enabled`，则使用思考模式。如果设为 `disabled`，则使用非思考模式
  - `reasoning_effort`：控制模型的推理强度。对普通请求，默认为 `high`。对一些复杂 Agent 类请求，自动设置为 `max`
  - `stream`：是否流式输出，true表示流式输出；false表示非流式输出。

> [!tip] 提示
> 对于上述的参数，只有`model`、`messages`是必须的，其他都是可选的。参数的具体含义参照官方文档 https://api-docs.deepseek.com/zh-cn/api/create-chat-completion

只指定必填参数 model、messages，我们可以看到，依然可以正常访问。

![](./static/day08-Python-AI应用实战%28准备工作%29-cWTh7nzh.png)

但是，默认情况下，是打开了思考模式的，响应回来的信息中 `reasoning_content` 就是思考的过程，如果不需要思考的过程，我们可以再增加一个参数 `thinking`，设置为 `disabled`。如下：

![](./static/day08-Python-AI应用实战%28准备工作%29-cG5mcn4c.png)

让AI大模型响应回来的数据，呈现流式输出的效果，可以将参数 `stream` 设置为 `true` 即可，如下：

![](./static/day08-Python-AI应用实战%28准备工作%29-cwdVdntd.gif)

### 会话记忆

DeepSeek这类的AI大模型来说，它是没有记忆能力的，DeepSeek的服务端是不会记录用户请求的上下文的

![](./static/day08-Python-AI应用实战%28准备工作%29-cN4venrg.png)

![](./static/day08-Python-AI应用实战%28准备工作%29-chj4pnSf.png)

如果我们想让大模型具备一定的会话记忆，就需要在用户每次请求时，将之前所有的对话历史拼接好后，传递给AI大模型。

**详细说明参照官方文档：**https://api-docs.deepseek.com/zh-cn/guides/multi_round_chat

![](./static/day08-Python-AI应用实战%28准备工作%29-cJlyDnCb.png)

- 第一次交互消息：

```json
"messages": [
   { "role": "system", "content": "你是一名可爱的AI助手, 你的名字叫小甜甜, 请以亲切、可爱语气来回答用户的问题" },
   { "role": "user", "content": "12个苹果,3个人怎么均分" }
]
```

- 第二次消息：

```json
"messages": [
   { "role": "system", "content": "你是一名可爱的AI助手, 你的名字叫小甜甜, 请以亲切、可爱语气来回答用户的问题" },
   { "role": "user", "content": "12个苹果,3个人怎么均分?" },
   { "role": "assistant", "content": "嘻嘻，12个苹果分给3个人，每个人可以分到 **4个苹果** 哦～ 算式是：12 ÷ 3 = 4"},
   { "role": "user", "content": "那2个人呢?" }
]
```

- 第三次消息：

```json
"messages": [
   { "role": "system", "content": "你是一名可爱的AI助手, 你的名字叫小甜甜, 请以亲切、可爱语气来回答用户的问题" },
   { "role": "user", "content": "12个苹果,3个人怎么均分?" },
   { "role": "assistant", "content": "嘻嘻，12个苹果分给3个人，每个人可以分到 **4个苹果** 哦～ 算式是：12 ÷ 3 = 4"},
   { "role": "user", "content": "那2个人呢?" },
   { "role": "assistant", "content": "哎呀，如果是2个人的话，每个人可以分到 **6个苹果** 呢～ 算式是：12 ÷ 2 = 6 "},
   { "role": "user", "content": "那4个人呢?" }
]
```

> [!tip] 🍀
> - 这是大模型 API 会话记忆最基础、最通用的原生方案，行业内统称**上下文拼接（Full Context）**，绝大多数标准 OpenAI 格式接口（DeepSeek、通义、文心、讯飞等）都适用。
> - 优点：不需要其他的组件（数据库、向量库、缓存等）、全平台兼容、效果稳定
> - 缺点：上下文无限膨胀（耗Token）、存在模型最大Token限制、长对话冗余
> - 优化方案：
>   - 滑动窗口 / 截断历史：只保留最近 N 轮对话，超出则删掉最早期记录，控制整体 Token 数量。
>   - 压缩上下文：轮次多了之后，把早期对话总结成一段简短文本，替换原始长历史，压缩上下文。
>   - RAG 检索增强 + 会话记忆：结合向量数据库，只把当前问题相关的历史内容喂给模型，彻底解决长对话、长文档场景。

## 代码调用测试

### 准备工作

基于Python代码如何调用DeepSeek。

- 官方文档：https://api-docs.deepseek.com/zh-cn/

![](./static/day08-Python-AI应用实战%28准备工作%29-cFJlPncc.png)

**一、下载第三方库：**需要使用openai库，所以需要将该第三方库下载下来

使用命令 `pip install openai` 或 `uv add openai`

![](./static/day08-Python-AI应用实战%28准备工作%29-cAkd7ntc.png)

> [!tip] 🍀
> 安装第三方依赖库命令：
>
> - 安装软件包（最新版本）：uv add openai
> - 安装软件包（指定版本）： uv add openai=2.13.0
> - 卸载软件包：uv remove openai

> [!tip] 🍀
> **pip：**pip是Python官方提供的Python包的管理工具，提供了对Python包的查找、下载、安装、卸载等功能 。

> [!tip] 🍀
> **uv：**一个替代pip、效率更高、功能更加强大的Python包和项目管理工具（兼容pip） 。

### 编写代码测试

新建一个文件 "DeepSeek调用测试.py"

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {"role": "system", "content": "你是一名温柔可爱的AI助理, 请以温柔可爱的语气回答用户的问题"},
        {"role": "user", "content": "你是谁?"},
    ],
    stream=False,
    reasoning_effort="high",
    extra_body={"thinking": {"type": "enabled"}}
)

print(response.choices[0].message.content)
```

**注意：**我们可以看到在DeepSeek官方提供的样例代码中，并没有将`api_key`直接写死在代码中，就是因为api_key是我们账号的秘钥，写在代码中是很容易泄露的，所以这类的数据是非常敏感的，建议将其保存在我们本地的环境变量中，在代码中，我们直接获取本地的环境变量中的数据即可，这个环境变量名就叫 `DEEPSEEK_API_KEY`。

![](./static/day08-Python-AI应用实战%28准备工作%29-cuYAgnEb.png)

> [!danger] 
> **注意：环境变量如果是新配置的，需要将PyCharm关闭了，重新打开一下才会生效！！！！**

# FastAPI基础

## 入门程序

### 介绍

- FastAPI是一个现代、快速、高性能的Web框架，基于标准的Python类型提示构建API接口服务。

- 官网：`https://fastapi.org.cn`

![](./static/day08-Python-AI应用实战%28准备工作%29-cZL56nPe.png)

### 入门程序

- **需求：**开发一个API接口，访问路径为 http://localhost:8000/users ，用来查询所有的用户信息。

- **步骤：**

1. 安装`fastapi`库 （`uv add fastapi uvicorn`）

![](./static/day08-Python-AI应用实战%28准备工作%29-ctPCHnqx.png)

> [!tip] 🍀
> **uvicorn：**专门为现代 Python Web 框架（FastAPI、Starlette）设计的高性能服务器。

1. 导入FastAPI，创建FastAPI实例对象

app = FastAPI()

1. 创建路径操作函数，添加装饰器（`@app.get("/")`），绑定函数与路径的关系

```python
from fastapi import FastAPI

# 创建FastAPI实例
app = FastAPI()

# 定义路由
@app.get("/")
def read_root():
    print("访问了根路由")
    return {"message": "Hello, World!"}

# 定义路由
@app.get("/users")
def get_users():
    print("获取用户列表...")
    return [
        {"id": 1, "name": "Alice", "age": 18},
        {"id": 2, "name": "Bob", "age": 20},
        {"id": 3, "name": "Charlie", "age": 25}
    ]
```

> [!tip] 🍀
> `@app.get("/users")`
>
> - `@`写法在Python中叫装饰器，它能在不修改原函数代码的前提下，给函数动态添加额外功能
> - 对于当前这个装饰器来说，就是用来绑定函数与访问路径的（app指的是FastAPI实例的名字，get指的是请求方式）

1. 运行FastAPI服务：`uvicorn 模块名:实例名 --reload` 当前项目运行命令为：`uvicorn FastAPI-Demo:app --reload`

```python
# 运行FastAPI应用
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

最终我们就可以直接右键，运行这个项目了【推荐】。

![](./static/day08-Python-AI应用实战%28准备工作%29-cC7qNnVc.png)

完成入门程序代码如下：

```python
from fastapi import FastAPI

# 创建FastAPI实例
app = FastAPI()

# 定义路由
@app.get("/")
def read_root():
    print("访问了根路由")
    return {"message": "Hello, World!"}

# 定义路由
@app.get("/users")
def get_users():
    print("获取用户列表...")
    return [
        {"id": 1, "name": "Alice", "age": 18},
        {"id": 2, "name": "Bob", "age": 20},
        {"id": 3, "name": "Charlie", "age": 25}
    ]

# 运行FastAPI应用
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Pydantic模型

### Pydantic模型定义

> [!tip] 🍀
> **Pydantic**是一个Python数据验证库，将数据的结构定义为带有属性的类，每个属性都指定一个类型，当创建这个类的实例时，Pydantic会自动进行数据验证、转换、序列化和反序列化，广泛用于 FastAPI 等框架中确保数据类型安全和数据完整性。

定义Pydantic模型（继承BaseModel父类），然后在其中定义这个类中的一个一个的属性 （基于类型注解的方式来定义）。

```python
from fastapi import FastAPI
from pydantic import BaseModel

# 创建FastAPI实例
app = FastAPI()

# 定义Pydantic模型
class User(BaseModel):
    id: int
    name: str
    age: int
    
class User(BaseModel):
    name:str
    age:int
    

# 定义路由
@app.get("/users")
def get_users():
    print("获取用户列表...")
    return [
        User(id=1, name="Alice", age=18),
        User(id=2, name="Bob", age=20),
        User(id=3, name="Charlie", age=25)
    ]

# 运行FastAPI应用
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

> [!danger] 
> **注意：**
>
> - Pydantic模型在创建对象的时候，必须要基于**关键字参数**形式传递，使得代码更易读、易维护。
> - 一旦Pydantic模型继承了BaseModel之后，继承下来的 __init__ 方法中，属性要求以**关键字形式传递**。

**提示：**

一旦我们基于Pydantic模型来封装数据，FastAPI就会自动对封装的数据进行**校验、转换**，校验参数值是否符合Pydantic模型定义时指定的类型。

如果指定的属性，可有可无，可以为属性设置默认值，比如如下这样：

```python
# 定义Pydantic模型
class User(BaseModel):
    id: int
    name: str
    age: int | None = None        # 设置默认值, 在构建对象时, 该属性就可以不传递了;
```

### Swagger接口文档

FastAPI中，默认给我们提供了API接口文档，项目启动起来之后，我们访问 `http://localhost:8000/docs` 就可以访问到该接口文档了。并且我们也可以在这份接口文档中，直接来进行接口测试 （`Try it out`）。

![](./static/day08-Python-AI应用实战%28准备工作%29-c6Oxkn5c.png)

如果想让生成的接口文档信息，更加详细，我们可以在编写代码，定义API接口时，加上接口的描述信息。比如：

```python
from fastapi import FastAPI
from pydantic import BaseModel

# 创建FastAPI实例
app = FastAPI(title="FastAPI入门", description="FastAPI入门程序演示", version="1.0.0")

# 定义Pydantic模型
class User(BaseModel):
    id: int
    name: str
    age: int

# 定义路由
@app.get("/users", summary="获取用户列表", response_model=list[User])
def get_users():
    print("获取用户列表...")
    
 
    return [
        User(id=1, name="Alice", age=18),
        User(id=2, name="Bob", age=20),
        User(id=3, name="Charlie", age=25)
    ]

# 运行FastAPI应用
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

最终再访问接口文档，我们就可以看到这个项目的描述，每一个接口的详细描述。

![](./static/day08-Python-AI应用实战%28准备工作%29-cU6L6nAe.png)

## 异步编程

### 同步与异步

> [!tip] 🍀
> **同步(Synchronous)**：指做完一件事，再开始做下一件事儿，如果前面一件事儿还没有完成，就得等待着。 特点：阻塞、等待、串行。

![](./static/day08-Python-AI应用实战%28准备工作%29-c5mZInfd.png)

- 特点就是：**阻塞、等待、串行 **。性能是比较低的，不能充分的利用资源。

> [!tip] 🍀
> **异步(Asynchronous)**：发起一件事后，直接继续做其他事，无需原地等待。特点：非阻塞、不等待、并行。

![](./static/day08-Python-AI应用实战%28准备工作%29-caTBXndb.png)

特点就是：**非阻塞、不等待、并发 **。性能是比较高的，可以充分的利用资源。

### 计算机世界

上面我们用餐厅的例子理解了同步和异步，那么回到计算机世界，我们的操作系统是如何实现异步、充分利用资源的呢？

> [!tip] 提示
> 想象一下，如果电脑只能同步执行任务：
>
> - 你打开百度网盘下载文件 → CPU必须等着下载完成
> - 下载期间你点开微信 → 没反应，因为CPU还在等下载
> - 你想同时听歌、写文档、聊微信？不可能！
>
> 如何解决上面的问题？

答案就是：**进程、线程、协程**。

> [!tip] 🍀
> **进程**：每个运行的程序（微信、Chrome、百度网盘）就是一个进程，操作系统给每个进程分配独立的内存等资源。

> [!tip] 🍀
> **线程**：每个进程内部可以包含多个线程，线程才是真正干活的最小单位。
>
> 比如Chrome浏览器，一个线程负责渲染网页，另一个线程负责下载文件，还有一个线程负责播放视频 —— 它们可以**同时**进行。

> [!tip] 🍀
> **协程**：可以理解为线程里的更小单位，是一种可以在执行过程中暂停并让出控制权，稍后再从暂停处继续执行的轻量级程序组件，常用于异步编程。
>
> 是一种用户态的轻量级异步任务，多个协程可以在同一个线程中协作式调度，遇到 I/O 等待时主动让出控制权。

### 异步编程

- FastAPI原生支持异步编程，开发者只需使用 `async def` 定义路径操作函数，并配合 `await` 关键字调用异步操作，即可实现高性能的异步请求处理。

```python
import asyncio
import time
from fastapi import FastAPI

# 创建FastAPI实例
app = FastAPI(title="异步编程演示")

# 同步操作演示
def mock_io_task():
    print("开始查询数据...")
    time.sleep(3) # 固定等待3秒
    print("数据查询完成...")

@app.get("/sync_demo")
def sync_handle():
    t1 = time.time()    # 获取当前时间

    # 执行3次任务，依次等待
    mock_io_task()
    mock_io_task()
    mock_io_task()

    t2 = time.time()    # 获取当前时间
    cost = round(t2 - t1, 2)
    return {"模式":"同步串行", "执行耗时(秒)": cost}

# 异步操作演示
async def mock_async_task2():
    print("开始查询数据...")
    await asyncio.sleep(3)
    print("数据查询完成...")

@app.get("/async_demo")
async def async_handle2():
    t1 = time.time()         # 获取当前时间
    # 一次性调度3个任务 同时启动这3个任务，并发执行，等所有任务都完成后，再继续往下执行
    await asyncio.gather(
        mock_async_task2(),
        mock_async_task2(),
        mock_async_task2()
    )
    t2 = time.time()        # 获取当前时间
    cost = round(t2 - t1, 2)
    return {"模式":"异步并发", "执行耗时(秒)": cost}

# 启动FastAPI服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

上述代码中，定义了两个API接口，一个是同步操作，一个是异步操作。请求地址分别为：

- 同步操作：`http://localhost:8000/sync_demo`

- 异步操作：`http://localhost:8000/async_demo`

我们可以执行的任务逻辑是一致的，但是执行耗时却有差很大的差别。

> [!danger] 
> **注意：**async修饰的函数称之为协程函数（返回的是协程对象），await的作用是暂停当前协程（挂起），交出控制权给事件循环

> [!danger] 
> **注意：**await后面的语句不能随便写，得是可等待的对象(协程/任务)，并且await所在的函数，必须得被async修饰。