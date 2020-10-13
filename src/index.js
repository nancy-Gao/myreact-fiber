// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './myreact';
let ReactDOM = React;

let element = <div>
    <h1>this is subTitle</h1>
    <p>this is content</p>
    <div>
        <h1>this is subTitle</h1>
        <p>this is sub content</p>
    </div>
</div>;
ReactDOM.render(element, document.getElementById('root'));
