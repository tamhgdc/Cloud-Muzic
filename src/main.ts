import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

let app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.mount("#app");
