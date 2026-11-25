---
title: "day13. Python-AI应用实战(重构优化)"
node_token: JIoLw0couiOS8rkW86dcgnxFnxv
obj_token: Dc8gdQFqvo5UZvxxkXqcySAZnqg
obj_type: docx
space_id: ""
url: https://ocn0tgqr5oz2.feishu.cn/wiki/JIoLw0couiOS8rkW86dcgnxFnxv
edited_at: "1794726044"
exported_at: "2026-11-24T12:36:43.387Z"
cover: false
date: 2026-11-24
---
# 操作优化

## 问题分析

我们已经完成了各个接口的优化，接下来，我们再回过头来看一下，我们刚才编写的代码。 核心就是三步操作：

- 获取session

- 执行业务操作 ：加载预设伴侣信息列表/获取会话列表...

- 关闭session

![](./static/day13-Python-AI应用实战%28重构优化%29-c6ecknGe.png)

## 解决方案Depends

那这里，其实我们可以通过FastAPI中提供的依赖注入 `Depends` 来解决这个问题。

> [!tip] 提示
> **Depends 是 FastAPI 的依赖注入（Dependency Injection） 机制，用于在路由处理函数执行前自动获取所需的资源或执行初始化逻辑，实现"声明式依赖"。**
>
> **简单说：你只需要声明"我需要什么"，FastAPI 负责"怎么拿"。**

**具体操作分为两步：**

1). 定义一个函数，负责管理session 【可以将该函数定义在 `db.py` 模块中】

```python
#每一个接口中都需要创建会话,关闭会话,所以定义函数,将创建和关闭的操作抽取起来
async def manage_session():
    # 获取会话
    session = session_factory()
    try:
        #将会话返回给调用者,也可以暂定该函数,让接口的逻辑处理完成后,再回来执行后续的代码
        yield session

    except Exception:
        await session.rollback()   #业务执行的过程中，如果出现了异常，捕获异常，让事务回滚
        raise  #捕获到异常之后，又将该异常抛出，触发异常处理器中的内容处理异常
    finally:
        # 关闭会话
        await session.close()
```

2). 在业务接口中，基于Depends注入资源

```python
@app.get("/api/presets",summary="伴侣预设信息预览")
async def load_presets(session: AsyncSession = Depends(get_session))->ApiResponse:
    
    #执行查询操作->查询ai_preset表中所有数据，根据sort_order排序升序
    result = await session.execute(select(AiPreset).order_by(AiPreset.sort_order.asc()))
    presets_list = jsonable_encoder(result.scalars().all())

    return ApiResponse(code=200,message="伴侣预设模板文件加载成功~!",data=presets_list)
```

**执行流程：**

1. 请求到达 `/api/presets`

2. FastAPI 看到 `session: AsyncSession = Depends(get_session)`，先调用 `get_session()` 函数

3. `get_session()` 返回一个数据库 `AsyncSession` 对象

4. FastAPI 把这个对象注入到 `session` 参数中

5. 路由函数才真正开始执行

6. 执行完毕后，最后再执行`get_session()`中的finally中的关闭session

> [!tip] 🍀
> **Depends = "我需要这个，先帮我准备好"。它把"获取资源"和"使用资源"分离，让路由函数专注于业务逻辑，框架负责资源（DB 连接、鉴权、日志等）的自动装配。**

## 生成器yield

- 生成器（Generator） 是一种特殊的迭代器（yield），它不会一次性生成所有数据，而是记住当前执行位置，每次请求时才计算下一个值。

**yield 生成器的核心机制：**`yield` 就像函数的"暂停按钮"

| **关键字** | **行为** | **函数状态** |
| --- | --- | --- |
| `return` | 返回值，函数结束，所有局部变量销毁 | 死亡 |
| `yield` | 返回值，函数暂停，保留所有局部变量和当前执行位置 | 挂起 |

由于 `session.close()` 是写在`finally`代码块中的，也就意味着，无论程序运行是否报错， `session.close()` 代码一定可以执行到，资源可以正常关闭。

![](./static/day13-Python-AI应用实战%28重构优化%29-chrTQnYe.png)

> [!tip] 提示
>  "yield 是函数的'暂停键'。return 是'关门走人'，yield 是'把东西递出去，人还留在屋里'。"

# 项目重构优化

## 代码现状

`db.py` 存放SQLALchemy数据库操作的基础信息、与数据库表映射的模型信息，代码如下：

```python
from datetime import datetime
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

# 1. 创建引擎(支持异步操作)
engine = create_async_engine("mysql+aiomysql://root:1234@localhost:3306/ai_partner_db?charset=utf8mb4", echo=True)

# 2. 声明模型类
class Base(DeclarativeBase):
    pass

class AiPreset(Base):
    """伴侣预设表"""
    __tablename__ = "ai_preset"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment="主键")
    name: Mapped[str] = mapped_column(String(50), nullable=False, comment="预设名称")
    nick_name: Mapped[str] = mapped_column(String(50), nullable=False, comment="伴侣昵称")
    nature: Mapped[str] = mapped_column(String(500), nullable=False, comment="伴侣性格描述")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, comment="排序顺序")
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="创建时间")

    def __repr__(self):
        return f"AiPreset(id={self.id}, name={self.name}, nick_name={self.nick_name}, nature={self.nature}, sort_order={self.sort_order}, create_time={self.create_time})"

class AiSession(Base):
    """会话表"""
    __tablename__ = "ai_session"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment="主键")
    session_name: Mapped[str]= mapped_column(String(50), unique=True, nullable=False, comment="会话名称")
    nick_name: Mapped[str] = mapped_column(String(50), nullable=False, default="小甜甜", comment="伴侣昵称")
    nature: Mapped[str] = mapped_column(String(500), nullable=False, default="活泼开朗的东北姑娘", comment="伴侣性格")
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="更新时间")

    def __repr__(self):
        return f"AiSession(id={self.id}, session_id={self.session_name}, nick_name={self.nick_name}, nature={self.nature}, create_time={self.create_time}, update_time={self.update_time})"

class AiMessage(Base):
    """消息表"""
    __tablename__ = "ai_message"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment="主键")
    session_id: Mapped[int] = mapped_column(Integer, nullable=False, comment="会话ID")
    role: Mapped[str] = mapped_column(String(20), nullable=False, comment="消息角色：user-用户，assistant-AI")
    content: Mapped[str] = mapped_column(String(500), nullable=False, comment="消息内容")
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="创建时间")

    def __repr__(self):
        return f"AiMessage(id={self.id}, session_id={self.session_id}, role={self.role}, content={self.content}, create_time={self.create_time})"

# 3. 会话工厂(支持异步操作)
session_factory = async_sessionmaker(engine)

# 4. 获取会话对象session
async def get_session():
    session = session_factory()
    try:
        yield session  #暂停函数,返回session
    except Exception as e:
        await session.rollback()
        raise
    finally:
        await session.close()
```

