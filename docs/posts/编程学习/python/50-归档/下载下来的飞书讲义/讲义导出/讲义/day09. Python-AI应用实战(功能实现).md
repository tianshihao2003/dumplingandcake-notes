---
title: "day09. Python-AI应用实战(功能实现)"
node_token: UUfPw0f3Vi4TdLkCe5KctlY2nmZ
obj_token: JmPGdCTiYoJpXFxyedcckYkCnMh
obj_type: docx
space_id: ""
url: https://ocn0tgqr5oz2.feishu.cn/wiki/UUfPw0f3Vi4TdLkCe5KctlY2nmZ
edited_at: "1794726044"
exported_at: "2026-11-21T13:23:56.070Z"
cover: false
date: 2026-11-21
---
# 准备工作

![](./static/day09-Python-AI应用实战%28功能实现%29-cmEhUn5g.png)

**《AI智能伴侣》**是一款基于人工智能的情感陪伴应用，通过AI大模型技术，为你打造专属的虚拟伴侣体验。你可以为AI伴侣设置昵称和性格，她/他会以对应的人设与你进行自然、温馨的对话，无论是分享日常、倾诉心事，还是闲聊打发时间，她/他都能给你温暖的回应。

## 环境准备

接下来，我们先来完成这个项目基础的环境搭建工作。

![](./static/day09-Python-AI应用实战%28功能实现%29-cQfiondh.png)

### 前端环境准备

准备前端程序的运行环境，需要将资料中准备的前端程序的运行环境(`nginx-ai-partner.zip`)，解压到一个**没有中文不带空格的目录**下。

![](./static/day09-Python-AI应用实战%28功能实现%29-cczZMnmb.png)

解压到一个**没有中文不带空格的目录**下。

![](./static/day09-Python-AI应用实战%28功能实现%29-czchun1c.png)

- 启动：双击 `nginx.exe` 即可启动前端服务，启动后占用端口号为 88。 （端口号，是在 `conf/nginx.conf` 中配置的）

- 停止：
  - 方式一：（在Nginx解压目录下，打开cmd，执行命令 `nginx.exe -s stop`）

![](./static/day09-Python-AI应用实战%28功能实现%29-c6xTgnue.png)

  - 方式二：（在任务管理器中找到对应的nginx进程，直接右键结束进程）

![](./static/day09-Python-AI应用实战%28功能实现%29-cvF5knLg.png)

> [!tip] 🍀
> **提示：这个案例的前端Nginx服务，并不会开机自动启动，因此需要每次电脑关机重新打开后，要启动这个Nginx。**

前端服务启动完毕后，我们就可以直接在浏览器地址栏来访问前端页面了。 直接访问：`http://localhost:88`

![](./static/day09-Python-AI应用实战%28功能实现%29-cR4uDnXe.png)

### 服务端环境准备

**1). 创建一个新的项目，名字为 **`ai_partner`

![](./static/day09-Python-AI应用实战%28功能实现%29-cvpDvnAf.png)

![](./static/day09-Python-AI应用实战%28功能实现%29-cw0UrnYd.png)

一旦我们选择创建的是一个 `FastAPI` 项目，那么IDE会自动帮我们安装 `fastapi`**、**`uvicorn` 的依赖库，并且自动给我们创建好 `FastAPI`实例，准备好样例代码，如下：

![](./static/day09-Python-AI应用实战%28功能实现%29-ciBKAnjw.png)

**2). 将资料中准备的**`data`**目录拷贝到项目目录下。**

`data` 目录下存放的是基础数据。

![](./static/day09-Python-AI应用实战%28功能实现%29-c06r1nqg.png)

**3). 调整FastAPI实例的描述信息，添加启动项目的代码。**

```python
from fastapi import FastAPI

app = FastAPI(title="AI智能伴侣", description="一款基于人工智能的情感陪伴应用", version="1.0.0")     # 创建FastAPI实例

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 交互流程

- 首先，浏览器发起请求（`http://localhost:88`）请求前端服务，如果在端口号后没有指定请求的资源，默认访问的就是 index.html，将index.html响应给浏览器。

