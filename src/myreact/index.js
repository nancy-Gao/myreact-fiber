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
    Object.keys(vdom.props).forEach(name => {
        if(name !== 'children') {
            dom[name] = vdom.props[name];
        }
    });
    // 递归渲染子元素
    vdom.props.children.map(child=> render(child, dom));
    // 添加到容器
    container.appendChild(dom);
    //container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
};
export default {
    createElement,
    render
}
