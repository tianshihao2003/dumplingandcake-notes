---
title: "day10. Python-AI应用实战(功能实现)"
node_token: NTJfwl8VNiksLekXuOrc8f1dnDy
obj_token: EtQ6dfk2zoqvqsxlzUAcKoksnkf
obj_type: docx
space_id: ""
url: https://ocn0tgqr5oz2.feishu.cn/wiki/NTJfwl8VNiksLekXuOrc8f1dnDy
edited_at: "1794726044"
exported_at: "2026-11-21T13:24:01.757Z"
cover: false
date: 2026-11-21
---
# 功能开发

## 会话列表

### 分析

进入项目之后，在左侧就要展示出会话历史列表，这里需要根据会话标识倒序排序展示在页面上 。

![](./static/day10-Python-AI应用实战%28功能实现%29-cwTeAnM0.png)

那其实，加载会话历史列表，就是将会话文件的文件名，读取出来，然后按照会话名称进行倒序排序是不是就可以了。

**具体的接口信息如下：**

- **接口地址**: `/api/sessions`

- **请求方式**: `GET`

- **接口描述**: 获取所有会话列表，按时间降序排列 (最新的会话排在最前)

- **请求参数**: 无

- **请求示例**: `/api/sessions`

- **响应参数**:
> 内嵌电子表格（v1 不转换），token: OA2TsJBv2hFiiIt0tajcPYTcnfg_PHq424

- **响应示例**:
```json
{
    "code": 200,
    "message": "获取会话列表成功",
    "data": [
        "2026-05-25_10-47-15",
        "2026-04-27_14-45-33",
        "2026-04-27_14-22-06"
    ]
}
```

### 代码实现

该功能的具体代码实现如下：

```python
import json
import os.path
from datetime import datetime
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from openai import OpenAI

# 创建FastAPI实例
app = FastAPI(title="AI智能伴侣", description="一款基于人工智能的情感陪伴应用", version="1.0.0")

# 会话数据目录
SESSIONS_DIR = "sessions"
# 常量
PRESETS_FILE_PATH = "data/companion_presets.json"
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

# 初始化OpenAI客户端
client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'),base_url="https://api.deepseek.com")

if not os.path.exists(SESSIONS_DIR):
    os.mkdir(SESSIONS_DIR)

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

class ChatRequest(BaseModel):
    session_name: str     #  会话标识
    message: str        #  用户消息
    nick_name: str      #  伴侣昵称
    nature: str         #  伴侣性格

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

    return ApiResponse(code=200, message="创建会话成功", data=session_name)

@app.post("/api/chat", summary="与AI交互", response_model=ApiResponse)
def chat(request: ChatRequest) -> ApiResponse:
    """与AI对话（非流式）"""
    print(f"与AI交互: {request.session_name} : {request.message}")

    # 1. 加载json文件中的会话数据
    session_path = get_session_path(request.session_name)
    with open(session_path, "r", encoding="utf-8") as f:
        session_data = json.load(f)

    # 2. 构建系统提示词
    system_prompt = SYSTEM_PROMPT_TEMPLATE % (request.nick_name, request.nature)

    # 3. 构建消息列表
    messages = [{"role": "system", "content": system_prompt}]
    for msg in session_data["messages"]:
        messages.append(msg)
    messages.append({"role": "user", "content": request.message})

    print(f"----> 请求的会话信息: {messages}")

    # 4. 调用DeepSeek API
    response = client.chat.completions.create(
        model="deepseek-v4-pro",
        messages=messages,
        stream=False
    )

    # 5. 获取响应的数据
    ai_response = response.choices[0].message.content
    print(f"<---- AI大模型响应的数据: {ai_response}")

    # 6. 更新消息列表中的消息
    messages.pop(0)
    messages.append({"role": "assistant", "content": ai_response})
    session_data["messages"] = messages

    session_data["nature"] = request.nature
    session_data["nick_name"] = request.nick_name

    print(f"更新后的会话信息: {session_data}")

    # 7. 保存会话信息到json文件中
    with open(session_path, "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 8. 返回数据
    return ApiResponse(code=200, message="请求成功", data=ai_response)

@app.get("/api/sessions")
def get_seesion_list():
    print("获取会话列表~")
    # 要获取所有的会话名，响应给前端做展示

    #定义个空的列表，用来存储满足要求的文件名
    result = []
    #获取指定目录下的所有文件名（带后缀）
    file_names = os.listdir(SESSION_DIR)
    #过滤掉，无关的文件
    for file_n in file_names:
        if file_n.endswith(".json"):
            result.append(file_n[:-5])

    return ApiResponse(code=200,message="会话列表查询成功",data=result)

# 启动服务
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

代码编写完毕后，我们就可以启动服务来做一个测试了。 我们可以直接打开浏览器，访问 AI智能伴侣 这个项目，然后在左侧的侧边栏，就可以看到历史会话列表了 。

![](./static/day10-Python-AI应用实战%28功能实现%29-cBFTBneb.png)

## 加载指定会话

### 分析

![](./static/day10-Python-AI应用实战%28功能实现%29-cOMGRnlb.png)

**接口文档如下：**

- **接口地址**: `/api/sessions/{session_name}`

- **请求方式**: `GET`

- **接口描述**: 获取指定会话的详细信息，包括聊天记录、伴侣设置等

- **请求参数**: 
> 内嵌电子表格（v1 不转换），token: OA2TsJBv2hFiiIt0tajcPYTcnfg_6RmYaV

- **请求示例**: `/api/sessions/2026-05-25_10-47-15`

- **响应参数**:
> 内嵌电子表格（v1 不转换），token: OA2TsJBv2hFiiIt0tajcPYTcnfg_mLHjKp

**响应示例**:

```json
{
    "code": 200,
    "message": "获取会话信息成功",
    "data": {
        "nick_name": "小甜甜",
        "nature": "活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心",
        "session_name": "2026-05-25_10-47-15",
        "messages": [
            {
                "role": "user",
                "content": "你好呀"
            },
            {
                "role": "assistant",
                "content": "嗨~你来啦！今天想聊点啥呀？🌸"
            }
        ]
    }
}
```

### 代码实现

根据接口文档，编写服务端接口。具体代码如下：

```python
import json
import os.path
from datetime import datetime
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from openai import OpenAI

