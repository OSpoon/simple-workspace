import type { App } from "vue";
import Card from "./src/index.vue";

export default {
  install(app: App) {
    app.component(Card.name, Card);
  },
};
