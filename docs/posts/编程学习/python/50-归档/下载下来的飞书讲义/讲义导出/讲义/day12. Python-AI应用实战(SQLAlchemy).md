---
title: "day12. Python-AI应用实战(SQLAlchemy)"
node_token: UX7XwPSSdibIOdkx4bech7yfnug
obj_token: KrfDduL8EoAByIxhzHXcwBbpnig
obj_type: docx
space_id: ""
url: https://ocn0tgqr5oz2.feishu.cn/wiki/UX7XwPSSdibIOdkx4bech7yfnug
edited_at: "1794726045"
exported_at: "2026-11-21T13:24:02.623Z"
cover: false
date: 2026-11-21
---
**思考：昨天讲解的操作数据库，都是基于图形化工具 / SQL 来操作数据库，如果后续需要在PY代码中操作**

**         数据库，应该如何操作呢？**

![](./static/day12-Python-AI应用实战%28SQLAlchemy%29-cROqJnxg.png)

# SQLAlchemy介绍

## 介绍

**SQLAlchemy** 是Python中功能强大的数据库工具库，也是一个ORM（**O**bject **R**elational **M**apping）框架，开发者可以用操作对象的方式来处理数据库的增删改查（大幅减少手写SQL的重复工作）。

| **数据库世界** | **Python世界** |
| --- | --- |
| 表（Table） | 类（Class） |
| 行（Row） | 对象（Object） |
| 字段（Column） | 属性（Attribute） |

## 入门程序

**需求:**插入会话消息到ai_message表

**1). 准备数据库表, 安装依赖库**

```sql
create table ai_message (
  id int primary key auto_increment comment '主键',
  session_id int not null comment '会话id',
  role varchar(20) not null comment '角色',
  content varchar(500) not null comment '消息内容',
  create_time datetime not null comment '创建时间'
) comment '交互消息表';

insert into ai_message values (1,1,'user','你好','2026-06-25 17:57:45'),
        (2,1,'assistant','你好，有什么我可以帮助你的吗？','2026-06-25 17:57:45'),
        (3,1,'user','你叫什么名字？','2026-06-25 17:57:45'),
        (4,1,'assistant','我叫chatgpt，一个基于openai gpt-3的聊天机器人。','2026-06-25 17:57:45'),
        (5,1,'user','你喜欢吃什么？','2026-06-25 17:57:45'),
        (6,1,'assistant','我喜欢吃各种类型的食物','2026-06-25 17:57:45');
```

```python
uv  add  sqlalchemy  pymysql
```

**2). 创建引擎：管理数据库连接**

```
from sqlalchemy import create_engine

engine = create_engine("mysql+pymysql://root:1234@localhost:3306/db02", echo=True)
                          #  echo=True : 由连接产生的 SQL 语句, 会输出在日志中;
```

**3). 声明模型基类、定义映射类：映射Python类 ---> 数据库表**

格式:* *
       属性名: Mapped[py中对象属性类型] = mapped_column(类型(SQLALchemy中的类型), 是否为空, 是否主键, 字段注释)

```python
class Base(DeclarativeBase):
    pass

class AiMessage(Base):
    __tablename__ = "ai_message"    # 指定表名

    # 属性名: Mapped[py中对象属性类型] = mapped_column(类型(SQLALchemy中的类型), 是否为空, 是否主键, 字段注释)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment='主键')
    session_id: Mapped[int] = mapped_column(Integer, nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    def __repr__(self):
        return f"<AiMessage(id={self.id}, session_id={self.session_id}, role={self.role}, content={self.content}, create_time={self.create_time})>"
```

**4). 创建操作数据库的会话**

```
session = Session(engine)
```

**5). 执行操作**

```
    session.add(AiMessage(session_id=1, role="assistant", content="你笑什么呢~", create_time=datetime.now()))
    session.add(AiMessage(session_id=1, role="user", content="就是好笑呀", create_time=datetime.now()))
    session.commit() 
```

完整代码:

