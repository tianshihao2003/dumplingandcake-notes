---
title: "day01-参考答案"
node_token: STO0wZpqTib4jEkmEC2cgIhonVc
obj_token: EQkudQc3PoTyj1xwIbccjc3Nnif
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/STO0wZpqTib4jEkmEC2cgIhonVc
edited_at: "1786326349"
exported_at: "2026-11-21T13:24:20.271Z"
cover: false
date: 2026-11-21
---
```python
# 需求1：在控制台中输出一首古诗，分为8行输出
print("* * * * * * * * * * * * * * * * ")
print("*       《登高》 唐・杜甫        * ")
print("* * * * * * * * * * * * * * * * ")
print("*  风急天高猿啸哀，渚清沙白鸟飞回。  * ")
print("*  无边落木萧萧下，不尽长江滚滚来。  * ")
print("*  万里悲秋常作客，百年多病独登台。  * ")
print("*  艰难苦恨繁霜鬓，潦倒新停浊酒杯。  * ")
print("* * * * * * * * * * * * * * * * ")

# 需求2：使用字符串语法，打印如下格式内容（保留换行、制表缩进效果
print("""
名言:
  人生苦短，我用"Python"
""")

# 需求3: 现有三个变量，分别为：a=100，b = 200，c = 300，现需要将这三个变量值进行交换，将a, b, c的值分别赋值给c, a, b，并将其输出到控制台 ，最终a 的值为 200，b 的值为 300，c 的值为 100 。
a = 100
b = 200
c = 300

temp = c
c = a
a = b
b = temp

print("a = ", a, ", b = ", b, ", c = ", c)

# 需求4：根据用户输入的两个数字，计算两个数相加、相减、相除、相乘的结果，并将其输出到控制台。
num1 = int(input("请输入第一个数字: "))
num2 = int(input("请输入第二个数字: "))

print(f"两个数字相加的结果为: {num1 + num2}")
print(f"两个数字相减的结果为: {num1 - num2}")
print(f"两个数字相乘的结果为: {num1 * num2}")
print(f"两个数字相除的结果为: {num1 / num2}")

# 需求5：要求输入梯形的上底、下底、高，然后计算梯形的面积
base1 = float(input("请输入梯形的上底: "))
base2 = float(input("请输入梯形的下底: "))
height = float(input("请输入梯形的高: "))

print(f"梯形的面积是: {(base1 + base2) * height / 2}")

# 需求6: 要求输入圆的半径，然后计算圆的周长和面积 (周长: 2πr，面积：πr²)
radius = float(input("请输入圆的半径: "))
print(f"圆的周长为: {2 * 3.14 * radius}")
print(f"圆的面积为: {3.14 * radius ** 2}")

# 需求7：身体质量指数BMI的计算（BMI = 体重(kg) / 身高(m)²）
#   1. 输入体重(单位kg)
#   2. 输入身高(单位m)
#   3. 计算身体质量指数BMI并输出
weight = float(input("请输入体重(单位kg): "))
height = float(input("请输入身高(单位m): "))
print(f"BMI为: {weight / height ** 2}")

# 需求8： 输入一个秒数，把它转换成小时 + 分钟 + 秒输出。 例如输入 130 → 输出：0 小时 2 分 10 秒
second = int(input("请输入秒数: "))
print(f"{second // 3600} 小时 {(second % 3600) // 60} 分钟 {(second % 3600) % 60} 秒")

# 需求9: 输入苹果单价、购买重量，计算总价，并输出一句话： “苹果单价 X 元，购买 X 斤，总价 X 元”
price = float(input("请输入苹果单价: "))
weight = float(input("请输入苹果重量: "))

print(f"苹果单价 {price} 元，购买 {weight} 斤，总价 {price * weight} 元")

# 需求10: 输入语文、数学、英语三科成绩，计算总分和平均分，并输出。
chinese = int(input("请输入语文成绩: "))
math = int(input("请输入数学成绩: "))
english = int(input("请输入英语成绩: "))

print(f"总分: {chinese + math + english}，平均分: {(chinese + math + english) / 3}")

# 需求11：接收用户输入一个整数，判断该数字是否大于 10 并且 小于 50，打印最终判断结果（True/False）。
num = int(input("请输入一个整数: "))
print(f"{num} 是大于 10 并且 小于 50的吗?  {num > 10 and num < 50}")

# 需求12：接收用户输入一个整数，判断该数字是否小于等于 10 或者 大于等于 50，打印最终判断结果（如果满足条件输出True，不满足输出False）。
num = int(input("请输入一个整数: "))
print(f"{num} 是小于等于 10 或者 大于等于 50的吗? {num <= 10 or num >= 50}")

# 需求13： 输入语文、数学成绩，判断是否至少有一科分数大于 90 分，输出结果（如果有输出True，没有输出False）。
chinese = int(input("请输入语文成绩: "))
math = int(input("请输入数学成绩: "))

print(f"至少有一科分数大于 90 分吗? {chinese > 90 or math > 90}")

# 需求14: 模拟成绩统计与评优：
#     1. 输入姓名、语文成绩、英语成绩；
#     2. 计算两科总分与平均分；
#     3. 评优规则：两科分数都大于 85 分 或者 总分大于 180 分，评为优秀；
#     4. 输出结果：姓名、总分、平均分、是否评为优秀 。 具体格式为：姓名：王林，总分：192，平均分：96，是否评为优秀：True
name = input("请输入姓名: ")
chinese = int(input("请输入语文成绩: "))
english = int(input("请输入英语成绩: "))

print(f"姓名：{name}，总分：{chinese + english}，平均分：{(chinese + english) / 2}，是否评为优秀：{chinese > 85 and english > 85 or (chinese + english) > 180}")
```