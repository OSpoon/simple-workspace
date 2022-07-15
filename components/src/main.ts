import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";

import Card from "./components/card/index";
import "./components/card/src/card.scss";

createApp(App).use(Card).mount("#app");