# 创建FastAPI实例
app = FastAPI(title="AI智能伴侣", description="一款基于人工智能的情感陪伴应用", version="1.0.0")

# 会话数据目录
SESSIONS_DIR = "sessions"
# 常量
PRESETS_FILE_PATH = "data/companion_presets.json"
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

# 初始化OpenAI客户端
client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'),base_url="https://api.deepseek.com")

if not os.path.exists(SESSIONS_DIR):
    os.mkdir(SESSIONS_DIR)

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

class ChatRequest(BaseModel):
    session_name: str     #  会话名称
    message: str        #  用户消息
    nick_name: str      #  伴侣昵称
    nature: str         #  伴侣性格

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

    return ApiResponse(code=200, message="创建会话成功", data=session_name)

@app.post("/api/chat", summary="与AI交互", response_model=ApiResponse)
def chat(request: ChatRequest) -> ApiResponse:
    """与AI对话（非流式）"""
    print(f"与AI交互: {request.session_name} : {request.message}")

    # 1. 加载json文件中的会话数据
    session_path = get_session_path(request.session_name)
    with open(session_path, "r", encoding="utf-8") as f:
        session_data = json.load(f)

    # 2. 构建系统提示词
    system_prompt = SYSTEM_PROMPT_TEMPLATE % (request.nick_name, request.nature)

    # 3. 构建消息列表
    messages = [{"role": "system", "content": system_prompt}]
    for msg in session_data["messages"]:
        messages.append(msg)
    messages.append({"role": "user", "content": request.message})

    print(f"----> 请求的会话信息: {messages}")

    # 4. 调用DeepSeek API
    response = client.chat.completions.create(
        model="deepseek-v4-pro",
        messages=messages,
        stream=False
    )

    # 5. 获取响应的数据
    ai_response = response.choices[0].message.content
    print(f"<---- AI大模型响应的数据: {ai_response}")

    # 6. 更新消息列表中的消息
    messages.pop(0)
    messages.append({"role": "assistant", "content": ai_response})
    session_data["messages"] = messages

    session_data["nature"] = request.nature
    session_data["nick_name"] = request.nick_name

    print(f"更新后的会话信息: {session_data}")

    # 7. 保存会话信息到json文件中
    with open(session_path, "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 8. 返回数据
    return ApiResponse(code=200, message="请求成功", data=ai_response)

@app.get("/api/sessions", summary="获取会话列表", response_model=ApiResponse)
def list_sessions() -> ApiResponse:
    """获取所有会话列表（按时间降序）"""
    print("获取会话列表")
    session_list = []
    if os.path.exists(SESSIONS_DIR):
        for filename in os.listdir(SESSIONS_DIR):
            if filename.endswith(".json"):
                session_list.append(filename[:-5])
    session_list.sort(reverse=True)
    return ApiResponse(code=200, message="获取会话列表成功", data=session_list)

@app.get("/api/sessions/{session_name}")
def get_session_by_name(session_name: str):
    print("获取指定会话内容~")
    #获取到前端传来的会话名后，读取指定会话的会话内容
    #获取会话文件全路径
    session_path = get_session_path(session_name)
    #判断文件是否存在，如果存在，再读取，如果不存在就给前端响应一个错误的状态码
    if not os.path.exists(session_path):
        return ApiResponse(code=404,message="会话内容不存在")

    with open(session_path,"r",encoding="utf-8") as f:
        session_data = json.load(f)

    #将读取到的会话内容响应给前端，展示
    return ApiResponse(code=200,message="获取会话内容成功",data=session_data)

# 启动服务
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 删除会话

### 分析

在历史会话列表的右侧，每一个会话名称后面都有一个 x，点击之后，就可以删除当前的这个会话的历史数据了。

![](./static/day10-Python-AI应用实战%28功能实现%29-cqCDxnhf.png)

**接口信息如下：**

- **接口地址**: `/api/sessions/{session_name}`

- **请求方式**: `DELETE`

- **接口描述**: 删除指定的会话及其所有聊天记录

- **请求参数**:
> 内嵌电子表格（v1 不转换），token: OA2TsJBv2hFiiIt0tajcPYTcnfg_51merV

- **请求示例**: `DELETE /api/sessions/2026-05-25_10-47-15`

- **响应参数**:
> 内嵌电子表格（v1 不转换），token: OA2TsJBv2hFiiIt0tajcPYTcnfg_3DNwxH

- **响应示例**:
```python
{
    "code": 200,
    "message": "删除会话成功",
    "data": null
}
```

### 代码实现

具体代码实现如下:

```python
import json
import os.path
from datetime import datetime
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from openai import OpenAI

# 创建FastAPI实例
app = FastAPI(title="AI智能伴侣", version="1.0.0")

# 会话数据目录
SESSIONS_DIR = "sessions"
# 常量
PRESETS_FILE_PATH = "data/companion_presets.json"
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

# 初始化OpenAI客户端
client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'),base_url="https://api.deepseek.com")

if not os.path.exists(SESSIONS_DIR):
    os.mkdir(SESSIONS_DIR)

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

class ChatRequest(BaseModel):
    session_name: str     #  会话标识
    message: str        #  用户消息
    nick_name: str      #  伴侣昵称
    nature: str         #  伴侣性格

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

    return ApiResponse(code=200, message="创建会话成功", data=session_name)

@app.post("/api/chat", summary="与AI交互", response_model=ApiResponse)
def chat(request: ChatRequest) -> ApiResponse:
    """与AI对话（非流式）"""
    print(f"与AI交互: {request.session_name} : {request.message}")

    # 1. 加载json文件中的会话数据
    session_path = get_session_path(request.session_name)
    with open(session_path, "r", encoding="utf-8") as f:
        session_data = json.load(f)

    # 2. 构建系统提示词
    system_prompt = SYSTEM_PROMPT_TEMPLATE % (request.nick_name, request.nature)

    # 3. 构建消息列表
    messages = [{"role": "system", "content": system_prompt}]
    for msg in session_data["messages"]:
        messages.append(msg)
    messages.append({"role": "user", "content": request.message})

    print(f"----> 请求的会话信息: {messages}")

    # 4. 调用DeepSeek API
    response = client.chat.completions.create(
        model="deepseek-v4-pro",
        messages=messages,
        stream=False
    )

    # 5. 获取响应的数据
    ai_response = response.choices[0].message.content
    print(f"<---- AI大模型响应的数据: {ai_response}")

    # 6. 更新消息列表中的消息
    messages.pop(0)
    messages.append({"role": "assistant", "content": ai_response})
    session_data["messages"] = messages

    session_data["nature"] = request.nature
    session_data["nick_name"] = request.nick_name

    print(f"更新后的会话信息: {session_data}")

    # 7. 保存会话信息到json文件中
    with open(session_path, "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 8. 返回数据
    return ApiResponse(code=200, message="请求成功", data=ai_response)

@app.get("/api/sessions", summary="获取会话列表", response_model=ApiResponse)
def list_sessions() -> ApiResponse:
    """获取所有会话列表（按时间降序）"""
    print("获取会话列表")
    session_list = []
    if os.path.exists(SESSIONS_DIR):
        for filename in os.listdir(SESSIONS_DIR):
            if filename.endswith(".json"):
                session_list.append(filename[:-5])
    session_list.sort(reverse=True)
    return ApiResponse(code=200, message="获取会话列表成功", data=session_list)

@app.get("/api/sessions/{session_name}", summary="获取指定会话信息", response_model=ApiResponse)
def get_session_message(session_name: str) -> ApiResponse:
    """获取指定会话信息"""
    print(f"获取会话信息: {session_name}")
    session_path = get_session_path(session_name)
    if not os.path.exists(session_path):
        return ApiResponse(code=404, message="会话不存在")
    else:
        with open(session_path, "r", encoding="utf-8") as f:
            session_data = json.load(f)
        return ApiResponse(code=200, message="获取会话信息成功", data=session_data)

@app.delete("/api/sessions/{session_name}")
def delete_session(session_name: str):
    print("删除指定会话~")
    #根据会话名，查询到具体的会话文件
    session_path = get_session_path(session_name)
    #判断该会话是否存在，如果不存在，响应资源不存在的结果给前端
    if not os.path.exists(session_path):
        return ApiResponse(code=404,message="会话内容不存在")
    else:
        #如果存在，就删除
        #删除指定文件
        os.remove(session_path)
        #响应结果
        return ApiResponse(code=200,message="删除成功")

# 启动服务
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**完整代码：**

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

    #构建完整的历史信息,让大模型拥有会话记忆的功能
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

@app.get("/api/sessions")
def get_seesion_list():
    print("获取会话列表~")
    # 要获取所有的会话名，响应给前端做展示

    #定义个空的列表，用来存储满足要求的文件名
    result = []
    #获取指定目录下的所有文件名（带后缀）
    file_names = os.listdir(SESSION_DIR)
    #过滤掉，无关的文件
    for file_n in file_names:
        if file_n.endswith(".json"):
            result.append(file_n[:-5])

    #将文件名称反转，按照从近到远的顺序排列
    result.sort(reverse=True)
    return ApiResponse(code=200,message="会话列表查询成功",data=result)

@app.get("/api/sessions/{session_name}")
def get_session_by_name(session_name: str):
    print("获取指定会话内容~")
    #获取到前端传来的会话名后，读取指定会话的会话内容
    #获取会话文件全路径
    session_path = get_session_path(session_name)
    #判断文件是否存在，如果存在，再读取，如果不存在就给前端响应一个错误的状态码
    if not os.path.exists(session_path):
        return ApiResponse(code=404,message="会话内容不存在")

    with open(session_path,"r",encoding="utf-8") as f:
        session_data = json.load(f)

    #将读取到的会话内容响应给前端，展示
    return ApiResponse(code=200,message="获取会话内容成功",data=session_data)

@app.delete("/api/sessions/{session_name}")
def delete_session(session_name: str):
    print("删除指定会话~")
    #根据会话名，查询到具体的会话文件
    session_path = get_session_path(session_name)
    #判断该会话是否存在，如果不存在，响应资源不存在的结果给前端
    if not os.path.exists(session_path):
        return ApiResponse(code=404,message="会话内容不存在")
    else:
        #如果存在，就删除
        #删除指定文件
        os.remove(session_path)
        #响应结果
        return ApiResponse(code=200,message="删除成功")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=8000)
```

## 开发规范

前端在与服务端交互时，所有的接口都是遵循 Restful 接口开发规范的。

> [!tip] 🍀
> **Restful**指的是遵循REST架构风格的API接口服务，而REST（`REpresentational State Transfer`），表述性状态转换，它是一种软件架构风格。

**基于REST风格URL如下：**

- `http://localhost:8080/users/1`       GET

- `http://localhost:8080/users`          POST

- `http://localhost:8080/users`          PUT

- `http://localhost:8080/users/1`       DELETE

在REST风格的URL中，通过四种请求方式，来操作数据的增删改查。

- `GET` ：  查询

- `POST` ：新增

- `PUT` ：  修改

- `DELETE` ：删除

我们看到如果是基于REST风格，定义URL，URL将会**更加简洁、更加规范、更加优雅**。

> [!danger] 📌
> **注意事项：**
>
> - REST是风格，是约定方式，约定不是规定，可以打破
> - 描述模块的功能通常使用复数，也就是加s的格式来描述，表示此类资源，而非单个资源。如：users、emps、books…

## 日志记录

### 介绍

**具体的操作步骤分为如下三步：**

1). 导入 logging 模块

