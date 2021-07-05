import "./styles.css";
import cat from "./img.svg";
import {logger1} from "./shared-file1";

logger1();

const $heading = document.createElement("h1");
$heading.textContent = "Webpack";

const $root = document.querySelector("#root");
$root.append($heading);

const imgWrapper = document.createElement('div');
imgWrapper.innerHTML = cat;
$root.append(imgWrapper);

setTimeout(() => { import("./heavyFile") }, 3000);