- 浏览器接收到响应的index.html页面后，对其进行解析、渲染，然后展示出项目的页面效果。

- 而在前端程序中，在页面加载完毕后，又自动发起了请求，来获取伴侣预设信息，请求路径为：`http://localhost:88/api/presets`。

- 而由于在 `conf/nginx.conf` 中配置了如下配置，如果发起的请求请求路径为 `/api` 开头，会自动的将请求转给 `http://localhost:8000` 的服务器来处理。

- 服务端 Python 程序，就需要接收请求，然后再进行处理，然后将处理完毕的结果响应给Nginx，Nginx再将响应的数据，响应给前端。

- 前端再将数据渲染展示在页面中。

**前后端交互的流程如下所示：**

![](./static/day09-Python-AI应用实战%28功能实现%29-cjH1Gnxb.png)

在上述的示意图中，浏览器发起了两次请求：

- `http://localhost:88/` 这个就是访问项目的首页面，没有指定访问资源，默认访问的就是 `index.html`。

- `http://localhost:88/api/presets` 这个是前端页面加载完毕后，自动发起的请求，来获取伴侣的预设信息列表的。

> [!tip] 🍀
> **访问前端访问的路径为：**`http://localhost:88/`**，访问服务端的API接口，访问路径为：**`http://localhost:8000/`**。（访问完整的项目，要访问的是前端**`http://localhost:88/`**，再由前端访问服务器端 ）**

# 功能开发

## 预设伴侣信息加载

### 分析

![](./static/day09-Python-AI应用实战%28功能实现%29-crjVknbh.png)

- **需求：**进入项目之后，就需要请求服务端加载伴侣预设信息，然后展示在前端页面上。

- **接口信息如下：**
  - **接口地址**: `/api/presets`
  - **请求方式**: `GET`
  - **接口描述**: 获取所有AI伴侣预设数据，前端用于渲染预设选择下拉框
  - **请求参数**: 无
  - **响应参数**: 
> 内嵌电子表格（v1 不转换），token: QdO8szN5ThJlBktQZjXczguanod_sEjzcn
  - **响应示例**:
```json
{
    "code": 200,
    "message": "获取预设列表成功",
    "data": [
        {
            "id": 1,
            "name": "东北甜妹",
            "nick_name": "小甜甜",
            "nature": "活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心",
            "sort_order": 1
        },
        {
            "id": 2,
            "name": "温柔御姐",
            "nick_name": "诗涵",
            "nature": "温柔体贴的南方姑娘，知性优雅，说话轻声细语，善解人意，很会照顾人",
            "sort_order": 2
        }
    ]
}
```

- 预设伴侣信息的数据来源于文件 `companion_presets.json`

### 代码实现

```python
import json
import os.path
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel

#创建一个FastApi实例
app = FastAPI()
#定义一个类,目的是为了封装响应结果
class ApiResponse(BaseModel):
    code:int
    message:str
    data:Any = None

#定义一个函数（功能），作用：查询文件中的预设信息，响应给前端
#指定资源路径
@app.get("/api/presets")
def get_presets():
    print("获取伴侣的预设列表")
    # 读取文件中的数据
    #先判断文件是否存在,如果不存在返回一个500,响应原因
    if not os.path.exists("data/companion_presets.json"):
        return ApiResponse(code=500,message="预设信息不存在")
    else:
        #如果文件存在,就读取文件中的内容,响应读取的结果
        with open("data/companion_presets.json","r",encoding="utf-8") as f:
            #使用json模块读取文件中的json数据
            data = json.load(f)

        #响应结果给前端
        return ApiResponse(code=200,message="获取伴侣预设信息成功",data = data)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=8000)
```

代码编写完毕后，我们就可以启动服务来做一个测试了。 我们可以先打开Swagger接口文档（`http://localhost:8000/docs`），进行测试。

![](./static/day09-Python-AI应用实战%28功能实现%29-cjzsGnle.png)

通过接口测试，我们可以看到数据已经可以正常查询出来了，说明我们的接口开发的说没有问题的，接下来，我们再直接来打开前端页面进行联调测试。

![](./static/day09-Python-AI应用实战%28功能实现%29-cOtJ3nuh.png)

