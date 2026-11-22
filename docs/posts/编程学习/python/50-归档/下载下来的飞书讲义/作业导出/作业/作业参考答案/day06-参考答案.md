---
title: "day06-参考答案"
node_token: RfKgw1TpdiSaY3kWcNNcEFL1nDJ
obj_token: VNxWdbxngoTttuxVy44cswJBnC0
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/RfKgw1TpdiSaY3kWcNNcEFL1nDJ
edited_at: "1794905564"
exported_at: "2026-11-21T13:24:21.508Z"
cover: false
date: 2026-11-21
---
# **统计成绩方法补充**

```python

class Student:
    def __init__(self, name, chinese, math, english):
        self.name = name
        self.chinese = chinese
        self.math = math
        self.english = english

    def __repr__(self):
        return f"姓名：{self.name} | 语文：{self.chinese} | 数学：{self.math} | 英语：{self.english} | 总分：{self.chinese + self.math + self.english}"

class EduManagement:
    def __init__(self):  #stu_dict = {"张三": Student(“张三”,30,40,50)，"李四": stu对象，...}
        self.stu_dict = {}

    def add_stu(self):
        name = input("请输入学生姓名：")
        if name in self.stu_dict:
            print("学生已存在")
        else:
            chinese = int(input("请输入学生的语文成绩: "))
            math = int(input("请输入学生的数学成绩: "))
            english = int(input("请输入学生的英语成绩: "))
            self.stu_dict[name] = Student(name,chinese,math,english)
            print("添加学生信息成功")

    def update_stu(self):
        name = input("请输入学生姓名：")
        if name not in self.stu_dict:
            print("该学生不存在")
        else:
            stu = self.stu_dict.get(name)
            print("该学生成绩为：")
            print(stu)
            chinese = int(input("请输入学生最新语文成绩: "))
            math = int(input("请输入学生最新数学成绩: "))
            english = int(input("请输入学生最新英语成绩: "))
            stu.chinses =  chinese
            stu.math =  math
            stu.english =  english
            print("修改学生信息成功")

    def delete_stu(self):
        name = input("请输入学生姓名：")
        if name not in self.stu_dict:
            print("该学生不存在")
        else:
            del self.stu_dict[name]
            print("删除学生信息成功")

    def query_stu(self):
        name = input("请输入学生姓名：")
        if name not in self.stu_dict:
            print("该学生不存在")
        else:
            stu = self.stu_dict.get(name)
            print("该学生成绩为：")
            print(stu)
    def query_all_stus(self):
        for stu in self.stu_dict.values():
            print(stu)

    # 新增：统计各科最高分最低分以及对应学生
    def stat_score(self):
        if not self.stu_dict:
            print("系统暂无学生数据，无法统计！")
            return

        chinese_grades = []
        math_grades = []
        english_grades = []
        # 遍历字典：(name, student对象)
        items = self.stu_dict.items()
        for name, stu in items:
            chinese_grades.append(stu.chinese)
            math_grades.append(stu.math)
            english_grades.append(stu.english)

        max_chinese_grade = max(chinese_grades)
        min_chinese_grade = min(chinese_grades)
        max_math_grade = max(math_grades)
        min_math_grade = min(math_grades)
        max_english_grade = max(english_grades)
        min_english_grade = min(english_grades)

        print(f"语文成绩的最高分：{max_chinese_grade},语文成绩最低分：{min_chinese_grade}")
        print(f"数学成绩的最高分：{max_math_grade},数学成绩最低分：{min_math_grade}")
        print(f"英语成绩的最高分：{max_english_grade},英语成绩最低分：{min_english_grade}")

        # 列表推导式，对象属性对比
        max_chinese_grade_name = [name for name, stu in self.stu_dict.items() if stu.chinese == max_chinese_grade]
        min_chinese_grade_name = [name for name, stu in self.stu_dict.items() if stu.chinese == min_chinese_grade]
        max_math_grade_name = [name for name, stu in self.stu_dict.items() if stu.math == max_math_grade]
        min_math_grade_name = [name for name, stu in self.stu_dict.items() if stu.math == min_math_grade]
        max_english_grade_name = [name for name, stu in self.stu_dict.items() if stu.english == max_english_grade]
        min_english_grade_name = [name for name, stu in self.stu_dict.items() if stu.english == min_english_grade]

        print(f"语文成绩最高分获得者：{max_chinese_grade_name}")
        print(f"语文成绩最低分获得者：{min_chinese_grade_name}")
        print(f"数学成绩最高分获得者：{max_math_grade_name}")
        print(f"数学成绩最低分获得者：{min_math_grade_name}")
        print(f"英语成绩最高分获得者：{max_english_grade_name}")
        print(f"英语成绩最低分获得者：{min_english_grade_name}")

    # 运行系统
    def run(self):
        print("######## 欢迎您访问教务管理系统 ########")

        while True:
            print()
            print("# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #")
            print("# 1.添加学生   2.修改学生   3.删除学生   4.查询指定学生   5.查询所有学生   6.退出系统   #")
            print("# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #")
            print()

            choice = input("请选择要执行的操作, 输入1-6: ")
            match choice:
                case "1":  # 添加学生
                    self.add_stu()
                case "2":  # 修改学生
                    self.update_stu()
                case "3":  # 删除学生
                    self.delete_stu()
                case "4":  # 查询指定学生
                    self.query_stu()
                case "5":  # 查询所有学生
                    self.query_all_stus()
                case "6":  # 退出系统
                    print("Bye ~")
                    break
                case "7":
                    self.stat_score()
                case _:  # 其他情况
                    print("输入错误, 请选择1-6之间的菜单功能!")

if __name__ == "__main__":
    EduManagement().run()
```