```python
from datetime import datetime
from sqlalchemy import create_engine, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, Session

# 1. 创建SQLAlchemy引擎, 管理数据库连接、配置信息
engine = create_engine("mysql+pymysql://root:1234@localhost:3306/db02", echo=True)  #  echo=True : 由连接产生的 SQL 语句, 会输出在日志中;

# 2. 声明模型父类, 定义与数据库表映射的模型类 (ORM --> 对象关系映射 : 类 ---> 表)
class Base(DeclarativeBase):
    pass

class AiMessage(Base):
    __tablename__ = "ai_message"    # 指定表名

    # 格式 --> 属性名: Mapped[对象属性类型] = mapped_column(类型(SQLALchemy中的类型), 是否为空, 是否主键, 字段注释)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment='主键')
    session_id: Mapped[int] = mapped_column(Integer, nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    def __repr__(self):
        return f"<AiMessage(id={self.id}, session_id={self.session_id}, role={self.role}, content={self.content}, create_time={self.create_time})>"

# 自动创建表
# Base.metadata.create_all(engine)

if __name__ == '__main__':
    # 3. 执行操作 - 新增数据
    # 3.1 获取操作数据库的会话对象session
    session = Session(engine)
    
    # 3.2 执行操作
    session.add(AiMessage(session_id=1, role="assistant", content="你笑什么呢~", create_time=datetime.now()))
    session.add(AiMessage(session_id=1, role="user", content="就是好笑呀", create_time=datetime.now()))
    session.commit()

    # 3.3 释放session
    session.close()
```

> [!tip] 提示
> **第一步：**调用 `create_engine` 函数，创建SQLAlchemy引擎, 管理数据库连接、配置信息。
>
> 其中数据库访问的url ： `mysql+pymysql://root:1234@localhost:3306/db02`。
>
> `mysql+pymysql://root:1234@localhost:3306/db02`
>
> └────┬────┘    └┬┘  └┬┘  └──┬──┘  └┬┘ └─┬┘  
>
>   数据库+驱动        用户名 密码      主机       端口  数据库

> [!tip] 提示
> **第二步：**声明模型父类, 定义与数据库表映射的模型类。在这个类中，就可以来指定，这个类映射的是那张表，通过 `__tablename__` 属性来指定。
>
> `id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment='主键')`
>
> 然后再来指定类中的属性与表中的字段的映射关系，每个属性的名称对应于数据库中该列的名称。然后再通过类型注解描述与数据库表字段映射的属性的类型，这里需要通过 `Mapped` 类型注解来描述，`Mapped[...]` 里面写的就是该属性的类型（python中的类型）。
>
> 而后面的 mapped_coulmn 则是用来描述与数据库表中的字段信息的，包括字段类型，是否是主键，是否自动自增，注释，是否允许为空等。

> [!tip] 提示
> **第三步：**执行增删改查的操作。而无论是在执行增删改查的那项操作，都需要先获取到数据库操作的会话对象Session，然后执行增、删、改、查的操作，操作执行完毕后，需要释放Session资源（调用close方法）

**with上下文管理器**（会在执行完毕后，自动调用close释放资源）。优化后的代码如下：

```python
if __name__ == '__main__':
    
    with Session(engine) as session:
        # 1. 执行操作 - 新增数据
        session.add(AiMessage(session_id=1, role="assistant", content="你笑什么呢~", create_time=datetime.now()))
        session.add(AiMessage(session_id=1, role="user", content="就是好笑呀", create_time=datetime.now()))
        session.commit()
```

## 入门程序剖析

### 数据库连接

客户端连接数据库服务器时，一次数据库连接创建的过程：

> 画板（v1 不导出视觉内容），token: V7kPwCrMyhNZmMbnNuDc6vlGnGe

- 第一步：客户端在连接MySQL数据库服务器的时候，底层是基于TCP网络协议的，首先要进行三次握手，确认连接建立。

- 第二步：进行数据库认证请求，进行身份校验，确认连接的时候传递的用户名和密码是正确。

- 第三步：MySQL数据库服务器为当前这个连接分配内存、分配线程资源等 。

> 画板（v1 不导出视觉内容），token: OoqXwW8mKh3f1lbsdhocyKpdnef

### 数据库连接池

数据库连接池的思路非常简单，就是提前创建好一批连接，存放在一个池子里，用完后不销毁，而是归还给池子，留着下次接着用（复用）。（存放连接的池子，就称之为连接池）

> 画板（v1 不导出视觉内容），token: M7n4wJcnwhbggObQQIscoA9CnJd

在SQLAlchemy中默认就已经采用了数据库连接池技术，来提高性能。 当我们在创建引擎，调用如下代码时，其实底层已经使用了连接池技术。

