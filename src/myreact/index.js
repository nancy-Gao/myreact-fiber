const createTextElement = text => {
    return {
        type: 'TEXT',
        props: {
            nodeValue: text,
            children: [],
        }
    }
};
const createElement = (type, props, ...children)=> {
    delete props.__source;
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'object' ? child : createTextElement(child)),
        }
    }
};
const createDom = (vdom)=> {
    const dom = vdom.type === 'TEXT' ? document.createTextNode('') : document.createElement(vdom.type);
    // 给dom设置属性
    Object.keys(vdom.props)
    .filter(child=>child !== 'children')
    .map(name => {
        // todo 设置属性
        dom[name] = vdom.props[name];
    });
    return dom;
};
const render = (vdom, container)=> {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [vdom],
        }
    }
    // const dom = createDom(vdom);
    // // 递归渲染子元素
    // vdom.props.children.map(child=> render(child, dom));
    // // 添加到容器
    // container.appendChild(dom);
    //container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
};
// 下个任务单元,同时render会初始化第一个任务
let nextUnitOfWork = null;
// 调度diff和渲染任务
const workLoop = (idleDeadline)=> {
    // 有下个任务并且当前桢还没有结束
    // timeRemaining => 还剩余多少闲置时间可以用来执行耗时任务
    while(nextUnitOfWork && idleDeadline.timeRemaining() >=1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    // 当前任务没有 或者 下个桢没有了则触发requestIdleCallback，获取下一个任务
    requestIdleCallback(workLoop)
}
/**
 * fiber = {
 *    type,
 *    props,
 *    dom,
 *    parent,
 *    child,
 *    sibling,
 * }
 */
// 获取下个任务
const performUnitOfWork = (fiber) => {
    // 基本任务
    if(!fiber.dom) {
        // 不是入口
        fiber.dom = createDom(fiber);
        // 创建真实dom
    }
    if(fiber.parent) {
        // 添加真实dom
        fiber.parent.dom.appendChild(fiber.dom);
    }
    const elements = fiber.props.children;
    // 构建fiber结构
    let index = 0;
    let prevSibling = null;
    while (index < elements.length) {
        let element = elements[index];
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        };
        if(index === 0) {
            // 第一个子元素，是父fiber的child属性
            fiber.child = newFiber;
        } else {
            // 否则记录上一个子元素的相邻兄弟为当前元素
            prevSibling.sibling = newFiber;
        }
        // 更新上一个子元素
        prevSibling = fiber;
        index++;
    }
    // 基本任务构建结束
    // 找下一个任务
    // 先找子元素
    if(fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber;
    while (nextFiber) {
        // 再找相邻兄弟
        if(nextFiber.sibling) {
            return nextFiber.sibling;
        }
        // 没有的话回到父元素
        nextFiber = nextFiber.parent;
    }
}
// requestIdleCallback 启动
// callback会得到一个IdleDeadline的参数
requestIdleCallback(workLoop)
export default {
    createElement,
    render
}
