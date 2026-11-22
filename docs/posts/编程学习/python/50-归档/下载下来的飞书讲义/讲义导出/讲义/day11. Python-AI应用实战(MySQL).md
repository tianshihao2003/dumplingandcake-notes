---
title: "day11. Python-AI应用实战(MySQL)"
node_token: NVU6wkufOirBuVkAjSRchx6un5d
obj_token: T4KbdjHiToqayGxMu1RcjmehnKe
obj_type: docx
space_id: ""
url: https://ocn0tgqr5oz2.feishu.cn/wiki/NVU6wkufOirBuVkAjSRchx6un5d
edited_at: "1794726044"
exported_at: "2026-11-21T13:24:00.094Z"
cover: false
date: 2026-11-21
---
# 1.DDL语句

##### 数据类型

MySQL中的数据类型有很多，主要分为三类：数值类型、字符串类型、日期时间类型。

**1). 数值类型**

> 内嵌电子表格（v1 不转换），token: HXRtsH2Ash8CJutQAMCcyfXmnju_pzUaeX

- 示例:

```sql
-- 年龄字段 ---不会出现负数, 而且人的年龄不会太大
   age tinyint unsigned

-- 分数 ---总分100分, 最多出现一位小数
   score decimal(4,1)
```

**2). 字符串类型**

> 内嵌电子表格（v1 不转换），token: HXRtsH2Ash8CJutQAMCcyfXmnju_4iwJ95

**char和varchar区别:**
char是定长字符串，指定长度多长，就占用多少个字符

varchar是变长字符串，指定的长度为最大占用长度

> [!warning] 警告
> 将来定义字符串类型时,如果字段值的长度是固定的使用char
>
>                                如果长度不固定,就使用varchar

```sql
示例： 
    用户名 username ---长度不定, 最长不会超过50
    username varchar(50)
    
    手机号 phone ---固定长度为11
    phone char(11)
```

**3). 日期时间类型**

> 内嵌电子表格（v1 不转换），token: HXRtsH2Ash8CJutQAMCcyfXmnju_DZmiYH

```sql
示例: 
    生日字段  birthday ---生日只需要年月日  
    birthday date
    
    创建时间 createtime --- 需要精确到时分秒
    createtime  datetime
```

##### 表操作-其他操作

- 查询数据库表的具体的语法：

```sql
-- 查询当前数据库的所有表
show tables;

-- 查看指定的表结构
desc 表名 ;   -- 可以查看指定表的字段、字段的类型、是否可以为NULL、是否存在默认值等信息

-- 查询指定表的建表语句
show create table 表名 ;
```

- 修改数据库表结构的具体语法：

添加字段

```sql
-- 添加字段
alter table 表名 add  字段名  类型(长度)  [comment 注释]  [约束];

-- 比如：  为employee表添加字段, 字段信息: phone varchar(11), 备注 手机号
alter table employee add phone varchar(11) comment '手机号';
```

修改字段

```sql
-- 修改字段类型
alter table 表名 modify  字段名  新数据类型(长度);

-- 比如： 为employee表修改字段, 将 phone 字段修改为 phone char(11) 类型, 备注 手机号
alter table employee modify phone char(11) comment '手机号';
```

```sql
-- 修改字段名，字段类型
alter table 表名 change  旧字段名  新字段名  类型(长度)  [comment 注释]  [约束];

-- 比如： 为employee表修改字段, 将 phone 字段名修改为 mobile, 类型 char(11), 备注 手机号
alter table employee change phone mobile char(11) comment '手机号';
```

删除字段

```sql
-- 删除字段
alter table 表名 drop 字段名;

-- 比如： 删除employee表中的 mobile字段
alter table employee drop mobile;
```

修改表名

```sql
-- 修改表名
rename table 表名 to  新表名;

-- 比如: 将employee表名改为 emp
rename table employee to emp;
```

删除表结构

```sql
-- 删除表
drop  table [ if exists ]  表名;

-- 比如：如果employee 表存在，则删除employee 表
drop table if exists employee ;  -- 在删除表时，表中的全部数据也会被删除。
```

> [!tip] 📌
> **关于表结构的查看、修改、删除操作，工作中一般都是直接基于图形化界面操作。 **

# DML语句

DML英文全称是Data Manipulation Language(数据操作语言)，用来对数据库中表的数据记录进行增、删、改操作。

