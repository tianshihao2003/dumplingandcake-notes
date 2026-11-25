---
title: "day03-参考答案"
node_token: TVKGwGSatiGAJ1k31mqcR0SbnZd
obj_token: Bjfyd1ouXofgD3xUoA2cru81ndb
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/TVKGwGSatiGAJ1k31mqcR0SbnZd
edited_at: "1794704108"
exported_at: "2026-11-24T12:38:50.389Z"
cover: false
date: 2026-11-24
---
```python
# ---------- 1.1 合并三个列表，去重重复元素，排好序（升序）后输出 ----------
print("\n--- 1.1 列表合并去重排序 ---")
list1 = ['M', 'A', 'C', 'E', 'F', 'G', 'H', 'L', 'N', 'I', 'J', 'K', 'O']
list2 = ['X', 'Z', 'T', 'Y', 'D', 'E', 'F', 'G']
list3 = ['W', 'A', 'S', 'D']

merged = list1 + list2 + list3

new_list = []
for num in merged:
    if num not in new_list:
        new_list.append(num)

new_list.sort()
print(f"合并去重排序后的结果: {new_list}")

# ---------- 1.2 提取能被3或5整除的元素，计算平方，组成新列表 ----------
print("\n--- 1.2 整除3或5 → 平方列表 ---")
list1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]

# 列表推导式
result = [i ** 2 for i in list1 if i % 3 == 0 or i % 5 == 0]
print(f"能被3或5整除的数的平方列表: {result}")

# ---------- 1.3 提取列表中的正数，封装为新列表 ----------
print("\n--- 1.3 提取正数 ---")
list1 = [11, 2, 31, 4, -5, 15, 17, 28, 49, 10, -11, 16, 54, -14, 36, -16, 87, -39]

# 列表推导式
positive_list = [i for i in list1 if i > 0]
print(f"正数列表: {positive_list}")

# ---------- 1.4 判断字符串是否是回文 ---------- abcdef    abccba
# 交互式输入判断（注释掉以便于批量运行，如需测试可取消注释）
input_str = input("请输入一个字符串，判断是否回文: ")
if input_str == input_str[::-1]:
    print(f'"{input_str}" 是回文（两边对称）')
else:
    print(f'"{input_str}" 不是回文')

# ---------- 1.5 输入10个字符串，反转后转大写，记录在列表中，遍历输出 ----------
print("\n--- 1.5 字符串反转转大写 ---")
# 模拟数据（交互式输入已注释，如需实际输入请取消注释）
str_list = []
for i in range(10):
    s = input(f"请输入第{i+1}个字符串: ")
    str_list.append(s[::-1].upper())

print("反转并转大写后的结果:")
for s in str_list:
    print(s)

# ---------- 1.6 交换两个变量 ----------
print("\n--- 1.6 两变量交换 ---")
a = 10
b = 20
print(f"交换前: a = {a}, b = {b}")

# Python 特有的交换方式（元组组包与解包）
a, b = b, a
print(f"交换后: a = {a}, b = {b}")

# ---------- 1.7 交换三个变量 ----------
print("\n--- 1.7 三变量交换 ---")
a = 100
b = 200
c = 300
print(f"交换前: a = {a}, b = {b}, c = {c}")

# 要求: 将 a,b,c 的值分别赋值给 c,a,b
# 即: 新c = 原a(100), 新a = 原b(200), 新b = 原c(300)
a, b, c = b, c, a
print(f"交换后: a = {a}, b = {b}, c = {c}")

# ============================================================================
# 题目2：列表合并去重 + 列表推导式
# ============================================================================
# 【题目】
# 已知两个班级的学员编号：
# class_a = [101, 102, 105, 108, 102, 110, 105, 112, 108]
# class_b = [105, 106, 108, 109, 111, 101, 113, 106]
#
# 请完成以下操作：
# 1. 合并两个列表的数据，得到合并后的原始列表 merged
# 2. 对 merged 进行列表去重，保留第一次出现的顺序，得到 unique_list
# 3. 使用列表推导式，从 unique_list 中筛选出所有的奇数编号，生成 odd_list，并输出
# 4. 使用列表推导式，odd_list 中每个元素在其基础上加 10000，生成 new_list，并输出

print("\n" + "=" * 60)
print("题目2：列表合并去重 + 列表推导式")
print("=" * 60)

class_a = [101, 102, 105, 108, 102, 110, 105, 112, 108]
class_b = [105, 106, 108, 109, 111, 101, 113, 106]

# 1. 合并两个列表的数据，得到合并后的原始列表 merged
merged = class_a + class_b
print(f"\n1. 合并后的原始列表: {merged}")

# 2. 对 merged 进行列表去重，保留第一次出现的顺序，得到 unique_list
unique_list = []
for num in merged:
    if num not in unique_list:
        unique_list.append(num)
print(f"2. 去重后（保留顺序）: {unique_list}")

# 3. 使用列表推导式，从 unique_list 中筛选出所有的奇数，生成 odd_list，并输出
odd_list = [num for num in unique_list if num % 2 != 0]
print(f"3. 奇数编号列表: {odd_list}")

# 4. 使用列表推导式，odd_list 中每个元素在其基础上加 10000，生成 new_list，并输出
new_list = [num + 10000 for num in odd_list]
print(f"4. 加 10000 后的列表: {new_list}")

# ============================================================================
# 题目3：集合推导式 + 多集合操作
# ============================================================================
# 【题目】
# 已知四个课外活动小组的成员名单：
# calligraphy_set = {"王林", "曾牛", "天运子", "韩立", "厉飞雨", "紫灵", "徐立国"}
# painting_set    = {"张铁", "王林", "曾牛", "王蝉", "韩立", "厉飞雨", "云露", "李化元"}
# music_set       = {"许木", "红蝶", "韩立", "天运子", "厉飞雨", "曾牛", "虎咆"}
# sports_set      = {"遁天", "天运子", "韩立", "姜老道", "紫灵", "云露", "虎咆"}
#
# 请完成以下操作：
# 1. 找出同时参加了所有四个小组的学生（四重交集）
# 2. 找出参加了书法组，但既没有参加绘画组也没有参加音乐组的学生
# 3. 使用集合推导式找出参加了书法组，但没有参加体育组的学生
# 4. 求出所有参赛学生名单（四组并集），并统计总人数
# 5. 统计每位学生在四个小组中总共出现的次数, 并输出(形式为: xxx 参加了 xxx 个小组)

print("\n" + "=" * 60)
print("题目3：集合推导式 + 多集合操作")
print("=" * 60)

# 书法组
calligraphy_set = {"王林", "曾牛", "天运子", "韩立", "厉飞雨", "紫灵", "徐立国"}
# 绘画组
painting_set    = {"张铁", "王林", "曾牛", "王蝉", "韩立", "厉飞雨", "云露", "李化元"}
# 音乐组
music_set       = {"许木", "红蝶", "韩立", "天运子", "厉飞雨", "曾牛", "虎咆"}
# 体育组
sports_set      = {"遁天", "天运子", "韩立", "姜老道", "紫灵", "云露", "虎咆"}

# 1. 找出同时参加了所有四个小组的学生（四重交集）
all_four = calligraphy_set & painting_set & music_set & sports_set
print(f"\n1. 同时参加了所有四个小组的学生: {all_four}")

# 2. 找出参加了书法组，但既没有参加绘画组也没有参加音乐组的学生
#    即：在书法组，但不在绘画组，也不在音乐组
result2 = calligraphy_set - painting_set - music_set
print(f"2. 参加了书法组，但既没有参加绘画组也没有参加音乐组: {result2}")

# 3. 使用集合推导式找出参加了书法组，但没有参加体育组的学生
result3 = {s for s in calligraphy_set if s not in sports_set}
print(f"3. 参加了书法组但没有参加体育组（集合推导式）: {result3}")

# 4. 求出所有参赛学生名单（四组并集），并统计总人数
all_students = calligraphy_set | painting_set | music_set | sports_set
print(f"4. 所有参赛学生名单: {all_students}")
print(f"   总人数: {len(all_students)}")

# 5. 统计每位学生在四个小组中总共出现的次数
print(f"\n5. 每位学生参加小组的次数:")
# 将所有小组成员解包到一个列表中
all_members = [*calligraphy_set, *painting_set, *music_set, *sports_set]
for student in all_students:
    count = all_members.count(student)
    print(f"   {student} 参加了 {count} 个小组")

# ============================================================================
# 题目4：学生管理系统模拟
# ============================================================================
# 【题目】
# 已知若干学生的课程选课数据：
# students = (
#     ("S001", "王林", {"语文", "数学", "英语", "历史"}),
#     ("S002", "李慕婉", {"数学", "物理"}),
#     ("S003", "司徒南", {"语文", "英语", "历史"}),
#     ("S004", "柳眉", {"数学", "英语", "物理"}),
#     ("S005", "周佚", {"语文", "数学", "化学", "历史"}),
#     ("S006", "清水仙君", {"语文", "数学", "AI", "日语"}),
#     ("S007", "红蝶", {"英语", "数学", "日语"}),
#     ("S008", "徐立国", {"语文", "英语", "历史"}),
#     ("S009", "许立国", {"语文", "历史", "AI"}),
#     ("S010", "藤化元", {"语文", "英语", "化学", "韩语"})
# )
# hot_courses = {"数学", "英语", "物理"}
#
# 请依次完成以下操作（不使用函数）：
# 1. 使用元组解包遍历所有学生，输出每个学生的学号、姓名和所选课程
# 2. 求出所有学生选过的全部课程集合 all_courses
# 3. 计算每个学生的总学分（每门课 3 学分）, 并输出(形式: "xxx 选修了 xxx 课程, 总学分 xxx 分")
# 4. 找出所选课程中至少包含 2 门热门课程的学生
# 5. 找出选了"数学"但没选"物理"的学生姓名
print("\n" + "=" * 60)
print("题目4：学生管理系统模拟")
print("=" * 60)
students = (
    ("S001", "王林", {"语文", "数学", "英语", "历史"}),
    ("S002", "李慕婉", {"数学", "物理"}),
    ("S003", "司徒南", {"语文", "英语", "历史"}),
    ("S004", "柳眉", {"数学", "英语", "物理"}),
    ("S005", "周佚", {"语文", "数学", "化学", "历史"}),
    ("S006", "清水仙君", {"语文", "数学", "AI", "日语"}),
    ("S007", "红蝶", {"英语", "数学", "日语"}),
    ("S008", "徐立国", {"语文", "英语", "历史"}),
    ("S009", "许立国", {"语文", "历史", "AI"}),
    ("S010", "藤化元", {"语文", "英语", "化学", "韩语"})
)
hot_courses = {"数学", "英语", "物理"}

# 1. 使用元组解包遍历所有学生，输出每个学生的学号、姓名和所选课程
for sid, name, courses in students:
    print(f"学号: {sid}, 姓名: {name}, 选修课程: {courses}")

# 2. 求出所有学生选过的全部课程集合 all_courses
# 方式一:
# all_courses = set()
# for sid, name, courses in students:     # courses ---> {"语文", "数学", "英语", "历史"}
#     for c in courses:                   # c ---------> "语文"
#         all_courses.add(c)
# print(f"所有学生选过的全部课程集合: {all_courses}")

# 方式二:
all_courses = set()
for sid, name, courses in students:     # courses ---> {"语文", "数学", "英语", "历史"}
    all_courses = all_courses | courses

print(f"所有学生选过的全部课程集合: {all_courses}")

print("- " * 50)

# 3. 计算每个学生的总学分（每门课 3 学分）
for sid, name, courses in students:
    total_score = len(courses) * 3
    print(f"学生: {name}, 选修课程: {courses}, 总学分: {total_score}")

print("- " * 50)

# 4. 找出所选课程中至少包含 2 门热门课程的学生
for sid, name, courses in students:
    hot_count = len(hot_courses & courses)
    if hot_count >= 2:
        print(f"学生: {name}, 选修课程: {courses}, 热门课程数: {hot_count}")

print("- " * 50)

# 5. 找出选了"数学"但没选"物理"的学生姓名
for sid, name, courses in students:
    if "数学" in courses and "物理" not in courses:
        print(f"学生: {name}, 选修课程: {courses}")

print("- " * 50)
```