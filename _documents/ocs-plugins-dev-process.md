---
title: "OCS-Plugin介绍"
description: "造轮子，算是静态页面的动态拓展"
date: "2026-2-12"
lc_date: "2026-2-13"
tags: ['TypeScript','JavaScript','Express','HTML','CSS']
---

> 这里原本是 *OCS-Plugins* 其中一个模块 *TodoListServer* 的说明页，但是我发现把很多功能放在一个api里会很方便，于是就改了。

## OCS-Plguins 

OCS-Plugin是我为了更好的处理代办事项所创建的程序，为了在不破坏[AT3K-OCS](/archives/at3k-ocs-intro)的前提下实现和OCS的联动，保证页面风格和理念上的统一。

## 用到的东西

* Linux ~~(WSL2)~~
	* vim
	* nodejs

* Nodejs运行时
	* express(@types/express)
	* @types/node
	* cors
	* nodemon
	* sqlite、sqlite3
	* nodemon
	* ts-node
	* tsx
	* typescript

## TodoList Server

为了和OCS联动而不破坏OCS原有的静态属性，我决定使用next.js的客户端组件完成从TodoListServer获取到显示以及编辑的全部操作。为了实现读取数据库，必须创建一个后端以完成针对数据库的动态操作，我的选择是express，它足够简单，能让人在很短的时间上手，天生就是JavaScript，在与OCS联动的时候没有割裂感。

实现代办清单功能需要储存，读取，操作数据。鉴于待办清单功能数据结构清晰且只有我一个用户（TodoListServer作为OCS的附加功能），数据方面就选择了SQLite。轻量快速的数据库，不需要部署额外服务，也许对于没有服务器的用户比较友好。 ~~虽然TodoListSevrer也需要服务器~~

OCS通过JavaScript（next.js客户端组件）请求API，API返回或操作Todo数据，OCS客户端页面渲染并执行反馈。还算清晰的流程。

### API

```
GET		/todo/list/all			列出所有Todo
GET		/todo/list/running		列出未完成的Todo
GET		/todo/list/complete		列出已完成的Todo

POST	/todo/add				添加一个Todo
POST	/todo/remove			删除一个Todo
POST	/todo/complete			完成一个Todo
```

### 数据持久化

TDL-Server使用本地的SQLite储存所有数据。 ~~你不会有2^63 -1个代办事项的对吗?~~

```
CREATE TABLE IF NOT EXISTS todolist (
        id				INTEGER PRIMARY KEY AUTOINCREMENT,
		tid				INTEGER NOT NULL,
        name			TEXT NOT NULL,
        description		TEXT,
        start_time		TEXT NOT NULL,
        complete_time	TEXT NOT NULL,
        is_complete		BOOL
);
```

我目前所需的属性就这么多，反正是部署在我自己电脑上的，有什么需求可以后面自己加。

## GalgameTimeRender

为了更好的管理玩过的Galgame，我决定把之前用Java写的 *CLI-GalgameTimeManager* 重写到JavaScript上。当然，逻辑部分是相似的。

### 处理数据库相关问题

大概的，记录Galgame可以有"名字，游玩时长"两个基本数据。为了记录这些数据，我们需要往数据库中插入数据，等到需要的时候再次读取，id使用自增主键。问题出现了，我们要更新数据的时候，我们只知道Galgame的"名字，游玩时长"，而无法确认Galgame具体对应的id，导致我们无法找到对应的数据进行更新。

如何解决这个问题呢？

嗯，我们似乎可以获取自增id，只要在SELECT\*的时候把主键带上就行。我刚刚怎么没想到？

没错，是我刚刚太愚蠢了，我们完全可以让数据结构里包含id这一个字段，让typescript自己去寻找数据库返回的id，这样，唯一性就解决了。


## 结语

不要惊讶就这一点内容，作为一个附加的功能性项目，*OCS-Plugins* 真的足够简单，光看流程就直到具体该怎么写了。实现差异应该只有每个人的编程理念和代码复杂度，不过作为练手或者构建非外部云服务也是挺不错的，你可以自己决定一切该怎么实现。