`main.py` 里面存放的是FastAPI开发的核心业务功能，包括：FastAPI实例创建、日志配置、Pydantic模型、与AI大模型交互的系统提示词、客户端、工具函数、API接口、启动项目的代码等。

```python
import os.path
from datetime import datetime
from typing import Any
from fastapi import FastAPI, Request, Depends
from fastapi.encoders import jsonable_encoder
from openai import OpenAI
from pydantic import BaseModel
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import FileResponse, JSONResponse
from starlette.staticfiles import StaticFiles
import logging  # 日志记录
from db import session_factory, AiSession, AiPreset, AiMessage, get_session

#常见级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）
logging.basicConfig(
    level=logging.INFO,     # 日志级别 记录的是当前级别及以上级别的日志
    format="%(asctime)s -  %(levelname)s - 【 %(filename)s : %(lineno)d 】 - %(message)s"   # 日志输出的格式
)
logging.getLogger("sqlalchemy.engine").propagate=False

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣",description="AI智能伴侣演示的案例",version="V1.0")

# ------------------------Pydantic模型定义---------------------------------
# 统一响应的结果-封装
class ApiResponse(BaseModel):
    code:int =200  #状态码
    message:str ="操作成功"   #提示信息
    data:Any =None  #返回数据
#封装创建对话的数据信息
class CreateSessionModel(BaseModel):
    nick_name:str
    nature: str
#会话响应信息
class ChatRequestModel(BaseModel):
    session_name:str #会话名称
    message:str      #用户信息
    nick_name:str   #昵称
    nature:str    #性格

#------------------------------------------------------------------------
#声明会话名称
def generate_session_name():
    return datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

#-------------------------------------------------------------------------
# 创建OpenAI客户端
client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")
# 系统提示词
SYSTEM_PROMPT = """
    你叫 %s，现在是用户的真实伴侣，请完全代入伴侣角色。
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

#3.加载伴侣预设信息列表---------------------->FastAPI的依赖 注入Depends
@app.get("/api/presets",summary="伴侣预设信息预览")
async def load_presets()->ApiResponse:
    logging.info("获取伴侣预设信息列表")
    # 获取session
    session = session_factory()

    # 执行查询操作->查询ai_preset表中所有数据，根据sort_order排序升序
    result = await session.execute(select(AiPreset).order_by(AiPreset.sort_order.asc()))
    presets_list=jsonable_encoder(result.scalars().all())

    # 释放资源
    await session.close()

    return ApiResponse(code=200,message="伴侣预设模板文件加载成功~!",data=presets_list)

@app.get("/api/presets",summary="伴侣预设信息预览")
async def load_presets(session: AsyncSession = Depends(get_session))->ApiResponse:

    #执行查询操作->查询ai_preset表中所有数据，根据sort_order排序升序
    result = await session.execute(select(AiPreset).order_by(AiPreset.sort_order.asc()))
    presets_list=jsonable_encoder(result.scalars().all())

    return ApiResponse(code=200,message="伴侣预设模板文件加载成功~!",data=presets_list)

#4.创建会话>会话名称------>将该会话的数据信息，保存到文件中；
@app.post("/api/sessions",summary="创建会话")
async def create_session(request: CreateSessionModel, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"创建会话,{request.nick_name}:{request.nature}")

    # 1.生成会话名称--->2026-06-23_14-50-09
    session_name=generate_session_name()
    ai_session = AiSession(session_name=session_name,nick_name=request.nick_name,nature=request.nature,create_time=datetime.now(),update_time=datetime.now())
    session.add(ai_session)
    await session.commit()  # 提交数据

    #3.返回
    return ApiResponse(code=200,message="创建会话成功",data=session_name)

#5.与AI大模型交互
@app.post("/api/chat",summary="与AI大模型交互",response_model=ApiResponse)
async def chat(request:ChatRequestModel,session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"与AI大模型交互,{request.session_name}-{request.message}-{request.nick_name}-{request.nature}")

    # 1. 加载会话数据
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == request.session_name))
    ai_session = session_result.scalars().one()

    msg_result = await session.execute(select(AiMessage).where(AiMessage.session_id == ai_session.id))
    ai_messages = msg_result.scalars().all()

    session_data=[{"role":i.role,"content":i.content}for i in ai_messages]

    #组装系统提示词
    system_prompt=SYSTEM_PROMPT % (request.nick_name,request.nature)

    #构建与AI交互的消息列表
    messages=[ {"role":"system","content":system_prompt}]    ##系统提示词
    for msg in session_data: #历史会话信息
        messages.append(msg)
    messages.append({"role":"user","content":request.message}) #用户最新消息

    logging.info(f"------------->请求的会话信息:{messages}")
    #调用deekseek
    response=client.chat.completions.create(
        model="deepseek-v4-pro",
        messages = messages,
        stream = False,
        reasoning_effort = "high",
        extra_body = {"thinking": {"type": "disabled"}}
    )
   #获取响应数据
    ai_response_data=response.choices[0].message.content  #ai的回复

    #插入两条信息 user和assistant
    session.add(AiMessage(session_id=ai_session.id,role="user",content=request.message, create_time=datetime.now()))        # type:ignore
    session.add(AiMessage(session_id=ai_session.id,role="assistant",content=ai_response_data, create_time=datetime.now()))  # type:ignore

    # 更新性格,昵称
    ai_session.nature = request.nature
    ai_session.nick_name = request.nick_name

    # 提交数据
    await session.commit()

    #响应数据到前端
    return ApiResponse(code=200,message="操作成功",data=ai_response_data)

#6.加载历史会话列表
@app.get("/api/sessions",summary="加载历史会话列表")
async def load_sessions(session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info("加载历史会话列表")

    session_result = await session.execute(select(AiSession.session_name).order_by(AiSession.session_name.desc()))
    session_list = session_result.scalars().all()   # scalars 获取的就是第一列的数据

    return ApiResponse(code=200,message="加载历史会话列表成功",data=session_list)

#7.加载指定会话数据  --->/api/sessions/2026-06-24_08-52-27，/api/sessions/2026-06-24_08-56-09--->路径参数
@app.get("/api/sessions/{session_name}")
async def load_session(session_name: str, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"加载指定会话数据:{session_name}")
    #获取会话基本数据
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == session_name))
    ai_session = session_result.scalars().one()

    #获取会话信息
    msg_result = await session.execute(select(AiMessage).where(AiMessage.session_id == ai_session.id))
    ai_messages = msg_result.scalars().all()

    #3.组装数据
    session_data={
        "nick_name":ai_session.nick_name,
        "nature":ai_session.nature,
        "session_name":ai_session.session_name,
        "messages":[{"role":i.role,"content":i.content} for i in ai_messages]
    }
    return ApiResponse(code=200,message="加载指定会话数据成功",data=session_data)

#8.删除指定会话数据
@app.delete("/api/sessions/{session_name}")
async def delete_session(session_name: str, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"删除指定会话数据:{session_name}")
    #查询基本信息 拿到id
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == session_name))
    ai_session = session_result.scalars().one()

    #删除该条对应的会话信息
    await session.execute(delete(AiMessage).where(AiMessage.session_id == ai_session.id))

    #删除基本信息
    await session.execute(delete(AiSession).where(AiSession.id == ai_session.id))

    # 提交事务
    await session.commit()

    return ApiResponse(code=200,message="删除指定会话数据成功",data=None)

# 统一处理异常信息
@app.exception_handler(Exception)
def handle_exception(request: Request, exc: Exception):
    logging.error(f"处理异常, 请求路径: {request.url}, 异常信息: {exc}")
    return JSONResponse(content={"code": 500, "message": "服务器内部错误"})

# 启动服务
if __name__ =='__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 
```

