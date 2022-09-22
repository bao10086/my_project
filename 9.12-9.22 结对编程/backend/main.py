# -*- coding = utf-8 -*-
# @Time : 2022/9/9 19:57
# @Author : 乌贼
# @File : main.py.py
# @Software : PyCharm


# 连接数据库
import random
from json import dumps

import pymysql
import yagmail
from flask import Flask, request, jsonify
from flask_cors import CORS
import sympy as sy
import math

db = pymysql.Connect(
    host='47.99.151.243',
    database='my_project',
    user='admin',
    password='123456'
)
cursor = db.cursor()

# 后端启动
app = Flask(__name__)
CORS(app, resource=r'/*')

global email  # 邮箱
global key  # 验证码


# 获取验证码
# 授权码 ： tbijlixnhttybjai
@app.route('/get_code', methods=['POST'])
def get_code():
    # 接收
    global email
    email = request.form.get('email')
    global key
    key = random.randint(0, 999999)  # 设置验证码
    yag = yagmail.SMTP(user="212133061@qq.com",
                       password="tbijlixnhttybjai", host='smtp.qq.com')  # 链接邮箱服务器发信
    subject = ["验证码"]  # 主题
    contents = ['''
    <table style="width: 99.8%; height: 95%;">
        <tbody>
            <tr>
                <td id="QQMAILSTATIONERY" style="background:url(https://rescdn.qqmail.com/bizmail/zh_CN/htmledition/images/xinzhi/bg/a_02.jpg) no-repeat #fffaf6; min-height:550px; padding:100px 55px 200px 100px; ">
                <div style="text-align: center;"><font>{},您好！&nbsp;</font></div>
                <div style="text-align: center;"><font><br>
                    </font>
                </div>
                <div style="text-align: center;"><font>您的验证码/临时登录密码 为&nbsp;</font></div>
                <div style="text-align: center;"><font><br>
                    </font>
                </div>
                <div style="text-align: center;"><font color="#ff0000"><b><u>{}</u></b></font></div>
                <div style="text-align: center;"><font><br>
                    </font>
                </div>
                <div style="text-align: center;"><font>如非您本人操作无需理会。&nbsp;</font></div>
                <div style="text-align: center;"><font><br>
                    </font>
                </div>
                <div style="text-align: center;"><font>感谢支持。</font></div>
                </td>
            </tr>
        </tbody>
    </table>
    <div><includetail><!--<![endif]--></includetail></div>
    '''.format(email, key)]  # 使用 ''' 嵌入HTML代码，使用 format 嵌入称呼(ss)与验证码(key)
    # yag.send(email, subject, contents)  # 发送邮件
    print(key)
    print("发送成功")

    return_dict = {'key': key}

    return jsonify(return_dict)


# 注册
@app.route('/sign_up', methods=['POST'])
def sign_up():
    # 接收
    global email
    email = request.form.get('email')
    sql_statement = 'create table if not exists users(email varchar(20),name varchar(40),password varchar(10));'
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    # 查找数据库判断是否注册过
    sql_statement = "select * from users where email = '" + email + "'"
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    print(data)

    return_dict = {'code': '404'}
    if data is not None:
        return_dict = {'code': '504'}
        return jsonify(return_dict)

    designer_code = request.form.get('designer_code')
    print("邮箱为：" + email)
    print("验证码为：" + designer_code)
    print(key)
    print(designer_code)

    if designer_code == str(key):
        print("验证码正确")
        return_dict = {'code': '202'}
    return jsonify(return_dict)