```python
engine = create_engine("mysql+pymysql://root:1234@localhost:3306/db02", echo=True) 
```

在创建引擎时，显式的指定连接池的信息，如下：

```python
engine = create_engine("mysql+pymysql://root:1234@localhost:3306/db02", echo=True, pool_size=5, max_overflow=10, pool_recycle=30)
```

上述的参数含义如下：

- `pool_size = 5`：核心连接数，常驻连接池的（类似于有编制的，这部分连接用完，会自动还回来）

- `max_overflow = 10`：溢出连接数，用完即关（类似于临时工，干完这批活就行，后面不再使用了）

- `pool_recycle =30 `：连接最大存活时间为30秒，超过30秒，连接会销毁重建，防止MySQL数据库主动断开连接，造成连接不可用。

- `pool_pre_ping = True`：获取连接前检查是否还活着

> [!tip] 🍀
> 对于数据库连接池的这些参数来说，不配置也可以，因为有默认值：默认 `pool_size = 5`，`max_overflow = 10`，`pool_recycle=-1` 表示永远有效，一直存活。【如果项目开发中有特殊的需求，可额外根据需求进行配置】

# SQLAlchemy基本操作

## 新增

添加数据时，调用会话对象的 `add()` 方法即可。

```python
if __name__ == '__main__':
    
    with Session(engine) as session:
        # 1. 执行操作 - 新增数据
        session.add(AiMessage(session_id=1, role="assistant", content="你笑什么呢~", create_time=datetime.now()))
        session.add(AiMessage(session_id=1, role="user", content="就是好笑呀", create_time=datetime.now()))
        session.commit()
```

## 查询

查询操作所涉及到的情况就比较多了，包含基本查询、条件查询、分组查询、排序查询、分页查询等。

### 基本查询

**查询格式:**

![](./static/day12-Python-AI应用实战%28SQLAlchemy%29-cvdVKn2C.png)

```python
from datetime import datetime
from sqlalchemy import create_engine, String, DateTime, select
from sqlalchemy import Integer
from sqlalchemy.orm import DeclarativeBase, mapped_column, Session
from sqlalchemy.orm import Mapped

#创建引擎
engine = create_engine("mysql+pymysql://root:123321@localhost:3306/ai_partner_db", echo=False
                       ,pool_size=5, max_overflow=10, pool_recycle=3600)
                          #  echo=True : 由连接产生的 SQL 语句, 会输出在日志中;

class Base(DeclarativeBase):
    pass
#定义一个类型，来与数据库中的表建立一个联系
class AiMessage(Base):
    # 指定和数据库中的哪一张表建立联系
    __tablename__ = "ai_message"
    #表中的字段,也需要跟类中的属性建立联系
    id:Mapped[int] = mapped_column(Integer, primary_key=True,autoincrement=True,comment='主键')
    session_id: Mapped[int] = mapped_column(Integer, nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    create_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    def __repr__(self):
        return f"<AiMessage(id={self.id}, session_id={self.session_id}, role={self.role}, content={self.content}, create_time={self.create_time})>"

if __name__ == '__main__':
    # 操作数据库之前,需要先创建一个会话,在当前会话中操作数据库
    with Session(engine) as session:

        #一:查询表中所有的字段
        #构建查询语句   ==   #select * from ai_message
        s1 = select(AiMessage)
        #执行查询语句
        result = session.execute(s1).all() #查询数据之后,将每一条数据封装到一个个元组中,元组中的第一个数据,才是需要的对象数据
        #遍历查询到的结果
        for r in result:
            print(r[0])

        result = session.execute(s1).scalars().all()   #将查询的每一条数据封装到元组中,使用scalars可以提取第一个数据
        for e in result:
            print(e)

        #二:查询表中部分字段
        s2 = select(AiMessage.role,AiMessage.content)  #select role,content from ai_message
        result = session.execute(s2).all()     #查询数据之后,将每一条数据封装到一个个元组中,因为查询的是两个字段值,所以每一个元组有两个字段对应的值
        for r in result:
            print(r[0],r[1])
            
        (user,你好)   =>    {"role":"user","content":"你好"}
        (user,我很好)
        (role,content)
        
            

        result = session.execute(s2).mappings().all()#查询数据之后,将每一条数据封装到一个字典中
        for e in result:
            print(e.get("role"),e.get("content"))  #因为每一条数据放在一个字典中,字典的key为字段名,值为字段对应的值
```