**问题：**

1、可读性差

2、职责混乱

3、协作冲突

**解决：**
**       答案：在项目设计阶段，将项目拆分为多个模块，每一个模块都有自己的职责和作用。**

## 优化思路

将案例中的代码，包含 `SQLALchemy数据库操作的基础信息`、`与数据库表映射的模型`、 `FastAPI实例创建`、`日志配置`、`Pydantic模型`、`与AI大模型交互的系统提示词、客户端`、`工具函数`、`API接口`、`启动项目的代码`等，按照其作用和职责，将其进行拆分。

**拆分方式：**
      1、拆分模块（平铺多个模块）

2、拆分包（对多个模块归类）

### 方式一：拆分模块

拆分模块 指的就是将一个大的py文件，按照其功能职责拆分为若干个py文件，每一个py文件都有自己的职责和作用，类似于下面这样。

```python
ai_partner/
  ├── config.py          # 与AI交互配置信息   
  ├── database.py        # SQLALchemy链接数据库信息
  ├── models.py          # 模型
  ├── route.py           # API接口
  └── main.py            # 程序运行的入口
```

这种拆分方式，看似简单，但是存在问题：**模块膨胀，难以维护的问题 。**以 models.py 为例，目前只有3个模型还好，但将来可能扩展为几十个模型，一旦模型超过5-6个，单个文件就会变得难以维护。

### 方式二：拆分包

包，其实本质就是一个文件夹，通过这个文件夹来对多个python模块进行归类管理，从而使代码的可维护性更强。 如果我们想增加程序的扩展性及可维护性，那么之前的案例，可以可以将其拆分为多个包。示意如下：

```python
ai_partner/
  ├── app
  |    ├── ai                     # 该包存放模型相关代码
  |        ├── __init__.py           
  |        └── config.py          #该包存放模型配置代码  
  |    
  |    ├── db                     # 该包存放数据库操作的代码
  |        ├── __init__.py           
  |        ├── database.py        # SQLALchemy链接数据库信息
  |        └── models.py          # 定义ORM模型 
  
  |    ├── routers                # 该包存放各个业务模块的API接口(路由)
  |        ├── __init__.py           
  |        ├── presets.py         # 预设列表相关接口
  |        ├── sessions.py        # 会话相关接口
  |        └── chat.py            # AI交互相关接口
  
  |    ├── schemas                # 该包存放各个业务模型对应的Pydantic模型
  |        ├── __init__.py        
  |        └── schemas.py         # 定义Pydantic模型 
  
  └── main.py                     # 程序运行的入口
```

> [!tip] 🍀
> 而在每个包中，都有一个文件 `__init__.py`，这个文件是用来标记这个包目录，并来描述包的信息的（在该文件中，我们可以定义对外暴露的功能，从而可以在将来使用的时候简化导入； 也可以控制在外部进行 `import *` 的行为）。

**那上述的两种拆分方式，在企业开发中都有用的，两者也并不是互斥的，不同的方式适用于不同的应用场景。 简单说：平铺模块适合"一次性脚本"，包结构适合"持续演进的项目"。（实际项目中往往先按方式一拆，发现还不够用，再升级到方式二）**

## 代码实现

### **SQLALchemy配置代码重构**

1). 创建一个目录 app，该目录用于存放项目中的 包 以及 python模块。

2). 在 app 目录下再创建一个包 db（包下需要新建 __init__.py 文件哦），该目录用于存放SQLALchemy的配置信息（包括SQLALchemy的基本配置，与数据表映射的模型）。

![](./static/day13-Python-AI应用实战%28重构优化%29-cnmkfnjg.png)

3). 在db包下，创建一个python模块命名为 `database.py` ，该模块仅存放SQLALchemy的基本配置。

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# 1. 创建引擎(支持异步操作)
engine = create_async_engine("mysql+aiomysql://root:1234@localhost:3306/ai_partner_db?charset=utf8mb4", echo=True)