# 登录
@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 接收
    account = request.form.get('account')
    password = request.form.get('password')
    print("账号为：" + account)
    print("密码为：" + password)

    # 返回
    return_dict = {}
    # 创建数据库
    sql_statement = 'create table if not exists users(email varchar(20),name varchar(40),password varchar(10));'
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    # 查找数据库
    sql_statement = "select password from users where name = '" + account + "'"
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    print(data)
    if data is None:
        # 查找数据库
        sql_statement = "select password from users where email = '" + account + "'"
        db.ping(reconnect=True)
        cursor.execute(sql_statement)
        data = cursor.fetchone()
        print(data)
        if data is None:  # 账号不存在 提醒注册
            return_dict = {'code': '404'}
        else:
            if data[0] == password:  # 密码正确
                # 查找数据库
                sql_statement = "select name from users where email = '" + account + "'"
                db.ping(reconnect=True)
                cursor.execute(sql_statement)
                data = cursor.fetchone()
                print(data[0])
                return_dict = {'code': '202', 'account': data[0]}
            else:  # 密码错误
                return_dict = {'code': '504'}
    else:
        if data[0] == password:  # 密码正确
            return_dict = {'code': '202', 'account': account}
        else:  # 密码错误
            return_dict = {'code': '504'}
    return jsonify(return_dict)


# 忘记密码时的登录
@app.route('/forget_password_sign_in', methods=['POST'])
def forget_password_sign_in():
    # 接收
    global email
    email = request.form.get('email')
    verification_code = request.form.get('verification_code')
    print("账号为：" + email)
    print("密码为：" + verification_code)
    print(key)
    print(verification_code)
    # 查找数据库
    sql_statement = "select name from users where email = '" + email + "'"
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    print(data)
    return_dict = {'code': '404'}
    if data is None:  # 账号不存在 提醒注册
        return_dict = {'code': '504'}
        print("该账号未注册")
    if verification_code == str(key):
        print("验证码正确")
        account = data[0]
        return_dict = {'code': '202', 'account': account}
    return jsonify(return_dict)


# 设置信息
@app.route('/confirm', methods=['POST'])
def confirm():
    # 接收
    name = request.form.get('name')
    password = request.form.get('password')

    # 返回
    return_dict = {'code': '202'}

    # 查找数据库
    sql_statement = "select name from users where name = '" + name + "'"
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    print(data)
    if data is not None:  # 用户名已存在
        return_dict = {'code': '404'}
        return jsonify(return_dict)

    # 将信息写到数据库
    sql_statement = "insert into users(`name`, `email`, `password`) values('" + \
                    name + "', '" + email + "', '" + password + "')"
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    db.commit()  # 保存变更
    return jsonify(return_dict)


# 更改密码
@app.route('/change_password', methods=['POST'])
def change_password():
    # 接收
    name = request.form.get('name')
    password = request.form.get('password')
    new_password = request.form.get('new_password')
    # 验证原密码是否正确
    # 查找数据库
    sql_statement = "select password from users where name = '" + name + "'"
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    print(sql_statement)
    data = cursor.fetchone()
    print(data)
    if data[0] == password:  # 密码正确
        # 更新密码
        sql_statement = "update users set password = '" + new_password + "' where name = '" + name + "'"
        db.ping(reconnect=True)
        cursor.execute(sql_statement)
        db.commit()  # 保存变更
        return_dict = {'code': '202'}
    else:  # 密码错误
        return_dict = {'code': '504'}
    return jsonify(return_dict)


dict_high = ['sin30', 'sin45', 'sin60', 'sin90', 'cos30', 'cos45', 'cos60', 'tan30', 'tan45', 'tan60']


# 随机判断高中的操作数
def generate_high(flag):  # flag用于确保至少一个三角函数
    if random.randint(0, 1) == 1 or flag == True:
        rand = random.randint(0, 9)
        return dict_high[rand]
    else:
        return str(random.randint(1, 100))


dict_middle = ['√4', '√9', '√16', '√25', '√36', '√49', '√64', '√81', '√100',
               '√2', '√8', '√18', '√32', '√50', '√72', '√98',
               '√3', '√12', '√27', '√48', '√75']


# 随机判断带根号的操作数（只允许存在√2，√3）
def generate_middle():
    global leastFlag

    flag = random.randint(0, 2)
    if flag == 1:  # 带有根号
        leastFlag = 1
        rand = random.randint(0, 20)
        return dict_middle[rand]
    elif flag == 2:  # 带有平方
        leastFlag = 1
        return str(random.randint(1, 100)) + '^2'
    else:  # 纯数字
        return str(random.randint(1, 100))


def generate_small():
    rand = random.randint(1, 100)
    return str(rand)