> [!tip] 提示
> - `select()` 函数是`SQLALchemy`中构建SQL中`select`语句的核心函数，用于以Python代码的方式构建`select`查询语句，最终生成对应的SQL语句并执行。
> - `select(AiMessage)` -----> 生成的SQL： `SELECT id, session_id, role, content, create_time FROM ai_message`
> - **注意：select函数是SQLALchemy提供的，要使用需要import导入进来。**

`scalars()` 和 `mappings()` 是 SQLAlchemy 中用于控制查询结果格式的两个重要方法。

- `scalars()`：将查询结果扁平化（返回一个标量值），直接返回单个列的值（将其封装成一个一个的AiMessage对象），而不是包含整行的 Row 对象。
  - 使用场景：
    - 查询单个字段时，想要直接获取字段值列表
    - 查询 ORM 对象时，想要直接获取对象列表而不是 Row 包裹

- `mappings()`：将查询结果的每一行转换为字典（实际上是 RowMapping 对象），可以通过列名访问数据。
  - 使用场景：需要以字典形式处理数据（如返回 JSON 响应）

### 条件查询

**查询格式：**

![](./static/day12-Python-AI应用实战%28SQLAlchemy%29-cpvvanve.png)

**1). 单条件查询**

```python

if __name__ == '__main__':

    with Session(engine) as session:
        
        # 1. 条件查询 - 查询id为1的数据
        result = session.execute(select(AiMessage).where(AiMessage.id == 1)).scalars().one()
        print(result)

        # 2. 条件查询 - 查询content中包含 '好' 字的数据
        results = session.execute(select(AiMessage).where(AiMessage.content.like('%好%'))).scalars().all()
        for message in results:
            print(message)
```

> [!tip] 提示
> `where()` 方法是用来构建select之后的查询条件的，在构建查询条件时，依然采用面向对象的方式进行操作。

> [!tip] 提示
> - `one()`：如果查询返回只有一条数据，可以直接调用one，查询返回的就是单个对象。
> - `all()`：如果查询返回的结果有多条数据，则需要调用all，查询返回的多条数据会封装到一个列表中。

**2). 多条件查询（and）**

```python

if __name__ == '__main__':

    with Session(engine) as session:
        
        # 条件查询 - 查询 session_id 为1 , 并且 role 为 'user' 的消息
        # 方式一: 默认多个条件就是and连接
        results = session.execute(select(AiMessage).where(AiMessage.session_id == 1, AiMessage.role == 'user')).scalars().all() 
        for message in results:
            print(message)
        
        # 方式二: 可以使用and_函数来组装多个条件
        results = session.execute(select(AiMessage).where(and_(AiMessage.session_id == 1, AiMessage.role == 'user'))).scalars().all()  
        for message in results:
            print(message)
```

> [!danger] 
> **注意：**`and_` 这个函数是SQLAlchemy中提供的，要想使用需要先导入。 `from sqlalchemy import and_`

**3). 多条件查询（or）**

```python
if __name__ == '__main__':
    
    with Session(engine) as session:
        
        #  条件查询 - 查询 id 为8 , 或者 role 为 'user' 的消息
        results = session.execute(select(AiMessage).where(or_(AiMessage.session_id == 1, AiMessage.role == 'user'))).scalars().all() 
        for message in results:
            print(message)
```

> [!danger] 
> **注意：**`or_ `这个函数是SQLAlchemy中提供的，要想使用需要先导入。`from sqlalchemy import and_, or_`

### 排序查询

**使用函数**： `order_by(排序字段.排序方式)`

```sql
if __name__ == '__main__':
    # 操作数据库之前,需要先创建一个会话,在当前会话中操作数据库
    with Session(engine) as session:
        #查询所有的数据,要求按照创建时间降序查询 :select * from ai_message order by create_time desc
        #如果需要排序查询,使用order_by来指定(方法中,指定排序的字段以及规则,多个排序条件之间使用逗号分隔)
        s1 = select(AiMessage).order_by(AiMessage.create_time.desc(),AiMessage.id.desc())
        result = session.execute(s1).scalars().all()
        for e in result:
            print(e)
```

### 分页查询

分页查询，我们需要调用两个**函数** ：

- `offset` 指定起始位置（偏移量）

- `limit` 指定每页展示记录数