# 图书管理系统

```python
# ================================================================================
# 作业题 1：图书管理系统
# ================================================================================
"""
【需求说明】

1. 业务背景
   使用面向对象思想，开发一个图书管理系统，对图书信息进行统一管理，
   支持添加、修改、删除、查询单本、查询所有等功能。

2. 涉及到的类
   2.1 Book（图书类）
       - 实例属性：书名(title)、作者(author)、价格(price)、库存(stock)
       - 方法：
           * __init__：初始化方法，创建图书对象时设置所有属性
           * __repr__：返回图书的字符串表示，格式为：
             "书名: xxx | 作者: xxx | 价格: xxx | 库存: xxx"

   2.2 BookSystem（图书管理系统类）
       - 类属性：system_name（系统名称）、system_version（系统版本号）
       - 实例属性：book_dict（用于存放所有图书对象的字典） 【 {"书名1": book对象, "书名2": book对象} 】
       - 方法：
           * __init__：初始化方法，创建一个空的 book_dict
           * add_book：添加一本新图书
           * update_book：修改指定图书的信息
           * delete_book：删除指定图书
           * query_book：查询指定图书
           * list_books：展示所有图书
           * run：显示菜单并循环接收用户操作

3. 业务规则
   3.1 添加图书时：
       - 依次输入书名、作者、价格、库存
       - 书名不能重复（已存在则提示并返回）
       - 价格必须大于 0，库存必须大于等于 0，否则提示并返回
   3.2 修改图书时：
       - 输入要修改的书名
       - 若不存在则提示"未找到该图书"
       - 找到后依次输入新的作者、价格、库存，并更新
   3.3 删除图书时：
       - 输入要删除的书名
       - 若不存在则提示"未找到该图书"
   3.4 查询图书时：
       - 输入书名进行精确查询
   3.5 展示所有图书时：
       - 遍历 book_dict.values()，依次输出每一本图书的信息

4. 菜单
       1. 添加图书   2. 修改图书   3. 删除图书
       4. 查询指定图书  5. 查询所有图书  6. 退出系统
"""

# 图书类
class Book:
    def __init__(self, title, author, price, stock):
        self.title = title
        self.author = author
        self.price = price
        self.stock = stock

    def __repr__(self):
        return f"书名: {self.title} | 作者: {self.author} | 价格: {self.price} | 库存: {self.stock}"

# 图书管理系统类
class BookSystem:
    system_name = "图书管理系统"
    system_version = "1.0"

    def __init__(self):
        self.book_dict = {}  # 字典, 用于存放所有的图书对象 -- {"书名": book对象}

    # 添加图书
    def add_book(self):
        title = input("请输入书名: ")

        # 判断书名是否已存在
        if title in self.book_dict:
            print("该图书已存在, 添加失败!")
            return

        author = input("请输入作者: ")
        price = float(input("请输入价格: "))
        stock = int(input("请输入库存数量: "))

        # 校验数据合法性
        if price > 0 and stock >= 0:
            book = Book(title, author, price, stock)
            self.book_dict[title] = book
            print("图书添加成功 ~")
        else:
            print("价格必须大于 0, 库存必须大于等于 0 !")

    # 修改图书
    def update_book(self):
        title = input("请输入要修改的书名: ")

        book = self.book_dict.get(title)
        if book is not None:
            print(f"当前信息: {book}")

            author = input("请输入新的作者: ")
            price = float(input("请输入新的价格: "))
            stock = int(input("请输入新的库存数量: "))

            if price > 0 and stock >= 0:
                book.author = author
                book.price = price
                book.stock = stock
                print("图书信息修改成功 ~")
                print(f"修改后: {book}")
                return
            else:
                print("价格必须大于 0, 库存必须大于等于 0 !")
                return

        print("未找到该图书, 修改失败 !")

    # 删除图书
    def delete_book(self):
        title = input("请输入要删除的书名: ")

        if title in self.book_dict:
            del self.book_dict[title]
            print("图书删除成功 ~")
            return
        print("未找到该图书, 删除失败 !")

    # 查询指定图书
    def query_book(self):
        title = input("请输入要查询的书名: ")

        book = self.book_dict.get(title)
        if book is not None:
            print(f"图书信息: {book}")
            return
        print("未找到该图书 !")

    # 展示所有图书
    def list_books(self):
        for b in self.book_dict.values():
            print(b)

    # 运行系统
    def run(self):
        print(f"欢迎使用{BookSystem.system_name} V{BookSystem.system_version}")

        while True:
            print()
            print("# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #")
            print("# 1.添加图书  2.修改图书  3.删除图书  4.查询指定图书  5.查询所有图书  6.退出系统 #")
            print("# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #")
            print()

            choice = input("请选择要执行的操作, 输入1-6: ")

            try:
                match choice:
                    case "1":  # 添加图书
                        self.add_book()
                    case "2":  # 修改图书
                        self.update_book()
                    case "3":  # 删除图书
                        self.delete_book()
                    case "4":  # 查询指定图书
                        self.query_book()
                    case "5":  # 查询所有图书
                        self.list_books()
                    case "6":  # 退出系统
                        print("Bye ~")
                        break
                    case _:  # 其他情况
                        print("输入错误, 请选择1-6之间的菜单功能!")
            except ValueError:
                print("输入的数据有问题, 请检查, 然后重新输入 !!!")
            except Exception:
                print("程序运行出错了, 请重新选择 ~")

# ================================================================================
# 主入口：选择要运行的作业题
# ================================================================================
if __name__ == '__main__':
    BookSystem().run()
```