最终，我们可以看到预设的模板全部可以正常加载并展示出来。

## 新建会话

### 分析

![](./static/day09-Python-AI应用实战%28功能实现%29-cRIW3nPg.png)

在我们访问这个项目之后，如果当前页面中没有会话，前端就会自动发起请求，来创建一个新的会话 。在创建会话时，前端就会将伴侣的基本信息（包括昵称、性格）传递给服务器端，服务器就需要将这个会话信息保存起来。

**接口信息如下：**

- **接口地址**: `/api/sessions`

- **请求方式**: `POST`

- **接口描述**: 创建一个新的聊天会话，自动生成会话ID

- **请求参数**:
> 内嵌电子表格（v1 不转换），token: QdO8szN5ThJlBktQZjXczguanod_7p9BVW

- **请求示例**:
```python
{
    "nick_name": "小甜甜",
    "nature": "活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心"
}
```

- **响应参数**:
> 内嵌电子表格（v1 不转换），token: QdO8szN5ThJlBktQZjXczguanod_1q39vH

- **响应示例**:
```python
{
    "code": 200,
    "message": "创建会话成功",
    "data": "2026-05-29_15-30-00"
}
```

那为了在后续的访问中，我们能够看到之前与AI大模型交互的会话数据，我们这里可以将与AI大模型交互的这些会话的数据都保存起来，目前我们可以将其保存在文件中，一个会话对应一个文件（比如 `2026-05-29_15-30-00.json`），所有的会话都保存到一个 sessions 目录中。

### 代码实现

代码实现如下：

```python
import json
import os.path
from datetime import datetime
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

# 创建FastAPI实例
app = FastAPI(title="AI智能伴侣", description="一款基于人工智能的情感陪伴应用", version="1.0.0")

# 会话数据目录
SESSIONS_DIR = "sessions"
if not os.path.exists(SESSIONS_DIR):
    os.mkdir(SESSIONS_DIR)

# 常量
PRESETS_FILE_PATH = "data/companion_presets.json"

# ==================== 工具函数 ====================
def generate_session_name():
    """生成会话标识"""
    return datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

def get_session_path(session_name: str) -> str:
    """获取会话文件路径"""
    return f"{SESSIONS_DIR}/{session_name}.json"

# 数据模型
# 统一响应模型
class ApiResponse(BaseModel):
    code: int = 200
    message: str = "操作成功"
    data: Any | None = None

# 新建回话请求模型
class CreateSessionRequest(BaseModel):
    nick_name: str
    nature: str

@app.get("/api/presets", summary="获取预设伴侣信息列表", response_model=ApiResponse)
async def presets() -> ApiResponse:
    print("获取预设列表")
    if not os.path.exists(PRESETS_FILE_PATH):
        return ApiResponse(code=500, message="预设文件不存在")
    else:
        with open(PRESETS_FILE_PATH, "r", encoding="utf-8") as f:
            presets_list = json.load(f)
        # 排序
        presets_list.sort(key=lambda x: x["sort_order"])
        return ApiResponse(code=200, message="获取预设伴侣信息成功", data=presets_list)

@app.post("/api/sessions", summary="创建新会话", response_model=ApiResponse)
def create_session(request: CreateSessionRequest) -> ApiResponse:
    """创建新会话"""
    print(f"创建会话: {request}")
    session_name = generate_session_name()
    session_data = {
        "nick_name": request.nick_name,
        "nature": request.nature,
        "session_name": session_name,
        "messages": []
    }
    with open(get_session_path(session_name), "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    return ApiResponse(code=200, message="创建会话成功", data=session_name )

# 启动服务
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

> [!tip] 🍀
> **在新建会话时，前端传递给服务端的参数包含两项，分别为 **`nick_name`** 与 **`nature`**，并以json格式在请求体中传递到服务端。 服务器端，可以通过一个实体对象来接收，只需要保证 json 格式中的key与实体对象中的属性名一致即可。**

代码编写完毕后，我们就可以启动服务来做一个测试了。 我们可以先打开Swagger接口文档（`http://localhost:8000/docs`），进行测试。

