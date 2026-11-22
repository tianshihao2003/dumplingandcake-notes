---
title: "day05-参考答案"
node_token: Q0EjwQ3hDiEGySkTvz0c9Rlunhc
obj_token: VlSEdi6AZol6rux8Iv0c8tXdnQh
obj_type: docx
space_id: ""
url: https://wcn4b8bw7lqr.feishu.cn/wiki/Q0EjwQ3hDiEGySkTvz0c9Rlunhc
edited_at: "1794916586"
exported_at: "2026-11-21T13:24:21.309Z"
cover: false
date: 2026-11-21
---
# 题目一

```python

# ============================================================================
# 练习1：根据分数计算等级
# ============================================================================
"""
【需求说明】
    定义一个函数 calculate_grade，根据传入的分数，计算对应的等级并返回。

    等级规则：
        分数 >= 90 : A
        分数 >= 75 : B
        分数 >= 60 : C
        分数 <  60 : D
"""

def calculate_grade(score):
    """
    根据分数计算并返回对应等级
    :param score: 分数（int / float）
    :return: 等级（str），取值为 "A" / "B" / "C" / "D"
    """
    if score >= 90:
        print("A)
    elif score >= 75:
        print("B")
    elif score >= 60:
       print("c")
    else:
       print("d")

# ---------- 练习1 测试 ----------
print("=" * 50)
print("练习1：根据分数计算等级")
print("=" * 50)

test_scores_1 = [95, 80, 65, 50, 90, 75, 60, 59, 100, 0]
for s in test_scores_1:
    calculate_grade(s)

print()
```

# 题目二

```python

# ============================================================================
# 练习2：判断字符串是否为回文串
# ============================================================================
"""
【需求说明】
    定义一个函数 is_palindrome，用于判断一个字符串是否是回文串，返回 bool 值。

    思路：把字符串反转，如果和原字符串相同，就是回文串。
    示例：
        "level"                    -> True
        "radar"                    -> True
        "黄山落叶松叶落山黄"        -> True
        "hello"                    -> False
"""

def is_palindrome(s):
    """
    判断字符串是否为回文串
    :param s: 待判断的字符串
    :return: True 表示是回文串，False 表示不是
    """
    # 字符串反转后与原串比较, 相同即为回文串
    return s == s[::-1]

# ---------- 练习2 测试 ----------
print("=" * 50)
print("练习2：判断字符串是否为回文串")
print("=" * 50)

test_strs = ["level", "radar", "黄山落叶松叶落山黄", "hello", "abcba", "ab", ""]
for s in test_strs:
    print(f"'{s}' 是回文串吗? {is_palindrome(s)}")

print()
```

# 题目三

```python
# ============================================================================
# 练习3：秒数转换为小时、分钟、秒
# ============================================================================
"""
【需求说明】
    定义一个函数 convert_time，完成时间转换功能，将传入的秒数转换为
    小时、分钟、秒，并以元组的形式返回。

    提示：
        1 小时 = 3600 秒
        1 分钟 = 60   秒
"""

def convert_time(total_seconds):
    """
    将秒数转换为小时、分钟、秒
    :param total_seconds: 总秒数（int）
    :return: (hours, minutes, seconds) 元组
    """
    hours = total_seconds // 3600              # 1 小时 = 3600 秒
    minutes = (total_seconds % 3600) // 60     # 剩余秒数中包含的分钟数
    seconds = total_seconds % 60               # 剩余不足 1 分钟的秒数
    return hours, minutes, seconds

# ---------- 练习3 测试 ----------
print("=" * 50)
print("练习3：秒数转换为小时、分钟、秒")
print("=" * 50)

test_seconds = [0, 59, 60, 61, 3600, 3661, 7322, 86400, 90061]
for t in test_seconds:
    h, m, s = convert_time(t)
    print(f"{t:>6} 秒 = {h} 小时 {m} 分钟 {s} 秒")

print()

了解：{t:>6} 表示的意思为： t独占6个格，
例如：t = 123 print(f"{t:>6}") # 输出：   123 （前面补空格，整体一共6个字符）
```

# 题目四