# 2. 会话工厂(支持异步操作)
session_factory = async_sessionmaker(engine)

# 3. 获取会话对象session
async def get_session():
    session = session_factory()
    try:
        yield session  #暂停函数,返回session
    except Exception as e:
        await session.rollback()
        raise
    finally:
        await session.close()
```

4). 在db包下，再创建一个python模块命名为 `models.py` ，该模块仅存放与数据表映射的模型。

```python
from datetime import datetime
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

#  声明模型类(父类)
class Base(DeclarativeBase):
    pass

class AiPreset(Base):
    """伴侣预设表"""
    __tablename__ = "ai_preset"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment="主键")
    name: Mapped[str] = mapped_column(String(50), nullable=False, comment="预设名称")
    nick_name: Mapped[str] = mapped_column(String(50), nullable=False, comment="伴侣昵称")
    nature: Mapped[str] = mapped_column(String(500), nullable=False, comment="伴侣性格描述")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, comment="排序顺序")
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="创建时间")

    def __repr__(self):
        return f"AiPreset(id={self.id}, name={self.name}, nick_name={self.nick_name}, nature={self.nature}, sort_order={self.sort_order}, create_time={self.create_time})"

class AiSession(Base):
    """会话表"""
    __tablename__ = "ai_session"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment="主键")
    session_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, comment="会话名称")
    nick_name: Mapped[str] = mapped_column(String(50), nullable=False, default="小甜甜", comment="伴侣昵称")
    nature: Mapped[str] = mapped_column(String(500), nullable=False, default="活泼开朗的东北姑娘", comment="伴侣性格")
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="更新时间")

    def __repr__(self):
        return f"AiSession(id={self.id}, session_id={self.session_name}, nick_name={self.nick_name}, nature={self.nature}, create_time={self.create_time}, update_time={self.update_time})"

class AiMessage(Base):
    """消息表"""
    __tablename__ = "ai_message"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment="主键")
    session_id: Mapped[int] = mapped_column(Integer, nullable=False, comment="会话ID")
    role: Mapped[str] = mapped_column(String(20), nullable=False, comment="消息角色：user-用户，assistant-AI")
    content: Mapped[str] = mapped_column(String(500), nullable=False, comment="消息内容")
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False, comment="创建时间")

    def __repr__(self):
        return f"AiMessage(id={self.id}, session_id={self.session_id}, role={self.role}, content={self.content}, create_time={self.create_time})"
```

5). 最后，需要在该包的描述文件 `__init__.py`中，定义该包对外暴露的功能（以简化外部导入），以及控制 `import *` 的导入行为

```python
# 定义对外暴露的功能
from .database import Base, get_session
from .models import AiPreset, AiSession, AiMessage

# 控制 import * 的导入行为
__all__ = ["Base", "get_session", "AiPreset", "AiSession", "AiMessage"]
```

> [!tip] 🍀
> `from .database import Base, get_session`
>
>
> 这里的 .database，表示是从当前目录下的database.py模块中导入，. 表示的是当前目录。

6). 模块改造完毕后，记得需要调整原来的 `main.py` 中 import导入的代码，调整为 从 `app.db` 包中导入对应的函数以及类。

```python
import os.path
from datetime import datetime
from typing import Any
from fastapi import FastAPI, Request, Depends
from fastapi.encoders import jsonable_encoder
from openai import OpenAI
from pydantic import BaseModel
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import FileResponse, JSONResponse
from starlette.staticfiles import StaticFiles
import logging  # 日志记录

# from db import session_factory, AiSession, AiPreset, AiMessage, get_session
from app.db import get_session, AiPreset, AiSession, AiMessage

#常见级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）
logging.basicConfig(
    level=logging.INFO,     # 日志级别 记录的是当前级别及以上级别的日志
    format="%(asctime)s -  %(levelname)s - 【 %(filename)s : %(lineno)d 】 - %(message)s"   # 日志输出的格式
)
# 禁用sqlalchemy的日志
logging.getLogger("sqlalchemy.engine").propagate=False

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣",description="AI智能伴侣演示的案例",version="V1.0")
#挂载HTML、CSS、JS这些静态文件的存放目录
app.mount("/static",StaticFiles(directory="static"),name="name")
```

### FastAPI中Pydantic模型抽取重构

1). 在 app 目录下再创建一个包 schemas（包下需要新建 `__init__.py` 文件哦），该目录用于存放 FastAPI中定义的Pydantic模型。

![](./static/day13-Python-AI应用实战%28重构优化%29-cWtXtnkf.png)

2). 在 schemas 包下，创建一个python模块命名为 `schemas.py` ，该模块仅存放FastAPI中定义的Pydantic模型（将之前在main.py中定义的FastAPI的Pydantic模型提取到该模块中）。

```python
from typing import Any
from pydantic import BaseModel

# ------------------------Pydantic模型定义---------------------------------
# 统一响应的结果-封装
class ApiResponse(BaseModel):
    code:int =200           # 状态码
    message:str ="操作成功"   # 提示信息
    data:Any =None          # 返回数据

#封装创建对话的数据信息
class CreateSessionModel(BaseModel):
    nick_name:str
    nature: str

#会话响应信息
class ChatRequestModel(BaseModel):
    session_name:str    # 会话名称
    message:str         # 用户信息
    nick_name:str       # 昵称
    nature:str          # 性格
```

3). 最后，需要在该包的描述文件 `__init__.py`中，定义该包对外暴露的功能（以简化外部导入），以及控制 `import *` 的导入行为

```python
# 定义对外暴露的功能
from .schemas import ApiResponse, ChatRequestModel, CreateSessionModel

# 控制 import * 的导入行为
__all__ = ["ApiResponse", "ChatRequestModel", "CreateSessionModel"]
```

4).  模块改造完毕后，记得需要调整原来的 `main.py` 中 import导入的代码，调整为 从 `app.schemas` 包中导入对应的类。

```python
import os.path
from datetime import datetime
from fastapi import FastAPI, Request, Depends
from fastapi.encoders import jsonable_encoder
from openai import OpenAI
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import FileResponse, JSONResponse
from starlette.staticfiles import StaticFiles
import logging  # 日志记录