```sql
if __name__ == '__main__':
    # 操作数据库之前,需要先创建一个会话,在当前会话中操作数据库
    with Session(engine) as session:
        #查询数据,只要前两个数据  select * from ai_message limit 2    | limit 2,2
        # s1 = select(AiMessage).limit(2).offset(0)  # limit 2,2
        # s1 = select(AiMessage).limit(2)  # limit 2
        #如果需要分页查询,使用limit方法指定查询几条,使用offset指定从哪一个索引开始查询
        s1 = select(AiMessage).limit(4).offset(2)   #limit 2,4
        result = session.execute(s1).scalars().all()
        for e in result:
            print(e)
```

## 修改

**修改格式：**

![](./static/day12-Python-AI应用实战%28SQLAlchemy%29-c2v87nDh.png)

**方式一代码：**

```python
if __name__ == '__main__':
    
    with Session(engine) as session:
        # 5. 修改操作 - 更新id为1的消息，将内容更新为 "你好"
        # 关键字传参, 一个参数一个参数传递     update 表名  set content = "你好"  where id  = 1 
        session.execute(update(AiMessage).where(AiMessage.id == 1).values(content="你好", create_time=datetime.now()))
        
        # 位置参数, 直接将要更新的字段值, 以字典形式传递
        session.execute(update(AiMessage).where(AiMessage.id == 3).values({'content': 'Hello', 'create_time': datetime.now()}))
        session.commit()
```

> [!tip] 提示
> **场景：**适用于根据条件，批量更新数据时使用。（只操作一次数据库，性能更高）

**方式二代码：**

```python
if __name__ == '__main__':
    
    with Session(engine) as session:
       #方式二 :先将需要修改的数据查询出来,然后重新赋值
        # s1 = select(AiMessage).where(AiMessage.id == 1)
        # result = session.execute(s1).scalars().one()
        result = session.get(AiMessage,1)
        
        
        
        
        result.content = "大家下午好3333"
        result.create_time = datetime.now()
        session.commit()
```

> [!tip] 提示
> **场景：**单条记录的根据主键更新。（需要查询一次数据库，更新一次数据库，两次操作，性能较低）

## 删除

**使用格式**：

![](./static/day12-Python-AI应用实战%28SQLAlchemy%29-cCUTRnub.png)

**1). 根据id删除单条记录**

```python
if __name__ == '__main__':
    
    with Session(engine) as session:
        # 6. 删除操作 --> 需求: 删除id为10的数据
        session.execute(delete(AiMessage).where(AiMessage.id == 10))
        session.commit()
```

**2). 根据id批量删除**

```python
if __name__ == '__main__':
    # 操作数据库之前,需要先创建一个会话,在当前会话中操作数据库
    with Session(engine) as session:

        #删除id为7 或者 为11的
        # delete(AiMessage).where(or_(AiMessage.id == 7, AiMessage.id == 11))
        d1 = delete(AiMessage).where(AiMessage.id.in_([7,11]))
        session.execute(d1)
        session.commit()
```

# SQLAlchemy案例优化

## 准备工作

1). 在MySQL数据库中创建项目数据库（`ai_partner_db`）及表结构

