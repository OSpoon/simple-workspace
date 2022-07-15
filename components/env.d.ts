/// <reference types="vite/client" />
declare module "*vue" {
  import { ComponentOptions } from "vue";
  const ComponentOptions: ComponentOptions;
  export default ComponentOptions;
}
