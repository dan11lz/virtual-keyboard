export default function set(el, classNames, child, parent, ...dataAttr) {
  const unit = document.createElement(el);
  if (classNames) unit.classList.add(...classNames.split(' '));

  if (child) {
    if (child && Array.isArray(child)) {
      child.forEach((e) => unit.append(e));
    } else if (typeof child === 'string') {
      unit.innerHTML = child;
    } else {
      unit.append(child);
    }
  }

  if (parent) {
    parent.append(unit);
  }

  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (
        attrName.match(/value|id|placeholder|cols|rows|autocorrect|spellcheck/)
      ) {
        unit.setAttribute(attrName, attrValue);
      } else {
        unit.dataset[attrName] = attrValue;
      }
    });
  }
  return unit;
}