- 添加数据（INSERT）

- 修改数据（UPDATE）

- 删除数据（DELETE）

**数据库表准备：**

```sql
-- 员工表
create table `employee` (
  `id` int unsigned primary key auto_increment comment '主键',
  `name` varchar(10) not null comment '姓名',
  `gender` tinyint unsigned not null comment '性别, 1:男, 2:女',
  `job` tinyint unsigned comment '职位, 1:班主任, 2:讲师, 3:学工主管, 4:教研主管, 5:咨询师',
  `salary` int unsigned not null comment '薪资',
  `entry_date` date comment '入职日期',
  `create_time` datetime comment '创建时间',
  `update_time` datetime comment '更新时间'
)  comment '员工信息表';
```

## 增加(insert)

### **语法**

- 向指定字段添加数据

```sql
insert into 表名 (字段名1, 字段名2) values (值1, 值2);
```

- 全部字段添加数据

```sql
insert into 表名 values (值1, 值2, ...);
```

- 批量添加数据（指定字段）

```sql
insert into 表名 (字段名1, 字段名2) values (值1, 值2), (值1, 值2);
```

- 批量添加数据（全部字段）

```sql
insert into 表名 values (值1, 值2, ...), (值1, 值2, ...);
```

### 案例演示

- 案例1：*为 employee 表的 name, gender, job, salary字段插入值*

```sql
-- 1. 为 emp 表的 name, gender, job, salary字段插入值
insert into employee(name, gender, job, salary) values('张三', 1, 1, 5000);
```

- 案例2：*为 employee 表的 所有字段插入值*

```sql
-- 2. 为 emp 表的 所有字段插入值
insert into employee(id, name, gender, job, salary, entry_date, create_time, update_time) VALUES (null, '李四', 1, 1, 5000, '2023-01-01', now(), now());
insert into employee values (null, '花千骨', 1, 1, 5800, '2025-01-01', now(), now());
```

> [!tip] 提示
> **说明**: now() 是mysql数据库中的函数, 是用来获取当前系统时间的

- 案例3：*批量为 emp 表的 name, gender, job, salary字段插入数据*

```sql
insert into employee(name, gender, job, salary) values
    ('窦燕山', 1, 1, 5000),
    ('霍元甲', 1, 1, 5500),
    ('钟武迪', 1, 1, 6000);
```

> [!danger] 📌
> **insert操作的注意事项：**
>
> 1. 插入数据时，指定的字段顺序需要与值的顺序是一一对应的。
> 2. 字符串和日期型数据应该包含在引号中。
> 3. 插入的数据大小，应该在字段的规定范围内。

## 修改(update)

### 语法

```sql
update 表名 set 字段名1 = 值1 , 字段名2 = 值2 , .... [where 条件] ;
```

### 案例演示

- 案例1：*将 employee 表的ID为1的员工 姓名更新为 '张三丰', 性别更新为男;*

```sql
update employee set name = '张三丰', gender = 1, update_time=now() where id = 1;
```

- 案例2：*将 emp 表的所有员工的入职日期更新为 '2010-01-01'*

```sql
update employee set entry_date='2010-01-01', update_time=now();
```

- 案例3： 将 employee 表的所有员工, 每人涨薪500

```
update employee set salary = salary + 5000, update_time = now();
```

> [!danger] 📌
> **注意事项:**
>
> 1. 修改语句的条件可以有，也可以没有，如果没有条件，则会修改整张表的所有数据。
> 2. 在修改数据时，一般需要同时修改公共字段update_time，将其修改为当前操作时间。

## 删除(delete)

### 语法

```sql
delete from 表名  [where  条件] ;
```

### 案例演示

- 案例1：删除emp表中id为1的员工

```sql
delete from employee where id = 1;
```

- 案例2：删除employee表中所有员工

```sql
delete from employee ;
```

> [!danger] 📌
> **注意事项:**
>
> - DELETE 语句的条件可以有，也可以没有，如果没有条件，则会删除整张表的所有数据。
> - DELETE 语句不能删除某一个字段的值(可以使用UPDATE，将该字段值置为NULL即可)。
> - 当进行删除全部数据操作时，如果提示询问是否确认删除所有数据，直接点击Execute即可。

# DQL语句

## 介绍

DQL英文全称是Data Query Language(数据查询语言)，用来查询数据库表中的记录。

