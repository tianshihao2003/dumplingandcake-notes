---
title: "MySQL安装文档"
node_token: Fv4zwarDNiAe4QkD7NQcdBCwnne
obj_token: EtnKd9yYyo59M9xdnsuckMwRnBd
obj_type: docx
space_id: ""
url: https://ocn0tgqr5oz2.feishu.cn/wiki/Fv4zwarDNiAe4QkD7NQcdBCwnne
edited_at: "1794726049"
exported_at: "2026-11-24T12:36:38.435Z"
cover: false
date: 2026-11-24
---
## 解压

下载完成后我们得到的是一个压缩包，将其解压到一个没有中文的目录下，我们就可以得到 MySQL  的软件本体了(就是一个文件夹)，我们可以把它放在你想安装的位置 。

![](./static/MySQL安装文档-cUBhTnKc.png)

## 配置

### 添加环境变量

> [!success] 
> 环境变量里面有很多选项，这里我们只用到`Path`这个参数。为什么在初始化的开始要添加环境变量呢？
>
> 在黑框(即CMD)中输入一个可执行程序的名字，Windows会先在环境变量中的`Path`所指的路径中寻找一遍，如果找到了就直接执行，没找到就在当前工作目录找，如果还没找到，就报错。我们添加环境变量的目的就是能够在任意一个黑框直接调用MySQL中的相关程序而不用总是修改工作目录，大大简化了操作。

右键`此电脑`→`属性`，点击`高级系统设置`

![](./static/MySQL安装文档-cdprvnnh.png)

点击`环境变量`

![](./static/MySQL安装文档-cSOuKnwg.png)

在`系统变量`中找到并**双击**`Path`

![](./static/MySQL安装文档-coeIunvc.png)

点击`新建`

![](./static/MySQL安装文档-cyPwhnve.png)

最后点击确定 。

**如何验证是否添加成功？**

右键开始菜单(就是屏幕左下角)，选择`命令提示符(管理员)`，打开黑框，敲入`mysql`，回车。

![](./static/MySQL安装文档-cQIaMn8c.png)

如果提示`Can't connect to MySQL server on 'localhost'`则证明添加成功；

![](./static/MySQL安装文档-c9Liun3d.png)

如果提示`mysql不是内部或外部命令，也不是可运行的程序或批处理文件`则表示添加添加失败，请重新检查步骤并重试。

### 初始化

以管理员身份，运行命令行窗口：

![](./static/MySQL安装文档-c9bIWn1e.png)

在刚才的命令行中，输入如下的指令：

```sql
mysqld --initialize-insecure
```

![](./static/MySQL安装文档-cLSMFn24.png)

稍微等待一会，如果出现没有出现报错信息，则证明data目录初始化没有问题，此时再查看MySQL目录下已经有data目录生成。

![](./static/MySQL安装文档-cNcgunld.png)

tips：如果出现如下错误

![](./static/MySQL安装文档-cjCjVnne.png)

是由于权限不足导致的，以 **管理员方式运行 cmd**

![](./static/MySQL安装文档-cBccrnvb.png)

### 注册MySQL服务

命令行（注意必须以管理员身份启动）中，输入如下的指令，回车执行：

```sql
mysqld -install
```

![](./static/MySQL安装文档-cIFLZnnh.png)

现在你的计算机上已经安装好了MySQL服务了。

### 启动MySQL服务

在黑框里敲入`net start mysql`，回车。

```sql
net start mysql  // 启动mysql服务
    
net stop mysql  // 停止mysql服务
```

![](./static/MySQL安装文档-cvCWsnub.png)

### 修改默认账户密码

在黑框里敲入`mysqladmin -u root password 1234`，这里的`1234`就是指默认管理员(即root账户)的密码，可以自行修改成你喜欢的。

```sql
mysqladmin -u root password 1234
```

![](./static/MySQL安装文档-c6PBanlg.png)

## 登录

点击开始菜单，输入CMD，打开命令行，打开黑框。

在黑框中输入，`mysql -uroot -p1234`，回车，出现下图且左下角为`mysql>`，则登录成功。

```sql
mysql -uroot -p1234
```

![](./static/MySQL安装文档-cY7QrnNA.png)

**到这里你就可以开始你的MySQL之旅了！**

退出mysql：

```sql
exit
```

登录参数：

```sql
mysql -u用户名 -p密码 -h要连接的mysql服务器的ip地址(默认127.0.0.1) -P端口号(默认3306)
```

## 卸载

如果你想卸载MySQL，也很简单。

点击开始菜单，输入cmd，选择 "命令提示符"，选择右侧的 "以管理员身份运行"。

![](./static/MySQL安装文档-cBTIFnFf.png)

1. 敲入`net stop mysql`，回车。

![](./static/MySQL安装文档-crir5nGc.png)

1. 再敲入`mysqld -remove mysql`，回车。

![](./static/MySQL安装文档-cgoURnqh.png)

1. 最后删除MySQL目录及相关的环境变量。

**至此，MySQL卸载完成！**