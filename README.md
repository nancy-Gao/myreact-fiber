## 摘要
react16+的核心源码手写，在16版本class component已经不是必须的，重点内容是function component+hooks, 底层实现fiber架构

## jsx
jsx是通过babel转义成React.createElement执行，构建虚拟dom。
这就是为什么写了jsx就一定需要import react的原因。

## createElement

```html
   <div id='container'>
        <input value="foo" />
        <a href="/bar" />
        <span></span>
   </div>
```
解析成

```javascript

    React.createElement('div', {id: 'container'},
        React.createElement('input', {value: 'foo'}),
        React.createElement('a', {href: '/bar'}),
        React.createElement('span', null))
```

因此就期待返回

```javascript
    const element = {
      type: "div",
      props: {
        id: "container",
        children: [
          { type: "input", props: { value: "foo"} },
          { type: "a", props: { href: "/bar" } },
          { type: "span", props: {} }
    ] }
    };
```
那么createElement方法就知道怎么写了

## render
需要将vdom转为真正的dom，就需要遍历并创建dom

## Concurrent
注意上⾯面的render，一旦开始，就开始递归，本身这个没啥问题，但是如果应⽤用变得庞⼤大后，会有卡顿，后⾯面状态修改后的diff也是一样，整个vdom对象变⼤大后，diff的过程也有会递归过多导致的卡顿。
如何解决这个问题？
浏览器有一个api requestIdleCallback 可以利用浏览器的业余时间，我们可以把任务分成⼀个个的⼩任务，然后利用浏览器空闲时间来做diff，如果当前有任务来了，⽐如⽤户的点击或者动画，会先执行，然后空闲后，再回去把requestIdleCallback没完成的任务完成。
当然react已经重写了调度逻辑，不用requestIdleCallback了，但是过程是一致的。

![before](./before.png)

![after](./after.png)