def generate_operation(difficulty):
    if difficulty == '小学':
        return generate_small()
    elif difficulty == '初中':
        return generate_middle()
    elif difficulty == '高中':
        return generate_high(False)


def is_not_contain(problem):
    # 创建表
    sql_statement = 'create table if not exists ' + user_name + '(problem varchar(50));'
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    # 查找数据库
    sql_statement = 'select * from ' + user_name + ' where problem = "' + problem + '"'
    db.ping(reconnect=True)
    cursor.execute(sql_statement)
    data = cursor.fetchone()
    if data is None:  # 不存在相同题目
        return True
    else:
        return False


def save(problem):
    # 输入数据
    global user_name
    sql_statement = 'insert into ' + user_name + '(problem) values("' + problem + '")'
    db.ping(reconnect=True)
    cursor.execute(sql_statement)


operator_precedence = {
    '(': 0,
    ')': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '√': 3,
    '^': 3,  # ^2
    's': 3,  # sin
    'c': 3,  # cos
    't': 3  # tan
}


# 字符串表达式转化为后缀表达式
def postfix_convert(str):
    operator_stack = []  # 运算符栈
    stack = []  # 存储后缀表达式的栈
    i = 0
    while i < len(str):
        if str[i] not in operator_precedence:  # 操作数
            k = i
            while k + 1 < len(str) and '9' >= str[k + 1] >= '0':  # 可能存在两位数或三位数
                k += 1
            stack.append(int(str[i:k + 1]))
            i = k + 1
        else:
            if len(operator_stack) == 0:  # 运算符栈为空，直接入栈
                operator_stack.append(str[i])
            elif str[i] == '(':  # 遇到左括号
                operator_stack.append(str[i])
            elif str[i] == ')':  # 遇到右括号，依次弹出运算符栈的运算符并压入另一个栈，直到遇到左括号，并舍弃该对括号
                while operator_stack[-1] != '(':
                    stack.append(operator_stack.pop())
                operator_stack.pop()
            elif operator_precedence[str[i]] > operator_precedence[operator_stack[-1]]:  # 优先级比栈顶运算符高，直接压入运算符栈
                operator_stack.append(str[i])
            else:
                k = i  # 当运算符栈不为空，且优先级小于等于栈顶运算符，弹出栈顶运算符并压入另一个栈
                while len(operator_stack) != 0 and operator_precedence[str[i]] <= operator_precedence[
                    operator_stack[-1]]:
                    stack.append(operator_stack.pop())
                operator_stack.append(str[i])
            if str[i] == '^':  # ^2
                i = i + 2
            elif str[i] == 's' or str[i] == 'c' or str[i] == 't':  # sin,cos,tan
                i = i + 3
            else:
                i = i + 1
    while len(operator_stack) != 0:  # 运算符栈剩余的运算符依次弹出并压入另一个栈
        stack.append(operator_stack.pop())
    return stack


def calculate(stack):
    temp = []
    for i in range(len(stack)):
        if type(stack[i]) == int:
            temp.append(stack[i])
        else:
            num1 = temp.pop()
            if stack[i] == '+':
                num1 = temp.pop() + num1
                temp.append(num1)
            if stack[i] == '-':
                num1 = temp.pop() - num1
                temp.append(num1)
            if stack[i] == '*':
                num1 = temp.pop() * num1
                temp.append(num1)
            if stack[i] == '/':
                if num1 == 0:
                    return float('nan')
                num1 = temp.pop() / num1
                temp.append(num1)
            if stack[i] == '^':
                temp.append(num1 ** 2)
            if stack[i] == '√':
                temp.append(num1 ** 0.5)
            if stack[i] == 's':
                temp.append(sy.sin(math.radians(num1)))
            if stack[i] == 'c':
                temp.append(sy.cos(math.radians(num1)))
            if stack[i] == 't':
                temp.append(sy.tan(math.radians(num1)))
    return temp[0]


baseOperator = ['+', '-', '*', '/']