```sql
create table ai_preset (
  id int primary key auto_increment comment '主键',
  name varchar(50) not null comment '预设名称',
  nick_name varchar(50) not null comment '伴侣昵称',
  nature varchar(500) not null comment '伴侣性格描述',
  sort_order int not null comment '排序顺序',
  create_time datetime not null comment '创建时间'
) comment '伴侣信息预设表';

insert into ai_preset values (1,'东北甜妹','小甜甜','活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心',1,'2026-05-22 22:32:29'),
                               (2,'温柔御姐','诗涵','温柔体贴的南方姑娘，知性优雅，说话轻声细语，善解人意，很会照顾人',2,'2026-05-22 22:32:29'),
                               (3,'傲娇萝莉','萌萌','傲娇又可爱的小萝莉，嘴硬心软，喜欢撒娇卖萌，偶尔会闹点小脾气',3,'2026-05-22 22:32:29'),
                               (4,'霸道总裁','皓辰','高冷霸道的霸道总裁，说话简洁有力，带有占有欲，偶尔会展现温柔的一面',4,'2026-05-22 22:32:29'),
                               (5,'阳光暖男','阳阳','阳光开朗的大男孩，幽默风趣，喜欢运动，充满正能量，总能让人开心',5,'2026-05-22 22:32:29'),
                               (6,'知性姐姐','雅琴','成熟知性的大姐姐，阅历丰富，善于倾听，能给你很好的建议和安慰',6,'2026-05-22 22:32:29'),
                               (7,'痞帅少年','小宇','有点痞帅的少年，爱开玩笑，有点小坏但心地善良，喜欢逗你开心',7,'2026-05-22 22:32:29'),
                               (8,'古风美人','若曦','温柔婉约的古风美人，谈吐优雅，喜欢诗词歌赋，充满古典韵味',8,'2026-05-22 22:32:29'),
                               (9,'理工直男','阿杰','理性耿直的理工男，说话直接，逻辑清晰，虽然有点木讷但很真诚',9,'2026-05-22 22:32:29'),
                               (10,'甜酷女孩','酷儿','又甜又酷的女孩，外表酷炫内心柔软，喜欢新鲜事物，个性十足',10,'2026-05-22 22:32:29');

create table ai_session (
  id int primary key auto_increment comment '主键',
  session_name varchar(50) not null comment '会话名称',
  nick_name varchar(50) not null comment '伴侣昵称',
  nature varchar(500) not null comment '伴侣性格',
  create_time datetime not null comment '创建时间',
  update_time datetime not null comment '更新时间'
) comment '会话信息表';

INSERT INTO ai_session VALUES (1,'2026-05-22_22-36-30','小甜甜','活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心','2026-05-22 22:36:30','2026-05-22 22:48:40'),
                              (2,'2026-05-22_22-48-41','小甜甜','活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心','2026-05-22 22:48:42','2026-05-22 22:49:07'),
                              (3,'2026-06-19_16-39-44','小甜甜','活泼开朗的东北姑娘，说话直爽，爱唠嗑，带点大碴子味儿，特别热情暖心','2026-06-19 16:39:44','2026-06-19 16:39:44');

create table ai_message (
  id int primary key auto_increment comment '主键',
  session_id int not null comment '会话id',
  role varchar(20)  not null comment '消息角色：user-用户，assistant-ai',
  content varchar(500)not null comment '消息内容',
  create_time datetime not null comment '创建时间'
) comment '交互消息表';

INSERT INTO `ai_message` VALUES (1,1,'user','你好','2026-05-22 22:47:58'),
    (2,1,'assistant','哎呀！你可算来了，我都想死你啦！今天咋样，吃没吃好饭呀？','2026-05-22 22:47:58'),
    (3,1,'user','有呢','2026-05-22 22:48:18'),
    (4,1,'assistant','那就好那就好！我可担心你一天光顾着忙活，把吃饭这事给忘了。对了对了，我今儿包了饺子，猪肉大葱的，明儿给你送点儿去呗？','2026-05-22 22:48:18'),
    (5,1,'user','不用了,不爱吃','2026-05-22 22:48:29'),
    (6,1,'assistant','哎呦喂，咋又不爱吃了呢？上回你不是还说挺香的吗？得得得，那你想吃啥直说，姐给你安排！我这儿最近新学了道红烧排骨，可香了！','2026-05-22 22:48:29'),
    (7,1,'user','行吧, 那就排骨吧','2026-05-22 22:48:40'),
    (8,1,'assistant','好嘞！包在我身上！明天一准儿给你送过去，保准让你吃了直呼过瘾！你爱吃甜口还是咸口？我给你整得恰到好处！','2026-05-22 22:48:40'),
    (9,2,'user','你好, 在吗?','2026-05-22 22:48:48'),
    (10,2,'assistant','在呢在呢！想我啦？嘿嘿我刚吃完晚饭，正刷手机呢～你吃了吗？','2026-05-22 22:48:48'),
    (11,2,'user','是的呢','2026-05-22 22:48:53'),
    (12,2,'assistant','哎呦喂，你一说想我我都不好意思了！那啥，要不咱俩出去溜达溜达？今儿个月亮老圆了🌸','2026-05-22 22:48:53'),
    (13,2,'user','去呀,去哪儿呢','2026-05-22 22:49:04'),
    (14,2,'assistant','走走走，去咱常去那个小公园呗！那儿的烧烤摊老板今儿个给我发微信说进了新品种的小龙虾，老好吃了！我请客！','2026-05-22 22:49:04'),
    (15,2,'user','好的.','2026-05-22 22:49:07'),
    (16,2,'assistant','那咱赶紧收拾收拾，你在楼下等我啊！我换件衣裳马上就下来～晚上风大，你多穿点别感冒了，我可心疼了❤️','2026-05-22 22:49:07'),
    (17,3,'user','你好','2026-06-19 17:49:11'),
    (18,3,'assistant','诶呀，这不我家宝贝嘛！今儿个咋样？我正搁这儿琢磨晚上整啥好吃的呢！','2026-06-19 17:49:11'),
    (19,3,'user','烤鱼','2026-06-19 17:51:07'),
    (20,3,'assistant','哎妈呀，你这口味跟我一样儿一样儿的！我知道街角那家烤鱼店刚开张，味儿老正了，要不咱晚上去尝尝？','2026-06-19 17:51:08'),
    (21,3,'user','是吗','2026-06-19 17:57:54'),
    (22,3,'assistant','可不咋地！我昨儿个路过闻着那香味儿，馋得我差点儿没管住腿！去不去？保证不让你后悔！','2026-06-19 17:57:54');
```

