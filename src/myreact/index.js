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
    container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
};
export default {
    createElement,
    render
}
