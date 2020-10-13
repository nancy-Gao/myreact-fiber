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
const render = (vdom, container)=> {
    const dom = vdom.type === 'TEXT' ? document.createTextNode('') : document.createElement(vdom.type);
    // 给dom设置属性
    Object.keys(vdom.props)
    .filter(child=>child !== 'children')
    .map(name => {
        // todo 设置属性
        dom[name] = vdom.props[name];
    });
    // 递归渲染子元素
    vdom.props.children.map(child=> render(child, dom));
    // 添加到容器
    container.appendChild(dom);
    //container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
};
// 下个任务单元,同时render会初始化第一个任务
let nextUnitWork = null;
// 调度diff和渲染任务
const workLoop = (idleDeadline)=> {
    // 有下个任务并且当前桢还没有结束
    // timeRemaining => 还剩余多少闲置时间可以用来执行耗时任务
    while(nextUnitWork && idleDeadline.timeRemaining() >=1) {
        nextUnitWork = exeUnitWork(nextUnitWork);
    }
    // 当前任务没有 或者 下个桢没有了则触发requestIdleCallback，获取下一个任务
    requestIdleCallback(workLoop)
}
// 获取下个任务
const exeUnitWork = (fiber) => {

}
// requestIdleCallback 启动
// callback会得到一个IdleDeadline的参数
requestIdleCallback(workLoop)
export default {
    createElement,
    render
}
