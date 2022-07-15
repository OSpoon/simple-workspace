import { createApp } from "vue";
import App from "./App.vue";

import Comps from "@it200/components";
import "@it200/components/src/components/card/src/card.scss";

createApp(App).use(Comps.Card).mount("#app");
