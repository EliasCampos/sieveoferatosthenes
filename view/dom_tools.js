function elt(tagName, properties, ...children) {
    let node = document.createElement(tagName);
    Object.assign(node, properties);

    for (let child of children) {
        if (typeof child !== 'string') node.appendChild(child);
        else node.appendChild(document.createTextNode(child));
    }

    return node;
}

