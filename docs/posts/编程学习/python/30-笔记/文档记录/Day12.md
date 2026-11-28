---
title: "Day12"
date: 2026-11-28
cover: false
---
# SQLAlchemy
## 介绍
**SQLAlchemy** 是Python中的数据库工具库，也是一个ORM框架，开发者可以用操作对象的方式来处理数据库的增删改查。

| **数据库世界**  | **Python世界**  |
| ---------- | ------------- |
| 表（Table）   | 类（Class）      |
| 字段（Column） | 属性（Attribute） |
| 行（Row）     | 对象（Object）    |

## 入门程序

安装依赖
```Sh
uv  add  sqlalchemy  pymysql
```


## 创建引擎：管理数据库连接

```py
from sqlalchemy import create_engine
engine = create_engine("mysql+pymysql://root:1234@localhost:3306/db02",echo=True)
 #  echo=True : 由连接产生的 SQL 语句, 会输出在日志中;
```

## 声明模型基类、定义映射类：映射"Python类 ---> 数据库表"

格式:
	属性名: Mapped[py中对象属性类型] = mapped_column(类型(SQLALchemy中的类型), 是否为空, 是否主键, 字段注释)

```Python
class Base(Dec
larativeBase):
    pass

class AiMessage(Base):
    __tablename__ = "ai_message"    # 指定表名

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment='主键')
    session_id: Mapped[int] = mapped_column(Integer, nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    def __repr__(self):
        return f"<AiMessage(id={self.id}, session_id={self.session_id}, role={self.role}, content={self.content}, create_time={self.create_time})>"
```

##  创建操作数据库的会话

```py
session = Session(engine)
```

## 添加表数据
- session.add()
- session.commit
```Py
    session.add(AiMessage(session_id=1, role="assistant", content="你笑什么呢~", create_time=datetime.now()))
    session.add(AiMessage(session_id=1, role="user", content="就是好笑呀", create_time=datetime.now()))
    session.commit() 
```

## create_engine

![](assets/Day12/file-20261127200310102.webp)

## with上下文管理器创建会话（session）

- 会在执行完毕后，自动调用close释放资源

```Python
if __name__ == '__main__':
    
    with Session(engine) as session:
        # 1. 执行操作 - 新增数据
        session.add(AiMessage(session_id=1, role="assistant", content="你笑什么呢~", create_time=datetime.now()))
        session.add(AiMessage(session_id=1, role="user", content="就是好笑呀", create_time=datetime.now()))
        session.commit()
```

# 数据库连接

三步：
 - 三次握手
 - 连接数据库
 - 分配内存、资源
# 数据连接池

调用如下代码时，自动使用连接池技术。
```Python
engine = create_engine("mysql+pymysql://root:1234@localhost:3306/db02", echo=True) 
```

默认添加以下参数：
- `pool_size = 5`：核心连接数，常驻连接池的数量
- `max_overflow = 10`：溢出连接数，用完即关
- `pool_recycle =-1` ：表示永远有效，超过自定义秒数连接会销毁，防止MySQL数据库主动断开连接，造成连接不可用。
--- 
- `pool_pre_ping = True`：获取连接前检查是否还活着

# SQLAlchemy基本操作

## 新增session.add(AiMessage(属性=值...))

## 查询

```
查询三步：
1. 构造  select(表模型).where(条件)     # where 可省略（AND）
2. 执行  session.execute(语句)          
3. 取数  .scalars().one() / .all()
          .mappings().all()
          .one()
条件写 Python 表达式：==  !=  >  .like()  .in_()
```

![670](assets/Day12/file-20261127202318386.webp)

- all()打印所有
- one()打印第一条
- session.execute()把一条语句交给数据库执行并拿回结果」的入口
-  session.execute(sql1).scalars()剥掉外层元组，只取第一列，通常用来返回整个AiMessage 实体
- mappings()：将查询结果的每一行转换为字典

### 条件查询

![660](assets/Day12/file-20261127203451117.webp)

### scalars()
```py
# C：只查一列（content）再用 scalars
print(session.execute(select(AiMessage.content)).scalars().all())
# D：查两列，分别试两种取法
two = select(AiMessage.role, AiMessage.content)
print(session.execute(two).all()) # 不剥 
print(session.execute(two).scalars().all()) # 剥掉 → 只剩第一列

============

C ['你好，帮我查一下订单', '你好，请提供订单号', '订单号是 12345'] 
D1 [('user', '你好，帮我查一下订单'), ('assistant', '你好，请提供订单号'), ('user', '订单号是 12345')] 
D2 ['user', 'assistant', 'user']

```

### 多条件查询

- and_
- or_
- where(and_(条件,....))
- where(or_(条件,....))
### 排序查询


- order_by(排序字段.排序方式) 

```py
s1 = select(AiMessage).order_by(AiMessage.create_time.desc(),AiMessage.id.desc())
```

### 分页查询

- `limit` 指定查询的条数
- `offset` 指定起始位置（偏移量）
```python
_#如果需要分页查询,使用limit方法指定查询几条,使用__offset__指定从哪一个索引开始查询_ 
s1 = select(AiMessage).limit(4).offset(2) _#limit_ _2__,__4_

```

## 修改

- update
- where()
- values()
- 两种方式
![634](assets/Day12/file-20261128085344009.webp)


## 删除

- delete
- in_([])删除多条数据时
- commit()

![](assets/Day12/file-20261128085649446.webp)
## 代码优化

1. 创建引擎engine=<mark style="background:#d3f8b6">create_async_engine</mark>("mysql+<mark style="background:#d3f8b6">aiomysql</mark>://root:1234@localhost:3306/ai_partner_db", echo=True)
2. 声明模型基类
3. 创建表模型类
4. 创建会话工厂
   session_factory = <mark style="background:#d3f8b6">async_cessionmaker</mark>(engine)
5. 使用`pymysql` 驱动，`create_engine` 创建引擎的函数是同步操作
6. 将 `pymysql` 换成 `aiomysql`，`create_engine` 换成 `create_async_engine`使用异步操作
7. 安装mysql的异步操作客户端依赖
```Python
uv add aiomysql cryptography
```

--- 
```Python
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
```
- `jsonable_encoder` 的作用：
  FastAPI 提供的编码工具，负责把 “JSON 不认识的类型” 递归转换成基础类型
- 不能直接调用.scalars().all()的原因：
  session.execute 方法返回的结果是一个协程对象，协程对象没有 scalars方法。
- 所以要等到该协程<mark style="background:#d3f8b6">执行完毕后</mark>，拿到运行结果，然后再调用 `.scalars().all()` 方法。