2). 在 《AI智能伴侣》项目中，引入资料中的`db.py`（配置SQLAlchemy的基本信息）, 代码如下（直接引入进来）

```python
from datetime import datetime
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

# 1. 创建引擎(支持异步操作)
engine = create_async_engine("mysql+aiomysql://root:1234@localhost:3306/ai_partner_db", echo=True)

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
```

> [!danger] 
> **注意：**将 db.py 文件引入项目后，需要将里面配置的数据库的用户名、密码、数据库的名字改为自己的。

> [!tip] 提示
> **异步操作说明：**
>
> 在项目中，我们操作数据库，对数据库中的数据进行增删改查操作，可能是比较耗时的，为了提高程序的处理效率，这里我们会采用异步操作。
>
> 入门程序中，我们使用的 `pymysql` 驱动，`create_engine` 创建引擎的函数，这些都是一些同步操作。 如果需要支持异步操作，这里就需要将 `pymysql` 换成 `aiomysql`，`create_engine` 换成 `create_async_engine`。
>
> **会话工厂说明：**
>
> 在讲解SQLALchemy的基本操作的时候，我们都是用到会话对象Session，直接基于 `Session(engine)` 实例化一个Session对象，每次用到就来实例化。 在项目中，我们推荐基于SQLALchemy提供的会话工厂来创建Session，可以通过 `session_factory = async_sessionmaker(engine)` 获取到会话工厂，要获取Session，直接从会话工厂中获取Session即可。（预配置，无需重复传参，可以统一配置管理所有会话）

3). 执行如下命令，安装mysql的异步操作客户端依赖

```python
uv add aiomysql cryptography
```

## 代码优化

### 加载预设伴侣列表

- 获取Session

- 基于Session操作数据库，执行查询操作

- 关闭Session

```python
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

> [!tip] 提示
> **注意：**在进行异步编程时，`await session.execute(select(AiPreset).order_by(AiPreset.sort_order.asc())).scalars().all()` 不可以直接调用 .scalars().all() 直接获取结果。
>
> 因为这里是异步操作，`await` 只作用于紧跟它后面的第一个表达式，而不是整条链式调用。而session.execute 方法执行完毕后的结果是一个协程对象，协程对象是没有 scalars方法的。
>
> 因此，我们需要等待该协程执行完毕后，拿到运行结果，然后再调用 `.scalars().all()` 方法。

### 创建会话

**创建会话改造：**

```python
@app.post("/api/sessions")
async def create_session(request:CreateSessionRequest): #定义一个参数,来接收前端请求的数据
    logging.info("新建一个会话~")

    #以当前时间来表示文件的名称(会话名称)
    session_name = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    #获取会话
    session = session_factory()
    #构建存储的会话信息
    ai_session = AiSession(session_name=session_name,nick_name=request.nick_name,
                           nature=request.nature,create_time=datetime.now(),update_time=datetime.now())
    #使用会话的add方法添加数据到表中
    session.add(ai_session)
    #提交会话
    await session.commit()
    #关闭会话
    await session.close()

    #响应结果:会话名,状态码,提示信息
    return ApiResponse(code=200,message="新建会话成功",data=session_name)