# 生成练习题及其选项
@app.route('/generate_exercise', methods=['POST'])
def generate_exercise():
    global user_name
    global difficulty
    global problem_num
    # 接收
    user_name = request.form.get('name')
    difficulty = request.form.get('education')
    problem_num = request.form.get('num')
    print(user_name)
    print(difficulty)
    problem_num = int(problem_num)
    print(problem_num)

    # 返回
    return_exercises = []
    i = 0
    while i < problem_num:
        problem = generate_problem(difficulty)
        i += 1
        # 得到正确答案
        if difficulty == '小学':
            ans = eval(problem)
        else:
            stack = postfix_convert(problem)
            ans = calculate(stack)
        # NaN重新生成题目
        if math.isnan(ans):
            i -= 1
            continue
        # 分配选项
        correct_option = random.randint(0, 3)  # 正确选项的序号
        exercise = {"problem": problem, "0": 0, "1": 0, "2": 0, "3": 0, "correct": correct_option}
        for j in range(correct_option):  # 比正确选项小
            x = random.uniform(ans - 5 * (j + 1), ans - 5 * j)
            exercise[str(correct_option - j - 1)] = '{:.2f}'.format(x)
        exercise[str(correct_option)] = '{:.2f}'.format(ans)  # 正确选项
        for j in range(3 - correct_option):  # 比正确选项小
            x = random.uniform(ans + 0.1 + 5 * j, ans + 5 * (j + 1))
            exercise[str(j + correct_option + 1)] = '{:.2f}'.format(x)
        return_exercises.append(exercise)
        print(i, exercise)
    return jsonify(return_exercises)


def generate_problem(difficulty):
    global leastFlag
    leastFlag = 0
    # 根据随机生成的数字判断操作数和操作符
    problem = ''
    operate_num = 0
    if difficulty == '小学':
        operate_num = random.randint(2, 5)  # 操作数
    if difficulty == '初中' or difficulty == '高中':
        operate_num = random.randint(1, 5)  # 操作数
    if operate_num == 1:  # 只有一个操作数，只可能是初中或者高中
        if difficulty == '高中':
            problem = generate_high(True)
        else:
            problem = generate_middle()
    else:
        # 随机生成操作符
        operators = []
        for j in range(operate_num - 1):
            operators.append(baseOperator[random.randint(0, 3)])

        # 随机生成括号个数
        bracket_num = random.randint(0, operate_num - 2)
        bracket_position = 0  # 最近的左括号位置
        bracket_exist = 0  # 已经插入的括号个数
        for j in range(operate_num - 1):
            if bracket_num > 0 and random.randint(0, 1) == 1 and j <= operate_num - 2:
                # 随机判断是否生成左括号
                problem += '('
                bracket_position = j
                bracket_num -= 1
                bracket_exist += 1
                problem += generate_operation(difficulty)  # 加上操作数
            elif ((j - bracket_position >= 1 and random.randint(0, 1) == 1) or (
                    bracket_position == 0 and j == operate_num - 2)) and bracket_exist > 0:
                problem += generate_operation(difficulty)  # 加上操作数
                # 生成右括号
                problem += ')'
                bracket_exist -= 1
                # 随机判断括号后是否生成平方
                if difficulty == '初中' and random.randint(0, 1) == 1:
                    problem += '^2'
                    leastFlag = 1
            else:
                problem += generate_operation(difficulty)  # 加上操作数

            # 加上操作符
            problem += operators[j]

        if leastFlag == 0 and difficulty == '高中':  # 当生成高中题目时，确保存在一个三角函数
            problem += generate_high(True)
        else:
            problem += generate_operation(difficulty)  # 最后一个操作数

        # 补充未结束的括号
        while bracket_exist != 0:
            bracket_exist -= 1
            problem += ')'
            if difficulty == '初中' and random.randint(0, 1) == 1:
                problem += '^2'
                leastFlag = 1
        # 生成含有多个操作数的计算式结束

    # 当计算式不符合要求，强行添加确保至少有一个
    if leastFlag == 0 and difficulty == '初中':
        problem += '^2'

    if is_not_contain(problem):  # 判断是否重复
        # 保存问题到数据库
        save(problem)
    # ---生成题目完毕---
    return problem


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080)
    db.close()
