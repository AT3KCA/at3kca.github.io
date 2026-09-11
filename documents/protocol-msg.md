---
title: 'AT3K_CA标准协议'
slug: ''
date: '2026-9-11'
description: '2026/11'
tag: ['Protocol']
categories: ''
draft: true
author: 'AT3K_CA'
---

我们可以在网页中留下RSA2048公钥，使用这串公钥对AES256-CBC密钥与IV进行加密，然后使用AES256处理文本，实现安全的通信。

虽然，RSA在未来可能不再安全了。

这就是个简陋的信息加密协议。