查询关键字：**SELECT**

![](./static/day11-Python-AI应用实战%28MySQL%29-cKhbRnSf.png)

## 语法

DQL查询语句，语法结构如下：

```sql
SELECT
        字段列表
FROM
        表名列表
WHERE
        条件列表
GROUP  BY
        分组字段列表
HAVING
        分组后条件列表
ORDER BY
        排序字段列表
LIMIT
        分页参数
```

拆分学习：

- 基本查询（不带任何条件）

- 条件查询（where）

- 分组查询（group by）

- 排序查询（order by）

- 分页查询（limit）

测试数据：

```sql
-- 员工表
create table employee (
  id int unsigned primary key auto_increment comment '主键',
  name varchar(10) not null comment '姓名',
  gender tinyint unsigned not null comment '性别, 1:男, 2:女',
  job tinyint unsigned comment '职位, 1:班主任, 2:讲师, 3:学工主管, 4:教研主管, 5:咨询师',
  salary int unsigned not null comment '薪资',
  entry_date date comment '入职日期',
  create_time datetime comment '创建时间',
  update_time datetime comment '更新时间'
)  comment '员工信息表';

INSERT INTO employee (id, name, gender, job, salary, entry_date, create_time, update_time) VALUES
       (1,'夫子',1,4,30000,'2005-08-19','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (2,'颜瑟',1,3,18000,'2010-03-22','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (3,'君陌',1,2,22000,'2015-09-01','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (4,'李慢慢',1,2,17000,'2018-12-25','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (5,'叶红鱼',2,2,21000,'2013-07-14','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (6,'柳白',1,2,13000,'2021-04-17','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (7,'余帘',2,2,14500,'2020-10-31','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (8,'宁缺',1,1,6800,'2022-06-11','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (9,'李渔',2,1,4500,'2024-02-28','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (10,'唐小棠',2,1,6000,'2017-05-09','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (11,'陈皮皮',1,1,4700,'2025-01-15','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (12,'桑桑',2,5,8000,'2023-08-08','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (13,'莫山山',2,5,6500,'2020-10-31','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (14,'隆庆',1,5,5500,'2016-09-22','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (15,'夏侯',1,5,7500,'2011-12-12','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (16,'曲妮',2,5,6800,'2024-06-01','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (17,'何明池',1,5,6200,'2019-03-19','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (18,'陆晨迦',2,5,5800,'2015-09-01','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (19,'唐王',1,5,6800,'2022-07-07','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (20,'卫光明',1,2,19000,'2009-11-11','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (21,'朝小树',1,2,18500,'2020-05-05','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (22,'夏天',2,1,5500,'2014-08-16','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (23,'钟大俊',1,1,5500,'2015-09-01','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (24,'柯浩然',2,2,21000,'2023-01-01','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (25,'齐四',1,1,6500,'2018-10-10','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (26,'叶苏',1,5,5200,'2025-03-03','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (27,'七念',2,5,5500,'2015-06-18','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (28,'程立雪',2,5,6000,'2012-09-09','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (29,'观主',1,2,21000,'2007-07-07','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (30,'熊初墨',1,5,7000,'2024-04-04','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (31,'水珠儿',1,2,5000,'2019-09-23','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (32,'徐崇山',1,NULL,13000,'2021-12-25','2026-06-16 16:30:39','2026-06-16 16:30:39'),
       (33,'司徒依兰',2,NULL,22500,'2013-03-21','2026-06-16 16:30:39','2026-06-16 16:30:39');
```

### 基本查询

在基本查询的DQL语句中，不带任何的查询条件。

**语法如下：**

- 查询多个字段

```sql
select 字段1, 字段2, 字段3 from  表名;
```

- 查询所有字段（通配符）

```sql
select *  from  表名;
```

- 设置别名

```sql
select 字段1 [ as 别名1 ] , 字段2 [ as 别名2 ]  from  表名;
```

- 去除重复记录

```sql
select distinct 字段列表 from  表名;
```

**案例演示:**

- 案例1：查询指定字段 name，entry_date并返回

```sql
select name,entry_date from employee;
```

- 案例2：查询返回所有字段

```sql
select * from employee;
```

> [!tip] 📌
> * 号代表查询所有字段，在实际开发中尽量少用（不直观、影响效率）

