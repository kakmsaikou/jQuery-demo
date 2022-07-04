const { fn } = require("jquery");

let div1 = $("#div1");
let fn1 = () => console.log("Hello World");
div1.on("click", fn1, "span");
