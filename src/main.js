import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import UtilsAjax from "@/utils/ajax";
import Components from "./components";
import "./styles/styles.scss";
import "./assets/style.scss";
import "./router/permission";
import "font-awesome/css/font-awesome.css";
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import VideoPlayer from "vue-video-player";
import hls from "videojs-contrib-hls";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

Vue.use(Antd);

/* eslint-disable no-new */

Vue.use(VideoPlayer);

Vue.use(hls);

Vue.use(UtilsAjax);
Vue.use(ElementUI, {
  size: "small",
});
Vue.use(Components);

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV !== "production";
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