- 案例3：查询所有员工的 name, entry_date，并起别名(name的别名为姓名、entry_date的别名为入职日期)

```sql
-- 方式1：
select name AS 姓名, entry_date AS 入职日期 from employee;

-- 方式2： 别名中有特殊字符时，使用''或""包含
select name AS '姓 名', entry_date AS '入职日期' from employee;

-- 方式3：
select name AS "姓名", entry_date AS "入职日期" from employee;
```

- 案例4：查询已有的员工关联了哪几种职位(不要重复)

```sql
select distinct job from employee;
```

### 条件查询

**语法：**

```sql
select  字段列名  from   表名   where   条件列表 ; -- 条件列表：意味着可以有多个条件
```

学习条件查询就是学习条件的构建方式，而在SQL语句当中构造条件的运算符分为两类：

- 比较运算符

- 逻辑运算符

常用的比较运算符如下:

> 内嵌电子表格（v1 不转换），token: HXRtsH2Ash8CJutQAMCcyfXmnju_Sx8UrA

常用的逻辑运算符如下:

> 内嵌电子表格（v1 不转换），token: HXRtsH2Ash8CJutQAMCcyfXmnju_8wGUmM

- 案例1：查询 姓名 为 '莫山山' 的员工

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE name = '莫山山';
```

- 案例2：查询 薪资小于等于 5000 的员工信息

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE salary <= 5000;
```

- 案例3：查询 没有分配职位 的员工信息

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE job IS NULL;
```

> [!danger] 📌
> 注意：查询为NULL的数据时，不能使用 `= null` 或 `！=null` 。得使用 `is null` 或 `is not null`。

- 案例4：查询 有职位 的员工信息

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE job IS NOT NULL;
```

- 案例5：*查询 职位不是讲师 的员工信息*

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE job != 2;
```

- 案例6：*查询 入职日期 在 '2020-01-01' (包含) 到 '2025-01-01'(包含) 之间的员工信息*

```sql
-- 方式1：
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee 
where entry_date >= '2020-01-01' and entry_date <= '2025-01-01';

-- 方式2： between...and
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee 
WHERE entry_date BETWEEN '2020-01-01' AND '2025-01-01';
```

- 案例7：*查询 入职时间 在 '2020-01-01' (包含) 到 '2025-01-01'(包含) 之间 且 性别为女 的员工信息*

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee 
WHERE entry_date BETWEEN '2020-01-01' AND '2025-01-01' AND gender = 2;
```

- 案例8：查询 职位是 2 (讲师), 3 (学工主管), 4 (教研主管) 的员工信息

```sql
-- 方式1：使用or连接多个条件
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee 
where job=2 or job=3 or job=4;

-- 方式2：in关键字
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee 
where job in (2,3,4);
```

- 案例9：查询 姓名 为两个字的员工信息

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE name LIKE '__';
```

- 案例10：*查询 姓 '李' 的员工信息*

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE name LIKE '李%';
```

- 案例11：*查询 姓名中包含 '小' 的员工信息*

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee WHERE name LIKE '%小%';
```

### 聚合函数

常用聚合函数：

> 内嵌电子表格（v1 不转换），token: HXRtsH2Ash8CJutQAMCcyfXmnju_IYNx9e

> [!danger] 📌
> 注意 : 聚合函数会忽略空值，对NULL值不作为统计。

- count ：按照列去统计有多少行数据。
  - 在根据指定的列统计的时候，如果这一列中有null的行，该行不会被统计在其中。

- sum ：计算指定列的数值和，如果不是数值类型，那么计算结果为0

- max ：计算指定列的最大值

- min ：计算指定列的最小值

- avg ：计算指定列的平均值

**案例演示:**

- 案例1：统计该企业员工数量

```sql
-- count(字段)
select count(id) from employee ;-- 结果：30
select count(job) from employee ;-- 结果：29 （聚合函数对NULL值不做计算）

-- count(常量)
select count(0) from employee ;
select count('A') from employee ;

