const { type } = require("jquery");

window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      // 创建元素
      elements = [createELement(selectorOrArrayOrTemplate)];
    } else {
      // 查找元素
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    // 创建数组
    elements = selectorOrArrayOrTemplate;
  }

  function createELement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }

  // 创建一个以jQuery.prototype为原型的对象
  const api = Object.create(jQuery.prototype);

  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArrayOrTemplate.oldApi,
  });

  // 返回一个可以操作elements的对象
  return api;
};

jQuery.fn = jQuery.prototype = {
  // 如果不写，__proto__上会没有jQuery，即$obj.constructor===jQuery为false
  // constructor: jQuery,

  jQuery: true,
  // 遍历所有元素并添加className
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
    }
    return this;
  },

  // 根据选择器查找元素
  find(selector) {
    const array = [];
    for (let i = 0; i < this.elements.length; i++) {
      array.push(...this.elements[i].querySelectorAll(selector));
    }
    array.oldApi = this;
    return $(array);
  },

  // 返回上一次的api
  end() {
    return this.oldApi;
  },

  // 遍历元素
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },

  // 获取父元素
  parent() {
    const array = [];
    this.each((child) => {
      if (array.indexOf(child.parentNode) === -1) {
        array.push(child.parentNode);
      }
    });
    return $(array);
  },

  // 获取子元素
  children() {
    const array = [];
    this.each((parent) => {
      array.push(...parent.children);
    });
    return $(array);
  },

  // 打印当前api所对应的元素
  print() {
    console.log(this.elements);
  },

  // 把div元素添加到页面中
  appendTo(node) {
    if (node instanceof Element) {
      this.each((el) => node.appendChild(el));
    } else if (node.jQuery === true) {
      this.each((el) => {
        node.each((el2) => {
          el2.appendChild(el);
        });
      });
    }
  },

  // 删除elements中所有元素
  remove() {
    const array = [];
    this.each((el) => {
      array.push(el.parentNode.removeChild(el));
    });
    return $(array);
  },

  // 删除elements中所有元素的子元素
  empty() {
    const array = [];
    this.each((el) => {
      // console.log(el.firstChild);
      // el.removeChild(el.firstChild);
      while (el.firstChild) {
        array.push(el.removeChild(el.firstChild));
      }
    });
    return $(array);
  },

  // 读写文本内容
  text(string) {
    if (arguments.length === 0) {
      const array = [];
      this.each((el) => {
        if ("innerText" in el) {
          array.push(el.innerText);
        } else {
          array.push(el.textContent);
        }
      });
      return array;
    } else if (arguments.length === 1) {
      this.each((el) => {
        if ("innerText" in el) {
          el.innerText = string;
        } else {
          el.textContent = string;
        }
      });
    }
  },

  // 读写HTML内容
  html(string) {
    if (arguments.length === 0) {
      const array = [];
      this.each((el) => {
        array.push(el.innerHTML);
      });
      return array;
    } else if (arguments.length === 1) {
      this.each((el) => {
        el.innerHTML = string;
      });
    }
  },

  // 读写属性
  attr(key, value) {
    if (arguments.length === 1) {
      const array = [];
      this.each((el) => {
        array.push(el.getAttribute(key));
      });
      return array;
    }
    if (arguments.length === 2) {
      this.each((el) => {
        el.setAttribute(key, value);
      });
    }
  },

  // 读写样式
  css(property, value) {
    if (arguments.length === 1) {
      if (typeof arguments[0] === "object") {
        for (let key in property) {
          this.each((el) => {
            el.style[key] = property[key];
          });
        }
      } else if (typeof arguments[0] === "string") {
        const array = [];
        this.each((el) => {
          array.push(el.style[property]);
        });
        return array;
      }
    }
    if (arguments.length === 2) {
      this.each((el) => {
        el.style[property] = value;
      });
    }
  },

  // 添加class
  addClass(className) {
    this.each((el) => {
      el.classList.add(className);
    });
  },

  // 添加fn
  on(eventName, fn) {
    this.each((el) => {
      el.addEventListener(eventName, fn);
    });
  },

  // 删除fn
  off(eventName, fn) {
    this.each((el) => {
      console.log(fn.name);
      el.removeEventListener(eventName, fn);
    });
  },
};
