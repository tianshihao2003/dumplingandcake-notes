---
title: "Day13"
date: 2026-11-28
cover: false
---

# Depends依赖注入

一句话介绍：Depends 是 FastAPI 的依赖注入机制，用于在<mark style="background:#d3f8b6">路由处理函数执行前自动获取所需的资源或执行初始化逻辑</mark>，实现"声明式依赖"。

## 实现的步骤
### 第一步：定义函数
定义一个函数负责管理创建会话的session = session_factory()代码行

```Python
# 每一个接口都需要获取会话，和关闭会话，所以将会话的获取和关闭，提取到一个公共函数中
async def manage_session():
    logging.info("开始获取会话========================")
    session = session_factory()
    #在执行接口的业务过程中，如果接口有异常，进行异常的捕获
    #捕获到异常后，进行事务的回滚操作
    #回滚后，将捕获到的异常再次抛出，让异常处理器去处理该异常
    #finally定义会话关闭的操作，保证session一定关闭
    try:
        yield session
    except Exception as e:
        await session.rollback()  # 事务的回滚
        raise  #抛出异常
    finally:
        await session.close()
        logging.info("关闭会话==================================")
```

- yield：
	- 作用1：返回结果给调用者
	- 作用2：暂停当前函数，接口的逻辑执行结束之后，往后继续执行该函数
- raise：抛出异常让异常处理器去处理该异常
- finally：定义会话关闭的操作，保证session一定关闭

### 第二步：注入方法

session: AsyncSession = Depends(manage_session)

```Python
@app.get("/api/presets",summary="伴侣预设信息预览")
async def load_presets(session: AsyncSession = Depends(manage_session)):
    return []
```

## 生成器yield

介绍：生成器（Generator） 是一种特殊的迭代器（yield），它不会一次性生成所有数据，而是记住当前执行位置，每次请求时才计算下一个值。

**yield 生成器的核心机制：**`yield` 就像函数的"暂停按钮"

| **关键字**  | **行为**                   |
| -------- | ------------------------ |
| `return` | 返回值，函数结束，所有局部变量销毁        |
| `yield`  | 返回值，函数暂停，保留所有局部变量和当前执行位置 |
# 项目重构优化的方法

## 思路

对项目代码按**职责与功能边界**进行拆分解耦，比如前面学习案例中的包含 `SQLALchemy数据库操作的基础信息`、`与数据库表映射的模型`、 `FastAPI实例创建`、`日志配置`、`Pydantic模型`、`与AI大模型交互的系统提示词、AI客户端`、`工具函数`、`API接口`、`启动项目的代码`等，按照其作用和职责，将其进行拆分。

## 拆分方式
1、拆分模块（平铺多个模块）
2、拆分包（对多个模块归类）

企业开发中两种方式都很常用，**并非互斥**，适配场景不同：
- 平铺模块：适合一次性脚本、小型简单程序
- 包结构：适合需要长期迭代、持续维护演进的正式项目
> 实践经验：很多项目会先平铺模块做初步拆分，随着业务变复杂，再重构升级为包结构。

<mark style="background:#d3f8b6">提醒</mark>：`__init__.py`控制import * 的导入行为
### FastAPI中Pydantic模型抽取重构
在 app 目录下再创建一个包 schemas，该目录下的schemas.py用于存放 FastAPI中定义的Pydantic模型。

### routers路由包

# opencode配置代码（可复用）

```py
#创建一个openai客户端,指定模型的apikey及模型服务商地址  
import os  
import uuid  
  
from openai import OpenAI  
api_key = os.environ["OPENCODE_API_KEY"]  
client = OpenAI(  
    api_key=api_key,  
    base_url="https://opencode.ai/inference/go/openai/v1",  # 买 Go 用这个；按量余额用 /inference/openai/v1    # 自定义请求头，包含会话 ID    default_headers={  
        # 自定义 User-Agent，建议包含应用名称和版本号  
        "User-Agent": "my-coding-agent/1.0",  
        # 会话 ID，用于保持会话状态  
        "x-opencode-session": uuid.uuid4().hex,  # 同一个会话内不要重建  
    }  
)  
# messages是封装好的信息
response = client.chat.completions.create(  
    model="deepseek-flash",  
    messages=messages,  
    stream=False,  
    reasoning_effort="high",  
    extra_body={"thinking": {"type": "disabled"}},  
)  
# 获取模型的回复结果  
ai_response= response.choices[0].message.content

```

# FastAPI路由

## APIRouter

介绍：APIRouter 是 FastAPI 官方推荐的“路由组织器”，用于将<mark style="background:#d3f8b6">不同功能的接口拆分到独立文件</mark>中，最后像拼图一样<mark style="background:#d3f8b6">整合到主应用</mark>，既保持了代码整洁，又保留了 FastAPI 的全部强大功能。

### 两步走

1. 创建 APIRouter 路由对象 （路由对象的用法，与FastAPI基本都是一样的）。
   router = APIRouter(prefix="/前缀", tags=["tag"])
2. 在主应用中包含自定义的 APIRouter 路由。
   app.include_router(router_name)

### 实现
```py
router = APIRouter(prefix="/api", tags=["伴侣预设信息"]) 

@router.get("/presets",summary="伴侣预设信息预览")
async def load_presets(session: AsyncSession = Depends(get_session))->ApiResponse:
	return []
	
# 主应用
# 导包、添加
app.include_router(router)
```
- @app.get("/api/presets")-->@router.get("/api/presets")
- APIRouter()的括号中可提取路由函数中的内容，比如：
	- tags=[""]
	- /api/presets
- 可以把 APIRouter 可以看做成一个 "迷你版的 FastAPI 类"

# FastAPI生命周期

## 思考：关于数据库连接池初始化的时机?

1. 直接定义时，导入模块就直接被执行创建。可能存在资源的浪费
2. 解决：在项目 **"真正启动"** 和 **"真正关闭"** 的时候进行创建和销毁

## 介绍

在FastAPI中，**生命周期**（Lifespan）指的是应用程序**从启动到关闭的整个过程**。
在这个过程中，我们可以在两个关键时机执行自定义的代码：
1. 启动时（Startup）：在应用程序开始接收请求之前执行
2. 关闭时（Shutdown）：在应用程序停止接收请求之后执行

## 入门程序

- `lifespan`参数
- `@asynccontextmanager`装饰器，将普通函数转换为**异步上下文管理器**
```Python
@asynccontextmanager
async def start_and_stop(app: FastAPI):
    print("项目启动 ~ , 准备环境, 加载资源 ~")
    yield
    print("项目结束 ~ , 清理环境, 释放资源 ~")

#1．创建FastAPI实例
app=FastAPI(title="AI智能伴侣", description="AI智能伴侣演示的案例", version="V1.0", lifespan=start_and_stop)
```

## 讲义案例优化思路

1. 将案例中的创建引擎和会话工厂的代码放进一个函数中，然后主函数使用@asynccontextmanager装饰器定义一个函数配合yield操作函数进行引擎的开启和关闭。
2. 在FastAPI实例中要添加lifespan参数，比如入门程序的`lifespan=start_and_stop`