-- count(*)  推荐此写法（MySQL底层进行了优化）
select count(*) from employee ;
```

- 案例2：统计该企业员工的平均薪资

```sql
select avg(salary) from  employee ;
```

- 案例3：统计该企业员工的最低薪资

```sql
select min(salary) from employee ;
```

- 案例4：统计该企业员工的最高薪资

```sql
select max(salary) from employee ;
```

- 案例5：统计该企业每月要给员工发放的薪资总额(薪资之和)

```sql
select sum(salary) from employee ;
```

### 分组查询

- 分组： 按照某一列或者某几列，把相同的数据进行合并输出。
  - 分组其实就是按列进行分类(指定列下相同的数据归为一类)，然后可以对分类完的数据进行合并计算。
  - 分组查询通常会使用聚合函数进行计算。

**语法：**

```sql
select  字段列表  from  表名  [where 条件]  group by 分组字段名  [having 分组后过滤条件];
```

**案例演示：**

- 案例1：根据性别分组 , 统计男性和女性员工的数量

```sql
select gender, count(*)
from employee 

group by gender; -- 按照gender字段进行分组（gender字段下相同的数据归为一组）
```

- 案例2：查询入职时间在 '2015-01-01' (包含) 以前的员工 , 并对结果根据职位分组 , 获取员工数量大于等于2的职位

```sql
select job, count(*)
from employee 
where entry_date <= '2015-01-01'   -- 分组前条件
group by job                      -- 按照job字段分组
having count(*) >= 2;             -- 分组后条件

select job,count(*) from employee where emtry_date <= '2015-01-01' group by job having count(*) >=2
```

> [!danger] 📌
> **注意事项:**
>
> - 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义
> - 执行顺序：where > 聚合函数 > having

> [!tip] 📌
> **where与having区别（面试题）**
>
> - 执行时机不同：where是分组之前进行过滤，不满足where条件，不参与分组；而having是分组之后对结果进行过滤。
> - 判断条件不同：where不能对聚合函数进行判断，而having可以。

### 排序查询

排序在日常开发中是非常常见的一个操作，有升序排序，也有降序排序。

**语法：**

```sql
select  字段列表  
from   表名   
order  by  字段1  排序方式1 , 字段2  排序方式2 … ;
```

- 排序方式：
  - ASC ：升序（默认值）
  - DESC：降序

**案例演示：**

- 案例1：根据入职时间, 对员工进行升序排序

```sql
select id, name, gender, job, salary, entry_date, create_time, update_time
from employee 
order by entry_date ASC; -- 按照entrydate字段下的数据进行升序排序

select id, name, gender, job, salary, entry_date, create_time, update_time
from employee 
order by  entry_date; -- 默认就是ASC（升序）
```

> [!danger] 📌
> 注意事项：如果是升序, 可以不指定排序方式ASC

- 案例2：根据入职时间，对员工进行降序排序

```sql
select id, name, gender, job, salary, entry_date, create_time, update_time
from employee 
order by entry_date DESC; -- 按照entrydate字段下的数据进行降序排序
```

- 案例3：*根据 入职时间 对公司的员工进行 升序排序 ， 入职时间相同 , 再按照 薪资 进行降序排序*

```sql
SELECT id, name, gender, job, salary, entry_date, create_time, update_time FROM employee 
ORDER BY entry_date ASC, salary DESC;
```

> [!danger] 📌
> 注意事项：如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序

### 分页查询

分页操作在业务系统开发时，也是非常常见的一个功能，日常我们在网站中看到的各种各样的分页条，后台也都需要借助于数据库的分页操作。

![](./static/day11-Python-AI应用实战%28MySQL%29-cdvHfnPg.png)

分页查询语法：

```sql
select  字段列表  from  表名  limit  起始索引, 查询记录数 ;
```

- 案例1：从起始索引0开始查询员工数据, 每页展示5条记录

```sql
select id, name, gender, job, salary, entry_date, create_time, update_time 
from employee 
limit 0 , 5; -- 从索引0开始，向后取5条记录
```

- 案例2：查询 第1页 员工数据, 每页展示5条记录

```sql
select id, name, gender, job, salary, entry_date, create_time, update_time 
from employee 
limit 5; -- 如果查询的是第1页数据，起始索引可以省略，直接简写为：limit 条数
```

- 案例3：查询 第2页 员工数据, 每页展示5条记录

```sql
select id, name, gender, job, salary, entry_date, create_time, update_time 
from employee 
limit 5 , 5; -- 从索引5开始，向后取5条记录
```

- 案例4：查询 第3页 员工数据, 每页展示5条记录

```sql
select id, name, gender, job, salary, entry_date, create_time, update_time 
from employee 
limit 10 , 5; -- 从索引10开始，向后取5条记录
```

> [!danger] 📌
> **注意事项:**
>
> 1. 起始索引从0开始。计算公式 ：起始索引 = （查询页码 - 1）* 每页显示记录数
> 2. 分页查询是数据库的方言，不同的数据库有不同的实现，MySQL中是LIMIT
> 3. 如果查询的是第一页数据，起始索引可以省略，直接简写为 limit  条数

# 事务

**需求：**给ID为5, 6的员工调薪，薪资在当前薪资基础上增加2000元，同时记录员工表的操作日志 。日志表的表结构如下：

```sql
 -- 员工操作日志表
  create table employee_log (
    id int unsigned primary key auto_increment comment '主键',
    employee_id int unsigned not null comment '员工ID',
    operation varchar(20) not null comment '操作类型, insert/update/delete',
    note text comment '备注',
    create_time datetime comment '操作时间'
  ) comment '员工操作日志表'; 
