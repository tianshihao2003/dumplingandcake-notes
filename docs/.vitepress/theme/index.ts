import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import "./styles/vars.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/markdown.css";
import "./styles/code.css";

export default {
	Layout,
} satisfies Theme;