import logging

2). 配置 logging 的基础配置 （日志级别、日志格式）

logging.basicConfig(
     level=logging.INFO,
     format="%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s"
)

3). 记录日志

logging.info("访问首页~")

logging.error("msg")

```python
from fastapi import FastAPI
import logging

logging.basicConfig(
     level=logging.INFO,
     format="%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s"
)

# 创建FastAPI实例
app = FastAPI()

# 定义路径操作函数
@app.get("/")
def root():
    logging.info("访问首页~")
    return FileResponse("static/index.html")
```

> [!tip] 🍀
> **日志级别：**
>
> - 日志级别就是日志信息贴上的"重要性标签"，常见级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）。
> - 如果我们就想记录一些常规日志，使用INFO级别即可；如果要记录错误或异常日志，使用ERROR即可。

### 记录项目日志

接下来，我们就可以对我们之前记录日志的代码进行改造，改为基于 logging 模块来记录日志。改造后的代码为：

```python
import json
import os.path
from datetime import datetime
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from openai import OpenAI
import logging

# 创建FastAPI实例
app = FastAPI(title="AI智能伴侣", version="1.0.0")
# 挂载静态文件
app.mount("/static", StaticFiles(directory="static"), name="static")
# 会话数据目录
SESSIONS_DIR = "sessions"
# 常量
PRESETS_FILE_PATH = "data/companion_presets.json"
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

# 初始化OpenAI客户端
client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'),base_url="https://api.deepseek.com")
# 配置日志
logging.basicConfig(
    level=logging.INFO, # 只会输出当前日志级别及以上日志级别的日志
    format="%(asctime)s - %(levelname)s - [%(filename)s : %(lineno)d] - %(message)s"
)

if not os.path.exists(SESSIONS_DIR):
    os.mkdir(SESSIONS_DIR)

# ==================== 工具函数 ====================
def generate_session_name():
    """生成会话标识"""
    return datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

def get_session_path(session_name: str) -> str:
    """获取会话文件路径"""
    return os.path.join(SESSIONS_DIR, f"{session_name}.json")

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

class ChatRequest(BaseModel):
    session_name: str     #  会话标识
    message: str        #  用户消息
    nick_name: str      #  伴侣昵称
    nature: str         #  伴侣性格

@app.get("/")
async def root():
    # print("访问项目首页")
    logging.info("访问项目首页")
    return FileResponse("static/index.html")

@app.get("/api/presets", summary="获取预设伴侣信息列表", response_model=ApiResponse)
async def presets() -> ApiResponse:
    #print("获取预设列表")
    logging.info("获取预设列表")
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
    #print(f"创建会话: {request}")
    logging.info(f"创建会话: {request}")
    session_name = generate_session_name()
    session_data = {
        "nick_name": request.nick_name,
        "nature": request.nature,
        "session_name": session_name,
        "messages": []
    }
    with open(get_session_path(session_name), "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    return ApiResponse(code=200, message="创建会话成功", data=session_name)

@app.post("/api/chat", summary="与AI交互", response_model=ApiResponse)
def chat(request: ChatRequest) -> ApiResponse:
    """与AI对话（非流式）"""
    #print(f"与AI交互: {request.session_name} : {request.message}")
    logging.info(f"与AI交互: {request.session_name}:{request.message}")

    # 1. 加载json文件中的会话数据
    session_path = get_session_path(request.session_name)
    with open(session_path, "r", encoding="utf-8") as f:
        session_data = json.load(f)

    # 2. 构建系统提示词
    system_prompt = SYSTEM_PROMPT_TEMPLATE % (request.nick_name, request.nature)

    # 3. 构建消息列表
    messages = [{"role": "system", "content": system_prompt}]
    for msg in session_data["messages"]:
        messages.append(msg)
    messages.append({"role": "user", "content": request.message})

    # print(f"----> 请求的会话信息: {messages}")
    logging.info(f"----> 请求的会话信息: {messages}")

    # 4. 调用DeepSeek API
    response = client.chat.completions.create(
        model="deepseek-v4-pro",
        messages=messages,
        stream=False
    )

    # 5. 获取响应的数据
    ai_response = response.choices[0].message.content
    # print(f"<---- AI大模型响应的数据: {ai_response}")
    logging.info(f"<---- AI大模型响应的数据: {ai_response}")

    # 6. 更新消息列表中的消息
    messages.pop(0)
    messages.append({"role": "assistant", "content": ai_response})
    session_data["messages"] = messages

    session_data["nature"] = request.nature
    session_data["nick_name"] = request.nick_name

    # print(f"更新后的会话信息: {session_data}")
    logging.info(f"更新后的会话信息: {session_data}")

    # 7. 保存会话信息到json文件中
    with open(session_path, "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 8. 返回数据
    return ApiResponse(code=200, message="请求成功", data=ai_response)

@app.get("/api/sessions", summary="获取会话列表", response_model=ApiResponse)
def list_sessions() -> ApiResponse:
    """获取所有会话列表（按时间降序）"""
    # print("获取会话列表")
    logging.info("获取会话列表")
    session_list = []
    if os.path.exists(SESSIONS_DIR):
        for filename in os.listdir(SESSIONS_DIR):
            if filename.endswith(".json"):
                session_list.append(filename[:-5])
    session_list.sort(reverse=True)
    return ApiResponse(code=200, message="获取会话列表成功", data=session_list)

@app.get("/api/sessions/{session_name}", summary="获取指定会话信息", response_model=ApiResponse)
def get_session_message(session_name: str) -> ApiResponse:
    """获取指定会话信息"""
    # print(f"获取会话信息: {session_name}")
    logging.info(f"获取会话信息: {session_name}")
    session_path = get_session_path(session_name)
    if not os.path.exists(session_path):
        return ApiResponse(code=404, message="会话不存在")
    else:
        with open(session_path, "r", encoding="utf-8") as f:
            session_data = json.load(f)
        return ApiResponse(code=200, message="获取会话信息成功", data=session_data)

@app.delete("/api/sessions/{session_name}", summary="删除指定会话", response_model=ApiResponse)
def delete_session(session_name: str) -> ApiResponse:
    """删除指定会话"""
    #print(f"删除会话: {session_name}")
    logging.info(f"删除会话: {session_name}")
    session_path = get_session_path(session_name)
    if not os.path.exists(session_path):
        return ApiResponse(code=404, message="会话不存在")
    else:
        os.remove(session_path)
        return ApiResponse(code=200, message="删除会话成功")

# 启动服务
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**关闭日志：**

```python
# 配置日志
logging.basicConfig(
    level=logging.FATAL,
    format="%(asctime)s - %(levelname)s - [%(filename)s : %(lineno)d] - %(message)s"
)
```

**系统默认访问日志关闭：**

```python
# 启动服务
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, access_log= False) # access_log = False, 关闭访问日志
```

## 异常处理

### 自定义异常处理器

- 第一种：在所有的功能接口中，增加 `try... except ...` 来捕获异常，对异常进行进一步的处理。【不推荐、繁琐】

- 第二种：借助于FastAPI中的统一异常处理方案来处理异常。【推荐、一劳永逸】

![](./static/day10-Python-AI应用实战%28功能实现%29-cESEZnjB.png)

FastAPI中的全局异常处理器。

```python
from fastapi import Request
from fastapi.responses import JSONResponse