# from app.db.database import session_factory, AiSession, AiPreset, AiMessage, get_session
from app.db import get_session, AiPreset, AiSession, AiMessage
from app.schemas import ApiResponse, ChatRequestModel, CreateSessionModel

#常见级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）
logging.basicConfig(
    level=logging.INFO,     # 日志级别 记录的是当前级别及以上级别的日志
    format="%(asctime)s -  %(levelname)s - 【 %(filename)s : %(lineno)d 】 - %(message)s"   # 日志输出的格式
)
# 禁用sqlalchemy的日志
logging.getLogger("sqlalchemy.engine").propagate=False

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣",description="AI智能伴侣演示的案例",version="V1.0")
```

### AI交互基础信息抽取重构

1). 在 app 目录下再创建一个包 ai（包下需要新建 `__init__.py` 文件哦），该目录用于存放一些与AI大模型交互的基础信息 。

![](./static/day13-Python-AI应用实战%28重构优化%29-cZRSAnJf.png)

2). 在 ai 包下，创建一个python模块命名为 `config.py` ，该模块仅存放一些与AI大模型交互的基础信息（将之前在main.py中定义的与AI大模型交互的基础代码抽取到该模块中）。

```python
import os
from openai import OpenAI

# 创建OpenAI客户端
client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")

