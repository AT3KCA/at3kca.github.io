---
title: "OCS-Origin方案"
description: "别满足于现代前端框架带来的便利，试着脱离框架重写OCS"
date: "2026-2-17"
tags: ['HTML','CSS','JavaScript','Express']
---

## OCS-Origin

某天注意到nextjs所导出的前端页面具体代码是极其难以理解的，充斥着莫名其妙的js块和不能直接看到含义的元素。

为了防止OCS生成的页面代码过于混乱，我们使用HTML/CSS/JS重写OCS，也许需要其它语言辅助生成静态页面。

也许OCS会有很长一段时间只能停留在markdown文档的形式，不过在这段时间，你仍可以在github获得比较好的访问效果。

## 会用到什么呢

* Linux ~~(WSL2)~~
	* vim
	* python3 (-m http.server port)
* HTML
* CSS
* JavaScript

## 主要目的

对于一个静态文档展示页，首先要展示文档......对吧。 ~~文档页一定要展示文档。~~ 

## 思考过程

草，光是展示静态文档就把我难住了，之前搞过一个markdown自动转html的脚本，但是用起来很不顺手，这次想想怎么用js实现？让静态服务器挂着public的markdown文档，然后js去fetch，去处理。

对的，我找到一个[marked - github](https://github.com/markedjs/marked)项目来完成任务，它直接就可以添加在浏览器中，我将它下载到项目目录备用。不过既然是直接生成html文件，我们似乎也不需要这个。

如果选择了js载入文档，我们也许会像是从前端中fetch托管服务器的markdown文件然后在进行渲染，也许需要客户端支持js。

---

为了实现nextjs里的模块化组件，我们来写一个python脚本来替换字符串吧。从头开始，我们直接搜索 *Python 文件读取* ，工具终究还是要服务于人的。不行，这是在造轮子，我们试着使用Python的一些模板库帮助我们构建吧。

Python直接为我们提供了markdown解析库

```
pip install markdown markdown-it-py pymdown-extensions
pip install python-frontmatter
```

为了得到配置文件，我们在加个 **yaml** 解析

```
pip install	pyyaml
```

~~嗯，我真的需要把项目从nextjs迁移到纯html吗~~

把 **template.html** 中加入一些占位符，这样我们使用Python解析markdown的html代码就可以通过读取模板文件然后replace的方式填充到html中，接着使用python自带的字典建立见键值对创建路由，使用Meta建立tags。

我们其实不过就是把nextjs在编译时自动进行的路由处理和页面生成交给Python **分步手动** 处理，得益于Python简单的语法和功能多样的库，我们可以很快且直观的完成这些任务。

## 如何实现

编写静态页面生成器需要处理 **文档路径** 和 **网页路由** 的关系，比如我们的一个文档映射关系是这样的

```
./_documents/something.md ---> /archives/something/index.html
```

在这个 **index.html** 中，存放markdown文档转成的html。

为了实现从markdown文档到html视图的转换，我们的脚本需要 **读取 解析 替换模板 生成路由 输出**，所以我编写了一系列函数来帮我进行这些操作。

编写所有的函数，便是完成静态站点生成器所需要做的。

### 读取

直接使用python自带的 **open** 函数打开文件，然后使用 **read** 一次性全读完所有内容，返回字符串备用。

### 解析

python为我们提供了解析markdown的库

```
md = markdown.Markdown(extensions=['extra','meta','pymdownx.tasklist','pymdownx.tilde']) # 获取markdown解析对象
md_fm = frontmatter.loads(md_content) # 获取frontmatter解析对象,frontmatter就是markdown文档开始前的元数据
metadata = md_fm.metadata # 得到元数据,想看具体结构可以print一下
md_html = md.convert(md_fm.content) # 使用fm解析对象得到的markdown正文得到html正文
```

现在我们就得到了markdown的元数据和它的html形式正文，等到 **替换模板** 的时候，就把这两样东西交上去。

### 替换模板

我们肯定不希望变更一点html需要改动许多文件，所以，我们让html文档模块化。类似于react、vue的模块化组件，不过这个模块化是概念上的。

这里和 **生成路由** 是我认为整个过程中最困难的地方。说实话，目前还真难到我了。

比如一个 **archivelink** 文章链接组件，我们可能希望它可以被复用，比如嵌入到其它范围更大的模板中。这意味着我们的模板引擎可能类似于一种树状结构，也许需要用户来手动完成这个树并设置替换内容？

**archivelink** 在 **content** 里， 而 **content** 又在 **template(最高层模板)** 里，如果 **content** 要加入其它模板，说明从 **archivelink** 这里要开始分叉，更何况，还有一个 **leftbar** 组件是和 **content** 同层的。

这太难了，作为一个还没系统学过计算机科学的高中学生，这已经超出我能力之外了。所以我们来用python的模板引擎吧，看起来和我的意思差不多。

~~当然，OCS-Origin的理念是个人化，你完全不必像我一样实现模板引擎。OCS-Origin仅仅是为这种方式提供了例子和理念~~

使用 **Mako** 还是 **Jinjia2** 作为模板引擎呢。

---

OCS-Origin已经支持Archive的Home页和导航了，经过修改，执行一次Python脚本的速度比使用npm run build的速度块很多。很有可能，你现在看到的页面就是OCS-Origin。
