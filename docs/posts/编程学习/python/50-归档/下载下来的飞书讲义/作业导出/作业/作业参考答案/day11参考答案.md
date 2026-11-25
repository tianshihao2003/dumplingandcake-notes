---
title: "day11参考答案"
node_token: PXYpwXif0izG8okbSnRcv5h1nU1
obj_token: QSvRd6YyZoEaOexdCcncHKDVnJd
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/PXYpwXif0izG8okbSnRcv5h1nU1
edited_at: "1795440292"
exported_at: "2026-11-24T12:38:52.316Z"
cover: false
date: 2026-11-24
---
```sql
-- 1. 插入数据, 员工信息：张明明，男，薪资12000，职位讲师
INSERT INTO emp(name, gender, job, salary) VALUES ('张明明',1,2,12000);

-- 2. 将id=5的员工薪资增加2000
UPDATE emp SET salary = salary + 2000 WHERE id = 5;

-- 3. 删除薪资低于4600的员工记录
DELETE FROM emp WHERE salary < 4600;

-- 4. 将所有咨询师（job=5）的薪资降低10%
UPDATE emp SET salary = salary * 0.9 WHERE job = 5;

-- 5. 将职位为NULL的员工的职位统一设置为班主任（job=1）
UPDATE emp SET job = 1 WHERE job IS NULL;

-- 6. 新增员工记录：王丽丽，女，薪资9800，职位班主任
INSERT INTO emp(name, gender, job, salary) VALUES ('王丽丽',2,1,9800);

-- 7. 将2015-01-01之前入职的员工薪资统一增加10%
UPDATE emp SET salary = salary * 1.1 WHERE entry_date < '2015-01-01';

-- 8. 修改id=7员工的职位为讲师（job=2）
UPDATE emp SET job = 2 WHERE id = 7;

-- 9. 批量插入两条新员工记录（自拟合理数据）
INSERT INTO emp(name,gender,job,salary,entry_date)
VALUES
('赵小天',1,2,15000,'2021-03-10'),
('孙小雨',2,5,7200,'2022-05-20');

-- 10. 查询所有女性员工（gender=2）的姓名和职位
SELECT name, job FROM emp WHERE gender = 2;

-- 11. 显示薪资超过15000的员工姓名、职位和薪资
SELECT name, job, salary FROM emp WHERE salary > 15000;

-- 12. 查询所有班主任（job=1）的信息，按入职日期倒序排列
SELECT * FROM emp WHERE job = 1 ORDER BY entry_date DESC;

-- 13. 统计员工表中总共有多少种不同的职位
SELECT COUNT(DISTINCT job) AS job_type_count FROM emp;

-- 14. 列出薪资在5000-8000之间的咨询师（job=5）姓名 和 薪资, 并且按照薪资倒序排序
SELECT name, salary FROM emp WHERE job = 5 AND salary BETWEEN 5000 AND 8000 ORDER BY salary DESC;

-- 15. 显示所有员工的姓名和薪资，按薪资从高到低排序, 如果薪资相同再按入门日期升序排序
SELECT name, salary FROM emp ORDER BY salary DESC, entry_date ASC;

-- 16. 查询一共有多少个讲师（job=2）
SELECT COUNT(*) AS lecturer_count FROM emp WHERE job = 2;

-- 17. 找出薪资排名前三的员工姓名和薪资
SELECT name, salary FROM emp ORDER BY salary DESC LIMIT 3;

-- 18. 查询2010-01-01年之后入职 并且 性别为女 并且 姓名为两个字的 员工姓名, 薪资, 职位
SELECT name, salary, job FROM emp WHERE entry_date > '2010-01-01'  
 AND gender = 2   AND name LIKE '__';

-- 19. 查询所有姓"李"的员工记录
SELECT * FROM emp WHERE name LIKE '李%';

-- 20. 统计男、女员工的平均薪资
SELECT gender, AVG(salary) AS avg_salary FROM emp GROUP BY gender;

-- 21. 列出没有职位信息（job为NULL）的员工ID和姓名
SELECT id, name FROM emp WHERE job IS NULL;

-- 22. 查询薪资高于20000的男性员工信息
SELECT * FROM emp WHERE gender = 1 AND salary > 20000;

-- 23. 显示各个职位对应的最高薪资（仅显示职位和最高薪资）
SELECT job, MAX(salary) AS max_salary FROM emp GROUP BY job;

-- 24. 找出薪资刚好是10000整倍数的员工
SELECT * FROM emp WHERE salary % 10000 = 0;

-- 25. 查询所有姓名为两个字, 并且入职时间在 '2010-01-01' 到 '2020-01-01' 之间入职 的员工姓名和入职时间 , 并根据入职时间降序排序
SELECT name, entry_date FROM emp WHERE name LIKE '__'   
 AND entry_date BETWEEN '2010-01-01' AND '2020-01-01' ORDER BY entry_date DESC;

-- 26. 查询同时满足 性别为女 且 职位是班主任 的员工
SELECT * FROM emp WHERE gender = 2 AND job = 1;

-- 27. 统计每个职位的员工数量（显示职位和数量）
SELECT job, COUNT(*) AS emp_count FROM emp GROUP BY job;

-- 28. 查询职位为班主任，且性别为女，并在2010-01-01之后入职的员工，按照入职时间倒序排序
SELECT * FROM emp
WHERE job = 1 AND gender = 2 AND entry_date > '2010-01-01'
ORDER BY entry_date DESC;

-- 29. 查询性别为女 , 职位为班主任的员工信息, 并且根据入职时间升序排序, 入职时间相同, 再按照薪资降序排序
SELECT * FROM emp
WHERE gender = 2 AND job = 1
ORDER BY entry_date ASC, salary DESC;
```