```python

# ============================================================================
# 练习4：根据三条边长判断三角形类型
# ============================================================================
"""
【需求说明】
    定义一个函数 triangle_type，根据传入的三角形三个边的边长，判定
    三角形的类型。

    类型规则：
        等边三角形   ：三条边都相等
        等腰三角形   ：恰好有两条边相等
        普通三角形   ：三条边都不相等
        不能构成三角形：任意两边之和 <= 第三边
"""

def triangle_type(a, b, c):
    """
    根据三条边长判断三角形类型
    :param a: 第 1 条边的边长
    :param b: 第 2 条边的边长
    :param c: 第 3 条边的边长
    :return: 三角形类型（str）
    """
    # 1. 边长必须为正数
    if a <= 0 or b <= 0 or c <= 0:
        return "边长必须大于 0, 无法构成三角形 !"

    # 2. 判定能否构成三角形（任意两边之和 > 第三边）
    if a + b <= c or a + c <= b or b + c <= a:
        return "不能构成三角形"

    # 3. 判定具体类型
    if a == b == c:
        return "等边三角形"
    elif a == b or a == c or b == c:
        return "等腰三角形"
    else:
        return "普通三角形"

# ---------- 练习4 测试 ----------
print("=" * 50)
print("练习4：根据三条边长判断三角形类型")
print("=" * 50)

test_triangles = [
    (3, 3, 3),    # 等边
    (3, 3, 5),    # 等腰
    (3, 4, 5),    # 普通
    (1, 2, 3),    # 不能构成（1+2 = 3）
    (5, 1, 1),    # 不能构成（1+1 < 5）
    (0, 1, 1),    # 边长为 0
    (-1, 2, 2),   # 边长为负数
    (7, 7, 7),    # 等边
    (5, 5, 8),    # 等腰
]
for a, b, c in test_triangles:
    print(f"三边: ({a}, {b}, {c}) -> {triangle_type(a, b, c)}")

print()
```

# 题目五

```python

"""
定义一个函数，用于根据传入的一批商品信息（商品名、价格、数量）、优惠券、积分、运费信息
   计算订单的总金额。
具体规则如下：
商品总金额
    - 遍历所有传入的商品元组，将每个商品的 价格 × 数量 累加求和。
优惠券扣减
    - 使用条件：商品总金额 ≥ 5000 元才可以使用优惠券。
    - 额度限制：优惠券金额不得超过商品总价（即不得让抵扣后金额为负数）。
    - 不满足条件时，优惠券不生效。
积分抵扣
    - 使用条件：商品总金额 ≥ 5000 元才可以使用积分抵扣。
    - 兑换比例：100 积分 = 1 元，积分只能整百抵扣（即实际抵扣金额 = score // 100）。
    - 额度限制：积分抵扣金额不得超过商品总价。
    - 不满足条件时，积分抵扣不生效。
运费
    - 直接累加到最终金额上，无任何限制。"""
def calc_order_cost(*args, coupon=0, score=0, express=0.0):
    """
    根据传入的一批商品信息（商品名、价格、数量）、优惠（优惠券、积分抵扣）、运费信息计算订单的总金额
    :param args: 商品信息（商品名、价格、数量） ----> 如: ("鼠标", 188, 2) ("键盘", 388, 1)
    :param coupon: 优惠券
    :param score: 积分
    :param express: 运费
    :return: 订单的总金额
    """
    # 订单的总金额 = 商品总金额 - 优惠券 - 积分抵扣 + 运费
    # 1. 计算商品总金额
    total_price = [goods[1] * goods[2] for goods in args]
    total_cost = sum(total_price)

    # 2. 扣减优惠券
    if total_cost >= 5000 and coupon <= total_cost:
        total_cost -= coupon

    # 3. 扣减积分抵扣
    if total_cost >= 5000 and score // 100 <= total_cost:
        total_cost -= score // 100

    # 4. 添加运费
    total_cost += express

    return total_cost

# 测试
# total = calc_order_cost(("鼠标", 188, 2),("键盘", 388, 1),("手机", 3999, 1), coupon=10, score=4000, express=9.9)
# print(total)

# total = calc_order_cost(("鼠标", 188, 2),("键盘", 388, 1),("手机", 6999, 1), coupon=10, score=4000, express=9.9)
# print(total)

# total = calc_order_cost(("鼠标", 188, 2),("键盘", 388, 1),("手机", 6999, 1), express=9.9)
# print(total)

total = calc_order_cost(("鼠标", 188, 2),("键盘", 388, 1),("手机", 6999, 1))
print(total)
```