```

### 获取会话列表

**会话列表改造：**

```python
@app.get("/api/sessions")
async def get_seesion_list():
    logging.info("获取会话列表")
    # 要获取所有的会话名，响应给前端做展示

    #从会话表中,获取所有会话的会话名,响应给前端
    #获取会话
    session = session_factory()
    #构建查询语句,只需要查询会话名即可,也需要以会话名降序排列
    #执行查询语句
    ai_session_names = await session.execute(select(AiSession.session_name).order_by(AiSession.session_name.desc()))
    #提取查询的结果
    result = ai_session_names.scalars().all()
    #关闭会话
    await session.close()
    #响应数据
    return ApiResponse(code=200,message="会话列表查询成功",data=result)
```

### 加载指定会话

**指定会话改造：**

```python
@app.get("/api/sessions/{session_name}",summary="获取单个会话数据")
async def get_session_by_name(session_name: str):
    logging.info("加载指定会话,会话名%s",session_name)
    session = db.session_factory()
    s1 = select(db.AiSession).where(db.AiSession.session_name == session_name)
    result = await session.execute(s1)
    result = result.scalars().one()

    s2 = select(db.AiMessage).where(db.AiMessage.session_id == result.id)
    result2 = await session.execute(s2)
    result2 = result2.scalars().all()

    messages_list = []
    for e in result2:
        messages_list.append({"role": e.role, "content": e.content})
        
    session_data = {
        "session_name": result.session_name,
        "nick_name": result.nick_name,
        "nature": result.nature,
        "messages": messages_list
    }
    await session.close()

    return ApiReponse(code=200,message="会话数据获取成功",data=session_data)
```

### 删除会话

在删除会话时，需要删除两部分数据：既需要删除该会话对应的所有的消息数据，还需要删除该会话数据 。

```python
@app.delete("/api/sessions/{session_name}")
async def delete_session(session_name: str,request:Request):

    logging.info("删除指定会话")
    logging.info(f"删除指定会话, 请求路径: {request.url}, 请求方法: {request.method}")

    #要删除session表中的会话数据, 以及message表中存储的会话对话信息
    session = session_factory()
    
    #删除message表中的数据,需要使用会话id来删除,所以需要先根据会话名称查询会话id(要删除对应会话中的消息数据)
    s1 = select(AiSession.id).where(AiSession.session_name == session_name)
    result = await session.execute(s1)
    session_id = result.scalars().one()

    #构建删除session表的语句
    d1 = delete(AiSession).where(AiSession.session_name == session_name)
    #构建删除message表的语句
    d2 = delete(AiMessage).where(AiMessage.session_id == session_id)

    #执行删除语句
    await session.execute(d1)
    await session.execute(d2)
    #提交会话
    await session.commit()
    #关闭会话
    await session.close()

    return ApiResponse(code=200,message="删除成功")
```

### 3.2.7 与AI交互

```python
@app.post("/api/chat")
async def chat(request:ChatRequest):
    logging.info("接收用户消息成功~")
    session = session_factory()
    #构建提示词模板
    sys_temp = SYSTEM_PROMPT_TEMPLATE % (request.nick_name, request.nature)

    #读取当前会话中的内容,将用户发送的消息,存储到message表中
    #存储聊天信息,首先需要知道该信息属于哪一次会话,所以需要会话id
    ai_session = await session.execute(select(AiSession).where(AiSession.session_name == request.session_name))
    ai_session2 = ai_session.scalars().one()

    #构建存储消息的语句
    session.add(AiMessage(session_id=ai_session2.id,role="user",content=request.message,create_time=datetime.now()))

    #构建查询该会话所有聊天消息的语句
    s1 = select(AiMessage).where(AiMessage.session_id == ai_session2.id)
    ai_message = await session.execute(s1)
    ai_message2 = ai_message.scalars().all()

    #构建完整的历史信息,让大模型拥有会话记忆的功能
    send_messages = [{"role": "system", "content": sys_temp}]
    for s in ai_message2:
        send_messages.append({"role": s.role, "content": s.content})

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

    #将大模型回复的结果，存储到表中
    session.add(AiMessage(session_id=ai_session2.id,role="assistant",content=result,create_time=datetime.now()))# type: ignore

    #将最新的伴侣性格,昵称更新到会话表中
    ai_session2.nick_name = request.nick_name
    ai_session2.nature = request.nature

    #提交
    await session.commit()
    #关闭会话
    await session.close()
    return ApiResponse(code=200,message="回复成功",data=result)
```