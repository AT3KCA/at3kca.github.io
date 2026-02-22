---
title: "Chromium内核浏览器backdrop-filter在元素超过16384px时失效"
description: "height到达2^14的神秘特性，我认为这个特性可能会推广到所有基于Chromium内核的浏览器上"
date: "2026-2-15"
tags: ['Bug','Edge','Chrome']
author: "AT3K\_CA"
---

> Microsoft Edge 145.0.3800.58(正式版) x64
>
> Google Chrome 145.0.7632.76(正式版) x64
>
> 鉴于2026/2/19该bug已经不在被触发，我认为这是我自己的问题

## 情景

每日调试 **AT3K-OCS** 并更新文档。

当时正在使用 **Firefox** 回看每日日志，切换到 **Edge** 后，发现有个别文章的 *backdrop-filter: blur(5px);* 属性会莫名失效，于是开始测试。

## 过程和定位方法论

切换到edge后，发现该问题，于是在edge开发者工具中试图通过开关属性重启 *backdrop-filter* ，自然是无用功。一开始是怀疑markdown转html时，把某个css属性顶掉了，经过分析和测试markdown转换的元素，发现不是它们的问题。是的，正常思路到这里就结束了。

然后我查看OCS的html结构，发现由于 *AT3K-OCS* 特有的 ~~迫真~~ 结构，main元素的高度超过了20000px。main元素应用了我实现半透明毛玻璃效果的backdrop-filter属性（非最佳实践）。我此前没有遇见过如此高的元素，于是想着是不是因为main太高了，开始一个个删除main内的元素，删除到某个元素的时候，edge恢复正常。

此时main高16381px，然后我添加撤销了一个删除，backdrop-filter再次失效，这时main高16390px。嗯，16384？于是我直接调整main的height属性，到16384px时，一切正常，16385px，backdrop-filter失效。开关属性无作用

2^14 = 16384，看起来挺巧合的。

为了确定条件，我写了一个最小复现案例，有着background-image的body和设置height的backdrop-filter层。经过测试发现当块级元素到达16385px时，backdrop-filter属性失效。看起来，这里的边界情况是16384px，由于没有过于有能的技术，我便没有继续探究下去，如果并非特意设计，这应该算是渲染的bug。

> 最后在Google Chrome浏览器中也进行了测试，现象相同。

## 最小复现代码

### HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>BDF 16384px Demo</title>
</head>
<body style="background-image: url('http://localhost:3000/background.png')">
<div class="change-height bdf"></div>
</body>
</html>
```

### CSS

```css
.change-height {
	height: 16384px; //16384px -> 16385px
}
.bdf {
	backdrop-filter: blur(5px);
}
```

## 结论

元素height超过16384px时，会导致backdrop-filter属性失效，有最小的简单复现。

该问题仅在以Chromium为内核的浏览器中出现，Firefox无该情况。

## 影响

我认为元素高度超过16384px并且同时应用backdrop-filter的页面还是少数，影响甚至可能仅限AT3K-OCS，我没有修改代码，如果你使用 *Chromium* 看见了我的某篇日志页面的半透明效果失效，那应该就是这个bug了。