![](./static/day09-Python-AI应用实战%28功能实现%29-czPQLnze.png)

通过接口测试，我们可以看到数据已经可以正常查询出来了，说明我们的接口开发的说没有问题的，接下来，我们再直接来打开前端页面进行联调测试。

![](./static/day09-Python-AI应用实战%28功能实现%29-cr8RcnZd.png)

最终，我们可以看到进入项目后，自动帮我们创建了一个新的会话，并在页面中展示出了这个会话的名称 。 当然在服务端，我们也可以看到在项目的sessions目录下，多了一个json文件，这个json文件就是当前会话信息的存储文件。

![](./static/day09-Python-AI应用实战%28功能实现%29-cR3v4npb.png)

## 与AI交互

### 分析

![](./static/day09-Python-AI应用实战%28功能实现%29-cMRcXn9n.png)

创建完会话之后，我们就可以与AI大模型交互了，如果说默认选中的伴侣信息不能满足我们的需求，我们可以在伴侣信息栏去做调整即可，然后就可以在下方的输入框中输入要提问的问题。

为了能在后续的操作过程中，还能查看到历史的会话数据信息，我们就需要在每一次对话后，将会话信息保存在会话文件中 `xxxx.json` 中。

而为了让大模型具备会话记忆的能力，我们每一次与AI大模型交互时，传递的消息是不是都需要包含之前交互的回话数据呀，也就是之前所说的会话消息要滚雪球。

因此，在与AI大模型交互时，我们的思路如下：

> 画板（v1 不导出视觉内容），token: TWxqwZ3izhcHiJb7AAAc0gWynUg

**接口文档如下：**

- **接口地址**: `/api/chat`

- **请求方式**: `POST`

- **接口描述**: 与AI伴侣进行对话，服务端会自动加载该会话的历史消息，并调用DeepSeek大模型生成回复。每次对话会自动保存到会话文件中。

- **请求参数**:
> 内嵌电子表格（v1 不转换），token: QdO8szN5ThJlBktQZjXczguanod_fVwvSw

- **请求示例**:
```json
{
    "session_name": "2026-05-25_10-47-15",
    "message": "今天心情不太好",
    "nick_name": "小甜甜",
    "nature": "活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心"
}
```

- **响应参数**:
> 内嵌电子表格（v1 不转换），token: QdO8szN5ThJlBktQZjXczguanod_bFhpCZ

- **响应示例**:
```python
{
    "code": 200,
    "message": "请求成功",
    "data": "咋滴啦大兄弟？有啥不开心的跟姐说说，别憋着！🌸"
}
```

### 代码实现

分析完毕后，我们再来完成与AI交互的代码实现，实现思路与上述分析的思路是一致的。 具体的代码如下：