# 题目六

```python
# ============================================================================
# 练习1：智能数据筛选器
# ============================================================================
#
# 题目描述：
#   请设计一个通用数据筛选函数 filter_data，要求功能如下：
#   1. 通过 *args 接收任意数量的数值数据
#
#   2. 通过 **kwargs 接收筛选配置，支持的配置项包括：
#      - threshold：阈值，只保留大于等于该值的数据（默认：无阈值）
#      - unique：是否去重（默认 False）
#      - sort_order：排序方式，"asc" 升序 / "desc" 降序（默认 "asc"）
#      - top_n：只保留前N个（默认：全部保留）
#
#   3. 为所有函数添加完整的类型注解
#   4. 可以根据传入的筛选配置，对传入的数据进行处理，返回处理后的结果

#   测试：
#     filter_data(5,2,9,1,7,3,8,2,9,4, threshold=5, unique=True, sort_order="desc")
#       → [9, 8, 7, 5]
#     filter_data(3,5,1,8,6, top_n=3)
#       → [1, 3, 5]
# ============================================================================

def filter_data(*args:int, **kwargs: int | str | bool) -> list[int]:       # args -- 元组 ;  kwargs -- 字典
    # 1. 获取所有的配置项 kwargs 中获取
    threshold = kwargs.get("threshold")
    top_n = kwargs.get("top_n")
    unique = kwargs.get("unique", False)
    sort_order = kwargs.get("sort_order", "asc")

    # 2. 数据处理 -- 元组 -> 列表
    data_list = list(args)

    # 3. 阈值处理
    if threshold is not None:   # threshold 不是None值
        data_list = [i for i in data_list if i >= threshold]

    # 4. 去重
    if unique:
        data_list = list(set(data_list))

    # 5. 排序
    data_list.sort(reverse=(sort_order == "desc"))  # sort_order --> "desc" ; sort_order --> "asc"

    # 6. 保留前N个
    if top_n is not None:
        data_list = data_list[:top_n]

    return data_list

result = filter_data(5,2,9,1,7,3,8,2,9,4, threshold=5, unique=True, sort_order="asc", top_n=3)
print(result)
```

# 题目七

```python

# ============================================================================
# 练习：成绩统计分析器
# ============================================================================
#
# 题目描述：
#   设计一个函数 analyze_scores，要求功能如下：
#   1. 通过 *args 接收任意数量的分数（0~100之间的数值）
#   2. 通过 **kwargs 接收配置项：
#      - round_ndigits：结果保留的小数位数（默认 1）
#      - show_detail：是否打印详细信息（默认 False）
#      - pass_line：及格线分数（默认 60）
#   3. 返回值是一个字典，包含：
#      - count：人数
#      - max_score：最高分
#      - min_score：最低分
#      - avg_score：平均分
#      - pass_rate：及格率（以百分比字符串表示，如 "75.0%"）
#   4. 如果 show_detail=True，在函数内部打印详细统计信息
#   5. 如果未传入任何分数，返回字典中各项均为 0 或 "0%"
#   6. 添加完整的类型注解
#
#   测试：
#     analyze_scores(85,92,78,89,95,88,76,90, round_ndigits=2, show_detail=True)
#       → {'count': 8, 'max_score': 95, 'min_score': 76, 'avg_score': 86.62, 'pass_rate': '100.0%'}
#     analyze_scores(45,55,38,62,70,59, pass_line=60, round_ndigits=1)
#       → {'count': 6, 'max_score': 70, 'min_score': 38, 'avg_score': 54.8, 'pass_rate': '33.3%'}
# ============================================================================

def analyze_scores(*args: float, **kwargs: int) -> dict[str, int|str]:
    round_ndigits: int = kwargs.get("round_ndigits", 1)
    show_detail: bool = kwargs.get("show_detail", False)
    pass_line: float = kwargs.get("pass_line", 60)
    
    if not args:
        return {"count": 0, "max_score": 0, "min_score": 0, "avg_score": 0, "pass_rate": "0%"}

    count: int = len(args)
    max_score: float = max(args)
    min_score: float = min(args)
    avg_score: float = round(sum(args) / count, round_ndigits)
    pass_count: int = sum(1 for s in args if s >= pass_line)
    pass_rate: str = f"{round(pass_count / count * 100, round_ndigits)}%"
    
    if show_detail:
        print(f"--- 成绩统计详情 ---")
        print(f"人数: {count}, 最高分: {max_score}, 最低分: {min_score}")
        print(f"平均分: {avg_score}, 及格率: {pass_rate}")

    return {"count": count, "max_score": max_score, "min_score": min_score, "avg_score": avg_score, "pass_rate": pass_rate}

# ---------- 练习2 测试 ----------
print("=" * 50)
print("练习2：成绩统计分析器")
print("=" * 50)

scores1 = analyze_scores(85, 92, 78, 89, 95, 88, 76, 90, round_ndigits=2, show_detail=True)
print(f"结果1: {scores1}")

scores2 = analyze_scores(45, 55, 38, 62, 70, 59, pass_line=60, round_ndigits=1)
print(f"结果2: {scores2}")

scores3 = analyze_scores()
print(f"结果3(空数据): {scores3}")

print()
```