#定义一个自定义异常处理器
#作用：将接口中出现异常，统统可以被自定义的异常处理器捕获到，捕获到之后，可以在函数中，定义自己的处理方案
#     也可以按照前端需要的格式，响应数据
@app.exception_handler(Exception)
def handle_exception(request: Request, e: Exception):
    """
    全局异常处理器
    :param request:请求对象（包含请求中的各种参数，比如请求路径、请求方法、请求头、请求体等）
    :param e:捕获到的异常对象
    :return:响应给前端的数据
    """

    logging.error(f"处理异常, 请求路径: {request.url}, {request.method},异常信息: {e}")
    return JSONResponse(content={"code": 500, "message": "后端代码异常，请联系开发人员即时排查","data": None})
```

### Request对象说明

> [!tip] 🍀
> 这个 `request` 参数是 FastAPI 框架中 `Request` 类的实例对象，它代表了客户端发来的HTTP请求，所有的请求相关的信息，都可以从该对象中获取。 比如：
>
> - `request.url`：获取完整的请求的url地址。
> - `request.method`：HTTP方法（如 `GET`、`POST`）。
> - `request.headers`：请求头信息（如 `User-Agent`、`Authorization` 令牌）。
> - `request.client`：客户端IP地址和端口（`host` 和 `port`）。
> - `request.cookie`：获取Cookie信息。

---

---

**当前案例问题分析: **

![](./static/day10-Python-AI应用实战%28功能实现%29-cjnpknD8.png)

![](./static/day10-Python-AI应用实战%28功能实现%29-cSrANnkc.png)

- **并发冲突：**一个项目，是可能会多个人同时访问的，如果多个人同时操作同一份文件，就可能引发并发冲突问题。

- **查询统计性能低下：**如果我们要对文件中的数据，进行统计、查询、分析，就需要读取所有的文件内容，然后逐步进行分析，这个效率是非常低的。

- **数据维护困难：**如果我们要对数据进行增删改的操作，是比较繁琐的，数据难以维护。

- **数据不安全：**基于普通文件存储数据，文件的读写权限限制低下。

- **扩展受限：**如果要存储大量的数据，一台服务器的存储容量是有限的，如果要扩容，直接基于文件存储这种方案是比较繁琐的。

# MySQL

## 数据库概述

- **数据库：英文为 DataBase，简称DB，它是存储和管理数据的仓库。**

![](./static/day10-Python-AI应用实战%28功能实现%29-cyqd3nue.png)

- **数据库管理系统（DataBase Management System，简称DBMS），是操作和管理数据库的大型软件。**

![](./static/day10-Python-AI应用实战%28功能实现%29-corE9ntg.png)

- **SQL（Structured Query Language，简称SQL）：结构化查询语言，它是操作关系型数据库的编程语言，定义了一套操作关系型数据库的统一标准。**

![](./static/day10-Python-AI应用实战%28功能实现%29-cDwyTnMc.png)

我们学习数据库开发，最为重要的就是学习SQL语句 。

> [!tip] 📌
> 关系型数据库：我们后面会详细讲解，现在大家只需要知道我们学习的数据库属于关系型数据库即可。

**结论：**程序员给数据库管理系统(DBMS)发送SQL语句，再由数据库管理系统操作数据库当中的数据。

**十大主流数据库:**

![](./static/day10-Python-AI应用实战%28功能实现%29-cuUddnOh.png)

> [!tip] 提示
> - Oracle：大型的收费数据库，Oracle公司产品，价格昂贵。
>
> （通常是不差钱的公司会选择使用这个数据库）
>
> - MySQL：开源免费的中小型数据库，后来Sun公司收购了MySQL，而Oracle又收购了Sun公司。
>
>            商业版本，社区版
>
> - SQL Server：Microsoft 公司推出的收费的中型数据库，C#、.net等语言常用。
> - PostgreSQL：开源免费的中小型数据库（占用率持续升高，现在的很多大模型库中，都支持该数据库）
> - DB2：IBM公司的大型收费数据库产品。
> - SQLLite：嵌入式的微型数据库。Android内置的数据库采用的就是该数据库。
> - MariaDB：开源免费的中小型数据库。是MySQL数据库的另外一个分支、另外一个衍生产品，与MySQL数据库有很好的兼容性。

## 安装

![](./static/day10-Python-AI应用实战%28功能实现%29-cFEz0nz5.png)

官网：https://dev.mysql.com/

**MySQL官方提供了两个版本：**

- 商业版本（MySQL Enterprise Edition）
  - 该版本是收费的，我们可以使用30天。 官方会提供对应的技术支持。

- 社区版本（MySQL Community Server）
  - 该版本是免费的，但是MySQL不会提供任何的技术支持。

> [!tip] 提示
> 本课程，采用的是MySQL的社区版本（8.0.34）。

MySQL的安装包官网下载地址：https://dev.mysql.com/downloads/mysql/

![](./static/day10-Python-AI应用实战%28功能实现%29-cT6jhnJc.png)

安装MySQL具体的步骤，参考文档[Mysql安装文档](https://wcn4b8bw7lqr.feishu.cn/wiki/PEtUw1yDfiHEJxkFPkkc2JV0nac) ，进行软件的安装即可。

## 数据模型

### **关系型数据库（RDBMS）**

概念：建立在关系模型基础上，由多张相互连接的**二维表**组成的数据库。而所谓二维表，指的是由行和列组成的表，如下图：

![](./static/day10-Python-AI应用实战%28功能实现%29-cMj5Anud.png)

二维表的优点：

- 使用表存储数据，格式统一，便于维护

- 使用SQL语言操作，标准统一，使用方便，可用于复杂查询

> [!tip] 提示
> 我们之前提到的MySQL、Oracle、DB2、SQLServer这些都是属于关系型数据库，里面都是基于二维表存储数据的。
>
> **结论：**基于二维表存储数据的数据库就成为关系型数据库，不是基于二维表存储数据的数据库，就是非关系型数据库（比如大家后面要学习的Redis，就属于非关系型数据库）。

### 数据模型

![](./static/day10-Python-AI应用实战%28功能实现%29-chBpznGQ.png)

- 通过MySQL客户端连接数据库管理系统DBMS，然后通过DBMS操作数据库。

- 使用MySQL客户端，向数据库管理系统发送一条SQL语句，由数据库管理系统根据SQL语句指令去操作数据库中的表结构及数据。

- 一个数据库服务器中可以创建多个数据库，一个数据库中也可以包含多张表，而一张表中又可以包含多行记录。

> [!tip] 提示
> 在Mysql数据库服务器当中存储数据，你需要：
>
> 1. 先去创建数据库（可以创建多个数据库，之间是相互独立的）
> 2. 在数据库下再去创建数据表（一个数据库下可以创建多张表）
> 3. 再将数据存放在数据表中（一张表可以存储多行数据）

## SQL语句

SQL：结构化查询语言。一门操作关系型数据库的编程语言，定义操作所有关系型数据库的统一标准。SQL语句根据其功能被分为四大类：DDL、DML、DQL、DCL 。

> 内嵌电子表格（v1 不转换），token: OA2TsJBv2hFiiIt0tajcPYTcnfg_JUfGCt

### DDL语句

#### 数据库操作

DDL英文全称是Data Definition Language(数据定义语言)，用来定义数据库对象(数据库、表)。

DDL中数据库的常见操作：查询、创建、使用、删除。

##### 查询数据库

- 查询所有数据库

```sql
show databases;
```

- 查询当前数据库

```sql
select database();