```python
import json
import os
from datetime import datetime
from typing import Any
from fastapi import FastAPI
from openai import OpenAI
from pydantic import BaseModel

#创建一个FastApi实例
app = FastAPI()

#创建一个openai对象,用于调用大模型
client = OpenAI(
    api_key=os.environ.get('DEEPSEEK_API_KEY'),
    base_url="https://api.deepseek.com")

#定义一个常量,存储预设信息文件路径:
PRESETS_FILE_PATH = "data/companion_presets.json"
#定义一个目录用来保存会话文件,如果目录不存在则创建
SESSION_DIR = "messages"
if not os.path.exists(SESSION_DIR):
    os.mkdir(SESSION_DIR)

def get_session_path(session_name):
    return f"{SESSION_DIR}/{session_name}.json"

#AI提示词模板
 # 系统提示词模板
SYSTEM_PROMPT_TEMPLATE = """你叫 %s，现在是用户的真实伴侣，请完全代入伴侣角色。
    规则：
        1. 每次只回1条消息
        2. 禁止任何场景或状态描述性文字
        3. 匹配用户的语言
        4. 回复简短，像微信聊天一样
        5. 有需要的话可以用❤️🌸等emoji表情
        6. 用符合伴侣性格的方式对话
        7. 回复的内容, 要充分体现伴侣的性格特征
        8. 不要太肉麻（比如想你之类的，就日常聊天）
    伴侣性格：
        - %s
    你必须严格遵守上述规则来回复用户。
    """

#定义一个类,目的是为了封装响应结果
class ApiResponse(BaseModel):
    code:int
    message:str
    data:Any = None

#定义一个类,在新建会话时,使用该类的对象来接收传入的参数
class CreateSessionRequest(BaseModel):
    nick_name:str
    nature:str

#定义一个类,用于接收AI交互时传递的参数
class ChatRequest(BaseModel):
    session_name:str
    message:str
    nick_name:str
    nature:str

#定义一个函数（功能），作用：查询文件中的预设信息，响应给前端
#指定资源路径
@app.get("/api/presets")
def get_presets():
    print("获取伴侣的预设列表")
    # 读取文件中的数据
    #先判断文件是否存在,如果不存在返回一个500,响应原因
    if not os.path.exists(PRESETS_FILE_PATH):
        return ApiResponse(code=500,message="预设信息不存在")
    else:
        #如果文件存在,就读取文件中的内容,响应读取的结果
        with open(PRESETS_FILE_PATH,"r",encoding="utf-8") as f:
            #使用json模块读取文件中的json数据
            data = json.load(f)

        #响应结果给前端
        return ApiResponse(code=200,message="获取伴侣预设信息成功",data = data)

#定义一个API接口,新建会话
#接口功能: 1.接收前端传来的参数  2.构建要存储的信息   3.新建一个文件(用来存储当前会话的信息)  4.响应结果给前端
@app.post("/api/sessions")
def create_session(request:CreateSessionRequest): #定义一个参数,来接收前端请求的数据
    print("新建一个会话~")

    #以当前时间来表示文件的名称(会话名称)
    session_name = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    # 新建的会话文件要存储什么东西?怎么存?
    # 会话名 \ AI伴侣的名称\ AI伴侣的性格\将来的对话信息
    # 以json格式来存储
    session_data = {
        "session_name":session_name,
        "nick_name":request.nick_name,
        "nature":request.nature,
        "messages":[]
    }

    #创建会话文件,存储会话信息
    with open(get_session_path(session_name),"w",encoding="utf-8") as f:
        json.dump(session_data,f,ensure_ascii = False,indent=2)

    #响应结果:会话名,状态码,提示信息
    return ApiResponse(code=200,message="新建会话成功",data=session_name)

#定义一个API接口,用于和智能伴侣对话
@app.post("/api/chat")
def chat(request:ChatRequest):
    print(f"发送消息成功~{request.session_name},{request.nick_name},{request.message},{request.nature}")
    #构建提示词模板
    sys_temp = SYSTEM_PROMPT_TEMPLATE % (request.nick_name, request.nature)
    #读取当前会话中的内容,将聊天的信息替换,写入到文件中
    with open(get_session_path(request.session_name),"r",encoding="utf-8") as f:
        session_data = json.load(f)
    #将用户发送的消息存储
    session_data_messages = session_data.get("messages")
    session_data_messages.append({"role":"user","content":request.message})

    #构建完整的历史信息,让大模型游泳会话记忆的功能
    send_messages = [{"role": "system", "content": sys_temp}]
    for s in session_data_messages:
        send_messages.append(s)

    #要调用AI模型,模拟对话
    response = client.chat.completions.create(
        model="deepseek-v4-pro",
        messages=send_messages,
        stream=False,
        reasoning_effort="high",
        extra_body={"thinking": {"type": "disabled"}}
    )
    #接收AI模型返回的结果
    result = response.choices[0].message.content

    #将大模型回复的结果，存储
    session_data_messages.append({"role": "assistant", "content": result})
    session_data["nick_name"] = request.nick_name
    session_data["nature"] = request.nature
    #将最新的信息，替换到文件中
    with open(get_session_path(request.session_name), "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)
    #将结果响应给前端
    return ApiResponse(code=200,message="回复成功",data=result)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=8000)
```

代码编写完毕后，我们就可以启动服务来做一个测试了。 我们可以直接打开浏览器，访问 AI智能伴侣 这个项目，然后与AI进行交互了。

![](./static/day09-Python-AI应用实战%28功能实现%29-cu6TQnDd.png)