# 题目八

```python

# ============================================================================
# 练习：个人信息卡片
# 知识点：默认参数 + 关键字参数 + **kwargs + 类型注解
# ============================================================================
#
# 题目描述：
#   设计一个函数 create_profile，用于生成个人信息卡片。要求如下：
#   1. 函数接收以下参数（均有默认值）：
#      - name：姓名（默认 "未填写"）
#      - age：年龄（默认 0）
#      - city：城市（默认 "未知"）
#      - job：职业（默认 "待业"）
#      - hobby：爱好（默认 "无"）
#   2. 除了上述参数外，还可以通过 **kwargs 接收任意自定义信息
#      （如 phone="138xxxx", email="abc@test.com"）
#   3. 函数返回一个格式化好的多行字符串（个人信息卡片），形如：
#      ===== 个人信息卡 =====
#      姓名: 张三
#      年龄: 25
#      城市: 北京
#      职业: 程序员
#      爱好: 篮球
#      --- 其他信息 ---
#      手机: 138xxxx
#      邮箱: abc@test.com
#      ======================
#   4. 添加完整的类型注解
#
#   测试：
#     create_profile("张三", 25, "北京", "程序员", "篮球",
#                    phone="138xxxx", email="abc@test.com")
#     create_profile("李四", city="上海", hobby="摄影")
#     create_profile()
# ============================================================================

def create_profile(name: str = "未填写", age: int = 0, city: str = "未知", job: str = "待业", hobby: str = "无", **kwargs: str) -> str:
    """
    生成个人信息卡片

    :param name: 姓名
    :param age: 年龄
    :param city: 城市
    :param job: 职业
    :param hobby: 爱好
    :param kwargs: 其他自定义信息
    :return: 格式化的信息卡片字符串
    """
    lines: list[str] = ["===== 个人信息卡 ====="]
    lines.append(f"姓名: {name}")
    lines.append(f"年龄: {age}")
    lines.append(f"城市: {city}")
    lines.append(f"职业: {job}")
    lines.append(f"爱好: {hobby}")

    if kwargs:
        lines.append("--- 其他信息 ---")
        for key, value in kwargs.items():
            lines.append(f"{key}: {value}")

    lines.append("======================")
    return "\n".join(lines)

# ---------- 练习3 测试 ----------
print("=" * 50)
print("练习3：个人信息卡片")
print("=" * 50)

card1 = create_profile("张三", 25, "北京", "程序员", "篮球", phone="138xxxx", email="abc@test.com")
print(card1)

print()

card2 = create_profile("李四", city="上海", hobby="摄影")
print(card2)

print()

card3 = create_profile()  # 全部使用默认值
print(card3)

print()
```