使用某一个数据库
use 数据库名;
```

> [!tip] 提示
> 我们要操作某一个数据库，必须要切换到对应的数据库中。 
>
> 通过指令：`select  database()` ，就可以查询到当前所处的数据库

##### 创建数据库

- 语法：

```sql
create database [ if not exists ] 数据库名  [default charset utf8mb4];

create database 数据库名;
```

创建数据库时，可以不指定字符集。 因为在MySQL8版本之后，默认的字符集就是 utf8mb4。

- 案例： 创建一个itcast数据库。

```sql
create database itcast;
```

注意：在同一个数据库服务器中，不能创建两个名称相同的数据库，否则将会报错。

可以使用`if not exists`来避免这个问题

```sql
-- 数据库不存在,则创建该数据库；如果存在则不创建
create database if not exists itcast; 
```

##### 使用数据库

- 语法：

```sql
use 数据库名;
```

- 案例：切换到itcast数据

```sql
use itcast;
```

##### 删除数据库

- 语法:
```sql
drop database [ if exists ] 数据库名 ;
```

  - 如果删除一个不存在的数据库，将会报错。
  - 可以加上参数 if exists ，如果数据库存在，再执行删除，否则不执行删除。

- 案例：删除itcast数据库
```sql
drop database if exists itcast; -- itcast数据库存在时删除
```

> [!tip] 提示
> **说明：上述语法中的database，也可以替换成 schema**
>
> - 如：create schema db01;
> - 如：show schemas;

#### 图形化工具

##### 介绍

在项目开发当中，通常为了提高开发效率，都会借助于现成的图形化管理工具来操作数据库。

目前MySQL主流的图形化界面工具有以下几种：

![](./static/day10-Python-AI应用实战%28功能实现%29-c0BuNnLh.png)

DataGrip是JetBrains旗下的一款数据库管理工具，是管理和开发MySQL、Oracle、PostgreSQL的理想解决方案。

##### 连接数据库

**1). 创建连接**

添加数据源，选择数据库类型为 MySQL。

![](./static/day10-Python-AI应用实战%28功能实现%29-ctAyDnKd.png)

下载驱动，并输入MySQL数据库的连接信息：包括IP地址、端口号（默认3306）、用户名、密码。

![](./static/day10-Python-AI应用实战%28功能实现%29-cD7C1n2b.png)

点击下载之后，就可以联网下载驱动，根据网络情况，可以耐心等待一会儿。**【记得联网】**

![](./static/day10-Python-AI应用实战%28功能实现%29-cjNl7njd.png)

**2). 测试连接**

下载完驱动之后，可以点击 `测试连接` 来测试一下是否可以正常的连接数据库。

![](./static/day10-Python-AI应用实战%28功能实现%29-c2zB1nWe.png)

然后点击 确定， 就已经连接上了MySQL数据库了。

**展示所有数据库**

![](./static/day10-Python-AI应用实战%28功能实现%29-cT7Jkn0f.png)

**注意: MySQL数据库安装完成后自带的数据库【不要删除】。**

![](./static/day10-Python-AI应用实战%28功能实现%29-ckjatn0d.png)

#### 表操作

关于表结构的操作也是包含四个部分：创建表、查询表、修改表、删除表。

##### 创建

- 语法：
```sql
create table  表名(
        字段1  字段1类型 [约束]  [comment  字段1注释 ],
        字段2  字段2类型 [约束]  [comment  字段2注释 ],
        ......
        字段n  字段n类型 [约束]  [comment  字段n注释 ] 
) [ comment  表注释 ] ;
```

  - 注意： [ ] 中的内容为可选参数； 最后一个字段后面没有逗号

- 案例：创建tb_user表
  - 对应的结构如下：

![](./static/day10-Python-AI应用实战%28功能实现%29-cHTdHnde.png)

  - 建表语句：

```sql
create table tb_user (
    id int comment 'ID,唯一标识',  
    username varchar(20) comment '用户名',
    name varchar(10) comment '姓名',
    age int comment '年龄',
    gender char(1) comment '性别'
) comment '用户表';
```

  双击打开tb_user表结构，大家会发现里面没有数据：

![](./static/day10-Python-AI应用实战%28功能实现%29-cbAG7nyh.png)

> [!tip] 📌
> 想要限制字段所存储的数据，就需要用到数据库中的约束。

##### 约束

- 概念：所谓约束就是作用在表中字段上的规则，用于限制存储在表中的数据。

- 作用：就是来保证数据库当中数据的正确性、有效性和完整性。（后面的学习会验证这些）

- 在MySQL数据库当中，提供了以下5种约束：

> 内嵌电子表格（v1 不转换），token: OA2TsJBv2hFiiIt0tajcPYTcnfg_jomB4a

> [!danger] 📌
> 注意：约束是作用于表中字段上的，可以在创建表/修改表的时候添加约束。

- 案例：创建tb_user表，对应的结构如下：

![](./static/day10-Python-AI应用实战%28功能实现%29-cByrjnr8.png)

在上述的表结构中:

建表语句：

```sql
create table tb_user (
    id int primary key comment 'ID,唯一标识', 
    username varchar(20) unique comment '用户名',
    name varchar(10) not null comment '姓名',
    age int comment '年龄',
    gender char(1) default '男' comment '性别'
) comment '用户表';
```

![](./static/day10-Python-AI应用实战%28功能实现%29-cDPaWnZd.png)

![](./static/day10-Python-AI应用实战%28功能实现%29-cPKlBnmK.png)

**关键字：auto_increment（自动增长）**

> [!tip] 📌
> **主键自增：auto_increment**
>
> - 每次插入新的行记录时，数据库自动生成id字段(主键)下的值
> - 具有auto_increment的数据列是一个正数序列开始增长(从1开始自增)

```sql
create table tb_user (
    id int primary key auto_increment comment 'ID,唯一标识', #主键自动增长
    username varchar(20) not null unique comment '用户名',
    name varchar(10) not null comment '姓名',
    age int comment '年龄',
    gender char(1) default '男' comment '性别'
) comment '用户表';
```

测试主键自增：

![](./static/day10-Python-AI应用实战%28功能实现%29-c7hoVnOb.gif)