```

**实现:**

```sql
-- 给ID为5, 6的员工调薪，薪资在当前薪资基础上增加2000元
update employee set salary = salary + 2000 , update_time = now() where id in (5,6);

-- 同时记录员工表的操作日志
INSERT INTO employee_log(employee_id, operation, note, create_time) VALUES (5, 'update', '涨薪2000元', now());
INSERT INTO employee_log(employee_id, operation, note, create_time) VALUES (6, 'update', '涨薪2000元', now());
```

## 介绍与操作

- **概念：事务** 是一组操作的集合，它是一个不可分割的工作单位。事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求，即这些操作 要么同时成功，要么同时失败。

> [!tip] 提示
> **默认MySQL的事务是自动提交的，也就是说，当执行一条DML语句，MySQL会立即隐式的提交事务。**

那如果想让这组操作同时成功，或者同时失败，则需要进行事务控制，具体操作分为三步：

- 开启事务：`start transaction` 或  `begin`

- 执行业务操作

- 提交事务 / 回滚事务：`commit` / `rollback` 【所有操作成功执行，则提交；如果有一项失败，则回滚事务】

具体操作如下：

```sql
-- 开启事务
start transaction ;

-- 给ID为5, 6的员工调薪，薪资在当前薪资基础上增加2000元
update employee set salary = salary + 2000 , update_time = now() where id in (5,6);

-- 同时记录员工表的操作日志
INSERT INTO employee_log(employee_id, operation, new_value, create_time) VALUES (5, 'update', '涨薪2000元', now());
INSERT INTO employee_log(employee_id, operation, new_value, create_time) VALUES (6, 'update', '涨薪2000元', now());

-- 提交 (全部成功)
commit ;

-- 回滚 (有任意一个操作失败)
rollback ;
```

**场景:**

- 银行转账

张三 给 李四 转账1000元

开始事务

张三的金额 - 1000

李四的金额 + 1000

都成功  提交事务

有一个失败，回滚

- 下单扣减库存

卖手机     库存 10

张三买一部手机

库存 - 1

## 四大特性

面试题：事务有哪些特性？

![](./static/day11-Python-AI应用实战%28MySQL%29-c8nNZnid.png)

> [!tip] 提示
> 事务的四大特性简称为：ACID

- **原子性（Atomicity）** ：原子性是指事务包装的一组sql是一个不可分割的工作单元，事务中的操作要么全部成功，要么全部失败。

- **隔离性（Isolation）**：多个用户并发的访问数据库时，一个用户的事务不能被其他用户的事务干扰，多个并发的事务之间要相互隔离。
  - 一个事务的成功或者失败对于其他的事务是没有影响。

张三余额1000元     李四余额为1000元   王五余额为1000元

事务A:    张三给王五转账200元       开启一个事务    张三  - 200       1000  + 200    提交事务  1200

事务B：  李四给王五转账200元       开启一个事务    李四  - 200       1000+ 200

- **持久性（Durability）**：一个事务一旦被提交或回滚，它对数据库的改变将是永久性的，哪怕数据库发生异常，重启之后数据亦然存在。

- **一致性（Consistency）**：一个事务完成之后数据都必须处于一致性状态。
  - 事务执行前后，数据必须满足业务约束

张三余额1000元     李四余额为1000元          2000元

张三给李四转账200元      1000  1000           2000元