# 系统提示词
SYSTEM_PROMPT = """
    你叫 %s，现在是用户的真实伴侣，请完全代入伴侣角色。
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
```

3). 最后，需要在该包的描述文件 `__init__.py`中，定义该包对外暴露的功能（以简化外部导入），以及控制 `import *` 的导入行为

```python
# 定义对外暴露的功能
from .config import client, SYSTEM_PROMPT

# 控制 import * 的导入行为
__all__ = ["client", "SYSTEM_PROMPT"]
```

4).  模块改造完毕后，记得需要调整原来的 `main.py` 中 import导入的代码，调整为 从 `app.schemas` 包中导入对应的类。

```python
from datetime import datetime
from fastapi import FastAPI, Request, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import FileResponse, JSONResponse
from starlette.staticfiles import StaticFiles
import logging  # 日志记录

# from app.db.database import session_factory, AiSession, AiPreset, AiMessage, get_session
from app.db import get_session, AiPreset, AiSession, AiMessage
from app.schemas import ApiResponse, ChatRequestModel, CreateSessionModel
from app.utils import generate_session_name
from app.ai import client, SYSTEM_PROMPT

#常见级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s -  %(levelname)s - 【 %(filename)s : %(lineno)d 】 - %(message)s"
)
# 禁用sqlalchemy的日志
logging.getLogger("sqlalchemy.engine").propagate=False

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣",description="AI智能伴侣演示的案例",version="V1.0")
#挂载HTML、CSS、JS这些静态文件的存放目录
app.mount("/static",StaticFiles(directory="static"),name="name")
```

### 基础代码拆分

1). 在 app 目录下再创建一个包 routers（包下需要新建 `__init__.py` 文件哦），该目录用于存放一些各个模块的路由函数 。

![](./static/day13-Python-AI应用实战%28重构优化%29-chXz1nIe.png)

2). 在 routers 包下，创建三个python模块分别命名为 `presets.py`、`sessions.py`、`chat.py`，该模块仅存放路由操作函数（将之前在`main.py`中定义的路由操作函数分别抽取到这三个模块中）。

- `presets.py`

```python
from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session, AiPreset
from app.schemas import ApiResponse

#3.加载伴侣预设信息列表---------------------->FastAPI的依赖 注入Depends
@app.get("/api/presets",summary="伴侣预设信息预览")
async def load_presets(session: AsyncSession = Depends(get_session))->ApiResponse:

    #执行查询操作->查询ai_preset表中所有数据，根据sort_order排序升序
    result = await session.execute(select(AiPreset).order_by(AiPreset.sort_order.asc()))
    presets_list=jsonable_encoder(result.scalars().all())

    return ApiResponse(code=200,message="伴侣预设模板文件加载成功~!",data=presets_list)
```

- `sessions.py`

```python
import logging
from datetime import datetime
from fastapi import Depends
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session, AiSession, AiMessage
from app.schemas import ApiResponse, CreateSessionModel
from app.utils import generate_session_name

#4.创建会话>会话名称------>将该会话的数据信息，保存到文件中；
@app.post("/api/sessions",summary="创建会话")
async def create_session(request: CreateSessionModel, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"创建会话,{request.nick_name}:{request.nature}")

    # 1.生成会话名称--->2026-06-23_14-50-09
    session_name = generate_session_name()
    ai_session = AiSession(session_name=session_name,nick_name=request.nick_name,nature=request.nature,create_time=datetime.now(),update_time=datetime.now())
    session.add(ai_session)
    await session.commit()  # 提交数据

    #3.返回
    return ApiResponse(code=200,message="创建会话成功",data=session_name)

#6.加载历史会话列表
@app.get("/api/sessions",summary="加载历史会话列表")
async def load_sessions(session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info("加载历史会话列表")

    session_result = await session.execute(select(AiSession.session_name).order_by(AiSession.session_name.desc()))
    session_list = session_result.scalars().all()   # scalars 获取的就是第一列的数据

    return ApiResponse(code=200,message="加载历史会话列表成功",data=session_list)

#7.加载指定会话数据  --->/api/sessions/2026-06-24_08-52-27，/api/sessions/2026-06-24_08-56-09--->路径参数
@app.get("/api/sessions/{session_name}")
async def load_session(session_name: str, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"加载指定会话数据:{session_name}")
    #获取会话基本数据
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == session_name))
    ai_session = session_result.scalars().one()

    #获取会话信息
    msg_result = await session.execute(select(AiMessage).where(AiMessage.session_id == ai_session.id))
    ai_messages = msg_result.scalars().all()

    #3.组装数据
    session_data={
        "nick_name":ai_session.nick_name,
        "nature":ai_session.nature,
        "session_name":ai_session.session_name,
        "messages":[{"role":i.role,"content":i.content} for i in ai_messages]
    }
    return ApiResponse(code=200,message="加载指定会话数据成功",data=session_data)

#8.删除指定会话数据
@app.delete("/api/sessions/{session_name}")
async def delete_session(session_name: str, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"删除指定会话数据:{session_name}")
    #查询基本信息 拿到id
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == session_name))
    ai_session = session_result.scalars().one()

    #删除该条对应的会话信息
    await session.execute(delete(AiMessage).where(AiMessage.session_id == ai_session.id))

    #删除基本信息
    await session.execute(delete(AiSession).where(AiSession.id == ai_session.id))

    # 提交事务
    await session.commit()

    return ApiResponse(code=200,message="删除指定会话数据成功",data=None)
```

- `chat.py`

```python
import logging
from datetime import datetime
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai import SYSTEM_PROMPT, client
from app.db import get_session, AiSession, AiMessage
from app.schemas import ApiResponse, ChatRequestModel

#5.与AI大模型交互
@app.post("/api/chat",summary="与AI大模型交互",response_model=ApiResponse)
async def chat(request:ChatRequestModel,session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"与AI大模型交互,{request.session_name}-{request.message}-{request.nick_name}-{request.nature}")

    # 1. 加载会话数据
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == request.session_name))
    ai_session = session_result.scalars().one()

    msg_result = await session.execute(select(AiMessage).where(AiMessage.session_id == ai_session.id))
    ai_messages = msg_result.scalars().all()

    session_data=[{"role":i.role,"content":i.content}for i in ai_messages]

    #组装系统提示词
    system_prompt=SYSTEM_PROMPT % (request.nick_name,request.nature)

    #构建与AI交互的消息列表
    messages=[ {"role":"system","content":system_prompt}]    ##系统提示词
    for msg in session_data: #历史会话信息
        messages.append(msg)
    messages.append({"role":"user","content":request.message}) #用户最新消息

    logging.info(f"------------->请求的会话信息:{messages}")
    #调用deekseek
    response=client.chat.completions.create(
        model="deepseek-v4-pro",
        messages = messages,
        stream = False,
        reasoning_effort = "high",
        extra_body = {"thinking": {"type": "disabled"}}
    )
   #获取响应数据
    ai_response_data=response.choices[0].message.content  #ai的回复

    #插入两条信息 user和assistant
    session.add(AiMessage(session_id=ai_session.id,role="user",content=request.message, create_time=datetime.now()))        # type:ignore
    session.add(AiMessage(session_id=ai_session.id,role="assistant",content=ai_response_data, create_time=datetime.now()))  # type:ignore

    # 更新性格,昵称
    ai_session.nature = request.nature
    ai_session.nick_name = request.nick_name

    # 提交数据
    await session.commit()

    #响应数据到前端
    return ApiResponse(code=200,message="操作成功",data=ai_response_data)
```

目前我们在 `presets.py` ，`sessions.py`，`chat.py` 文件中定义的路由函数运行都会报错，因为找不到app这个FastAPI实例 。要解决这个问题，就可以通过FastAPI中提供的 APIRouter 来解决。

# FastAPI路由

路由（Route）本质上就是一个映射关系，它将客户端发来的HTTP请求（url+方式），映射到后端对应的处理函数

## APIRouter

### 介绍

`APIRouter`** 是 FastAPI 官方推荐的“路由组织器”，用于将不同模块的接口拆分到独立文件中，最后像拼图一样整合到主应用，既保持了代码整洁，又保留了 FastAPI 的全部强大功能。**

它拥有与主 `FastAPI` 实例几乎完全相同的功能（如支持路径操作、依赖注入、响应模型、标签等），但它是为了组织和管理路由而设计的，而不是为了启动服务器。

关于APIRouter的用法，分为两步：

- 创建 APIRouter 路由对象 （路由对象的用法，与FastAPI基本都是一样的）。

router = APIRouter(prefix="/前缀", tags=["tag"])

- 在主应用中包含 APIRouter 路由。

app.include_router(router_name)

### 创建APIRouter路由

接下来，我们就先在 `presets.py`、`sessions.py`、`chat.py` 这三个子模块中，在定义路由函数之前，先创建APIRouter路由对象。

- `presets.py`

```python
from fastapi import Depends, APIRouter
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session, AiPreset
from app.schemas import ApiResponse

router = APIRouter(prefix="/api", tags=["伴侣预设信息"])

#3.加载伴侣预设信息列表---------------------->FastAPI的依赖 注入Depends
@router.get("/presets",summary="伴侣预设信息预览")
async def load_presets(session: AsyncSession = Depends(get_session))->ApiResponse:

    #执行查询操作->查询ai_preset表中所有数据，根据sort_order排序升序
    result = await session.execute(select(AiPreset).order_by(AiPreset.sort_order.asc()))
    presets_list=jsonable_encoder(result.scalars().all())

    return ApiResponse(code=200,message="伴侣预设模板文件加载成功~!",data=presets_list)
```

- `sessions.py`

```python
import logging
from datetime import datetime
from fastapi import Depends, APIRouter
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session, AiSession, AiMessage
from app.schemas import ApiResponse, CreateSessionModel
from app.utils import generate_session_name

router = APIRouter(prefix="/api", tags=["会话信息"])

#4.创建会话>会话名称------>将该会话的数据信息，保存到文件中；
@router.post("/sessions",summary="创建会话")
async def create_session(request: CreateSessionModel, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"创建会话,{request.nick_name}:{request.nature}")

    # 1.生成会话名称--->2026-06-23_14-50-09
    session_name = generate_session_name()
    ai_session = AiSession(session_name=session_name,nick_name=request.nick_name,nature=request.nature,create_time=datetime.now(),update_time=datetime.now())
    session.add(ai_session)
    await session.commit()  # 提交数据

    #3.返回
    return ApiResponse(code=200,message="创建会话成功",data=session_name)

#6.加载历史会话列表
@router.get("/sessions",summary="加载历史会话列表")
async def load_sessions(session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info("加载历史会话列表")

    session_result = await session.execute(select(AiSession.session_name).order_by(AiSession.session_name.desc()))
    session_list = session_result.scalars().all()   # scalars 获取的就是第一列的数据

    return ApiResponse(code=200,message="加载历史会话列表成功",data=session_list)

#7.加载指定会话数据  --->/api/sessions/2026-06-24_08-52-27，/api/sessions/2026-06-24_08-56-09--->路径参数
@router.get("/sessions/{session_name}")
async def load_session(session_name: str, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"加载指定会话数据:{session_name}")
    #获取会话基本数据
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == session_name))
    ai_session = session_result.scalars().one()

    #获取会话信息
    msg_result = await session.execute(select(AiMessage).where(AiMessage.session_id == ai_session.id))
    ai_messages = msg_result.scalars().all()

    #3.组装数据
    session_data={
        "nick_name":ai_session.nick_name,
        "nature":ai_session.nature,
        "session_name":ai_session.session_name,
        "messages":[{"role":i.role,"content":i.content} for i in ai_messages]
    }
    return ApiResponse(code=200,message="加载指定会话数据成功",data=session_data)

#8.删除指定会话数据
@router.delete("/sessions/{session_name}")
async def delete_session(session_name: str, session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"删除指定会话数据:{session_name}")
    #查询基本信息 拿到id
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == session_name))
    ai_session = session_result.scalars().one()

    #删除该条对应的会话信息
    await session.execute(delete(AiMessage).where(AiMessage.session_id == ai_session.id))

    #删除基本信息
    await session.execute(delete(AiSession).where(AiSession.id == ai_session.id))

    # 提交事务
    await session.commit()

    return ApiResponse(code=200,message="删除指定会话数据成功",data=None)
```

- `chat.py`

```python
import logging
from datetime import datetime
from fastapi import Depends, APIRouter
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai import SYSTEM_PROMPT, client
from app.db import get_session, AiSession, AiMessage
from app.schemas import ApiResponse, ChatRequestModel

router = APIRouter(prefix="/api", tags=["AI交互信息"])

#5.与AI大模型交互
@router.post("/chat",summary="与AI大模型交互",response_model=ApiResponse)
async def chat(request:ChatRequestModel,session: AsyncSession = Depends(get_session))->ApiResponse:
    logging.info(f"与AI大模型交互,{request.session_name}-{request.message}-{request.nick_name}-{request.nature}")

    # 1. 加载会话数据
    session_result = await session.execute(select(AiSession).where(AiSession.session_name == request.session_name))
    ai_session = session_result.scalars().one()

    msg_result = await session.execute(select(AiMessage).where(AiMessage.session_id == ai_session.id))
    ai_messages = msg_result.scalars().all()

    session_data=[{"role":i.role,"content":i.content}for i in ai_messages]

    #组装系统提示词
    system_prompt=SYSTEM_PROMPT % (request.nick_name,request.nature)

    #构建与AI交互的消息列表
    messages=[ {"role":"system","content":system_prompt}]    ##系统提示词
    for msg in session_data: #历史会话信息
        messages.append(msg)
    messages.append({"role":"user","content":request.message}) #用户最新消息

    logging.info(f"------------->请求的会话信息:{messages}")
    #调用deekseek
    response=client.chat.completions.create(
        model="deepseek-v4-pro",
        messages = messages,
        stream = False,
        reasoning_effort = "high",
        extra_body = {"thinking": {"type": "disabled"}}
    )
   #获取响应数据
    ai_response_data=response.choices[0].message.content  #ai的回复

    #插入两条信息 user和assistant
    session.add(AiMessage(session_id=ai_session.id,role="user",content=request.message, create_time=datetime.now()))        # type:ignore
    session.add(AiMessage(session_id=ai_session.id,role="assistant",content=ai_response_data, create_time=datetime.now()))  # type:ignore

    # 更新性格,昵称
    ai_session.nature = request.nature
    ai_session.nick_name = request.nick_name

    # 提交数据
    await session.commit()

    #响应数据到前端
    return ApiResponse(code=200,message="操作成功",data=ai_response_data)
```

APIRouter的用法与FastAPI的用法基本一致，因此我们可以把 APIRouter 可以看做成一个 "迷你版的 FastAPI 类"。而在创建 APIRouter 实例的时候，指定了两个属性：

- `prefix`：前缀，可以把当前模块中的所有路由函数对应的请求路径的相同前缀，可以提取出来，统一声明，比如 `/api`。

- `tags`：标签，标记这个接口的标签，便于在接口文档中进行分组。

需要在该包（routers）的描述文件 `__init__.py`中，定义该包对外暴露的功能（以简化外部导入），以及控制 `import *` 的导入行为

```python
# 定义对外暴露的功能
from .presets import router as presets_router      # 由于几个子模块中的APIRouter对象都叫 router, 为便于区分, 这里起个别名
from .chat import router as chat_router            # 由于几个子模块中的APIRouter对象都叫 router, 为便于区分, 这里起个别名
from .sessions import router as sessions_router    # 由于几个子模块中的APIRouter对象都叫 router, 为便于区分, 这里起个别名

# 控制 import * 的导入行为
__all__ = ["presets_router", "chat_router", "sessions_router"]
```

### 主应用包含路由

那在各个子模块中定义好了路由函数之后，最终我们启动服务，启动的是 main.py 中的FastAPI服务，因此还需要在主应用，也就是 `main.py` 中，将其包含进来，这里需要调用FastAPI对象中的 `include_router` 方法。

最终 `mian.py` 文件中的代码如下：

```python
from fastapi import FastAPI, Request
from starlette.responses import FileResponse, JSONResponse
from starlette.staticfiles import StaticFiles
import logging  # 日志记录

from app.routers import presets_router, chat_router, sessions_router

#常见级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）
logging.basicConfig(level=logging.INFO, format="%(asctime)s -  %(levelname)s - 【 %(filename)s : %(lineno)d 】 - %(message)s")
# 禁用sqlalchemy的日志
logging.getLogger("sqlalchemy.engine").propagate=False

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣",description="AI智能伴侣演示的案例",version="V1.0")
#挂载HTML、CSS、JS这些静态文件的存放目录
app.mount("/static",StaticFiles(directory="static"),name="name")

# 包含路由
app.include_router(presets_router)
app.include_router(chat_router)
app.include_router(sessions_router)

#2.定义路径操作函数（路由函数）
@app.get("/")
async def root():
    logging.info("访问项目首页")
    return FileResponse("static/index.html")   ##响应的是一个文件

# 统一处理异常信息
@app.exception_handler(Exception)
def handle_exception(request: Request, exc: Exception):
    logging.error(f"处理异常, 请求路径: {request.url}, 异常信息: {exc}")
    return JSONResponse(content={"code": 500, "message": "服务器内部错误"})

if __name__ =='__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) #access_log=False 禁用日志
```

# FastAPI生命周期

**思考:**
     当前代码中，关于数据库连接池初始化的时机?
    （`app/db/database.py`）：

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncEngine
from sqlalchemy.orm import DeclarativeBase

# 1. 创建引擎(支持异步操作)
engine = create_async_engine("mysql+aiomysql://root:1234@localhost:3306/ai_partner_db?charset=utf8mb4", echo=True)
# 2. 会话工厂(支持异步操作)
session_factory = async_sessionmaker(engine)

# 3. 获取会话对象session
async def get_session():
    session = session_factory()
    try:
        yield session  #暂停函数,返回session
    except Exception as e:
        await session.rollback()
        raise
    finally:
        await session.close()
```

当前在创建引擎，以及创建会话工厂的时候，是直接在 python 代码中定义的，那也就就会存在如下问题：

- 在当前这个模块被`import`的时候，就会创建引擎、创建数据库连接池 ，而模块的导入顺序，也会影响到创建引擎、创建连接池的时机。

- import导入时，创建连接池的时机太早，项目并未启动，就创建，可能存在资源的浪费。

- 数据库连接池中的连接什么时候释放呢？ 目前释放的时机就是项目结束时，进程退出，强制释放，退出时机太晚了。

**解决:**

在项目 **"真正启动"** 和 **"真正关闭"** 的时候进行创建和销毁

## 介绍

在FastAPI中，**生命周期（Lifespan）**指的是**应用程序从启动到关闭的整个过程**。

在这个过程中，我们可以在两个关键时机执行自定义的代码：

1. 启动时（Startup）：在应用程序开始接收请求之前执行

2. 关闭时（Shutdown）：在应用程序停止接收请求之后执行

## 入门程序

FastAPI通过`lifespan`参数和异步上下文管理器来实现生命周期管理。`lifespan`参数接受一个异步上下文管理器，异步的上下文管理器可以通过`@asynccontextmanager`装饰器来创建。

**演示代码：**

```python
@asynccontextmanager
async def start_and_stop(app: FastAPI):
    print("项目启动 ~ , 准备环境, 加载资源 ~")
    yield
    print("项目结束 ~ , 清理环境, 释放资源 ~")

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣", description="AI智能伴侣演示的案例", version="V1.0", lifespan=start_and_stop)
```

`@asynccontextmanager`装饰器将普通函数转换为异步上下文管理器，`yield`之前的代码在项目启动时执行，`yield`之后的代码在项目停止（退出）时执行 。

具体的执行流程如下：

![](./static/day13-Python-AI应用实战%28重构优化%29-画板-cjwbinrg.jpg)

## 案例优化

使用FastAPI提供的`lifespan`参数和异步上下文管理器来实现生命周期管理的特性来优化
《AI智能伴侣》这个案例中数据库连接池的创建、销毁时机的控制。

**1). 调整 **`app/db/database.py`** 文件，定义两个异步方法，一个执行初始化操作，一个执行销毁操作。 调整后的代码如下：**

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# 1. 创建引擎(支持异步操作)
# print("创建引擎, 初始化数据库连接池 ...")
# engine = create_async_engine("mysql+aiomysql://root:1234@localhost:3306/ai_partner_db?charset=utf8mb4", echo=True)
# # # 2. 会话工厂(支持异步操作)
# session_factory = async_sessionmaker(engine)

engine = None
session_factory = None

# 初始化引擎, 数据库连接池
async def init_db():
    global engine, session_factory
    engine = create_async_engine("mysql+aiomysql://root:1234@localhost:3306/ai_partner_db", echo=True)
    session_factory = async_sessionmaker(engine)

# 销毁数据库连接池
async def close_db():
    global engine
    if engine:
        await engine.dispose()

# 3. 声明模型类(父类)
class Base(DeclarativeBase):
    pass

# 4. 获取会话对象session
async def get_session():
    session = session_factory()
    try:
        yield session  #暂停函数,返回session
    except Exception as e:
        await session.rollback()
        raise
    finally:
        await session.close()
```

**2). 在 **`main.py`** 文件，在 **`start_and_stop`** 这个函数中，调用 **`init_db`**, **`close_db`** 函数**

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging  # 日志记录
from app.routers import presets_router, chat_router, sessions_router
from app.db import init_db, close_db

#常见级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）
logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s -  %(levelname)s - 【 %(filename)s : %(lineno)d 】 - %(message)s"
)
# 禁用sqlalchemy的日志
logging.getLogger("sqlalchemy.engine").propagate=False

@asynccontextmanager
async def start_and_stop(app: FastAPI):
    try:
        logging.info("初始化引擎、数据库连接池")
        await init_db()
        yield
    finally:
        logging.info("关闭数据库连接池")
        await close_db()

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣", description="AI智能伴侣演示的案例", version="V1.0", lifespan=start_and_stop)

# 包含路由
app.include_router(presets_router)
app.include_router(chat_router)
app.include_router(sessions_router)

# 统一处理异常信息
@app.exception_handler(Exception)
def handle_exception(request: Request, exc: Exception):
    logging.error(f"处理异常, 请求路径: {request.url}, 异常信息: {exc}")
    return JSONResponse(content={"code": 500, "message": "服务器内部错误"})

if __name__ =='__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) #access_log=False 禁用日志
```

现在，我们在启动项目时，就可以看到，数据库连接池是我们在启动项目时，完成创建的，而不是在导入模块时。

![](./static/day13-Python-AI应用实战%28重构优化%29-cK0z1nSh.png)

而在停止项目运行的时候，我们可以看到连接池关闭销毁了（连接池中的连接也就释放了）。

![](./static/day13-Python-AI应用实战%28重构优化%29-cXJnNnuc.png)