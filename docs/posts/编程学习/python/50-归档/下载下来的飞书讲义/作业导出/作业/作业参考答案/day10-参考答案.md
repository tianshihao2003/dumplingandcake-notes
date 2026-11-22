---
title: "day10-参考答案"
node_token: XQKwwk4KPiiVmhkavt7ccJHDnjg
obj_token: JDfbdCnQGoL4TWx2NBacy0POnTR
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/XQKwwk4KPiiVmhkavt7ccJHDnjg
edited_at: "1786326349"
exported_at: "2026-11-21T13:24:21.994Z"
cover: false
date: 2026-11-21
---
```sql
-- ==========================================
-- SQL 建表语句作业题（共 3 题）
-- 考察知识点：主键、自增、非空、唯一、默认值、注释
-- ==========================================

-- 第 1 题：学生表 student
-- 需求：
--   1. id          唯一标识，整型，主键，自增
--   2. stu_no      学号，字符串（最长 20），非空 且 唯一
--   3. name        姓名，字符串（最长 20），非空
--   4. age         年龄，整型，可为空
--   5. gender      性别，固定长度 1 个字符，默认值 '男'
--   6. class_name  班级，字符串（最长 30），非空
--   7. phone       手机号，字符串（最长 11），唯一
--   8. 表注释：'学生表'

create table student(
    id int primary key auto_increment comment '唯一标识',
    stu_no varchar(20) not null unique comment '学号',
    name varchar(20) not null comment '姓名',
    age tinyint comment '年龄',
    gender char(1) default '男' comment '性别',
    class_name varchar(30) not null comment '班级',
    phone varchar(11) unique comment '手机号'
) comment '学生表';

-- 第 2 题：员工表 employee
-- 需求：
--   1. id          唯一标识，整型，主键，自增
--   2. emp_no      工号，字符串（最长 20），非空 且 唯一
--   3. name        姓名，字符串（最长 20），非空
--   4. gender      性别，固定长度 1 个字符，默认值 '男'
--   5. department  部门，字符串（最长 30），非空，默认值 '未分配'
--   6. position    职位，字符串（最长 30），非空
--   7. hire_date   入职日期，可为空
--   8. salary      薪资（单位：元，整型），可为空
--   9. status      在职状态，字符串（最长 10），默认值 '在职'
--   10. email      邮箱，字符串（最长 50），唯一
--   11. phone      手机号，字符串（最长 11），唯一
--   12. 表注释：'员工表'

create table employee(
    id int primary key auto_increment comment '唯一标识',
    emp_no varchar(20) not null unique comment '工号',
    name varchar(20) not null comment '姓名',
    gender char(1) default '男' comment '性别',
    department varchar(30) not null default '未分配' comment '部门',
    position varchar(30) not null comment '职位',
    hire_date date comment '入职日期',
    salary int comment '薪资(单位：元)',
    status varchar(10) default '在职' comment '在职状态',
    email varchar(50) unique comment '邮箱',
    phone varchar(11) unique comment '手机号'
) comment '员工表';

-- 第 3 题：图书表 book
-- 需求：
--   1. id              唯一标识，整型，主键，自增
--   2. isbn            ISBN 编号，字符串（最长 20），非空 且 唯一
--   3. title           书名，字符串（最长 100），非空
--   4. author          作者，字符串（最长 30），非空
--   5. publisher       出版社，字符串（最长 50），非空
--   6. publish_date    出版日期，可为空
--   7. category        分类，字符串（最长 20），默认值 '其他'
--   8. pages           页数，整型，可为空
--   9. price           价格（单位：分，整型存储），可为空
--   10. stock          库存数量，整型，默认值 0
--   11. borrowed_count 借阅次数，整型，默认值 0
--   12. status         状态，字符串（最长 10），默认值 '在馆'
--   13. location       书架位置，字符串（最长 30），可为空
--   14. remark         备注，字符串（最长 200），可为空
--   15. 表注释：'图书表'

create table book(
    id int primary key auto_increment comment '唯一标识',
    isbn varchar(20) not null unique comment 'ISBN编号',
    title varchar(100) not null comment '书名',
    author varchar(30) not null comment '作者',
    publisher varchar(50) not null comment '出版社',
    publish_date date comment '出版日期',
    category varchar(20) default '其他' comment '分类',
    pages int comment '页数',
    price int comment '价格（单位：分）',
    stock int default 0 comment '库存数量',
    borrowed_count int default 0 comment '借阅次数',
    status varchar(10) default '在馆' comment '状态',
    location varchar(30) comment '书架位置',
    remark varchar(200) comment '备注'
) comment '图书表';
```