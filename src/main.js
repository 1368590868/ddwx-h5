import "amfe-flexible";
import Vue from "vue";
import App from "./App";
import router from "./router/index.js";
import store from "./store/index.js";
import "vant/lib/index.css";
import "./styles/index.less";
import * as filters from "./utils/filters.js"; // global filters
import MobilePlatform from "@/utils/MobilePlatform.js";
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.use(MobilePlatform);
import "./permission"; // permission control

import NotEmpty from "@/components/NotEmpty";
import AllOrderDetail from "@/components/AllOrderDetail";
import OrderListCardItem from "@/components/OrderListCardItem";
import OrderListCardItemInfo from "@/components/OrderListCardItemInfo";
import SelectCarIAndDrive from "@/components/SelectCarIAndDrive";
Vue.component("NotEmpty", NotEmpty);
Vue.component("AllOrderDetail", AllOrderDetail);
Vue.component("OrderListCardItem", OrderListCardItem);
Vue.component("OrderListCardItemInfo", OrderListCardItemInfo);
Vue.component("SelectCarIAndDrive", SelectCarIAndDrive);
import {
  Row,
  Col,
  Button,
  Tabbar,
  TabbarItem,
  NavBar,
  Form,
  Field,
  Area,
  Popup,
  Picker,
  RadioGroup,
  Radio,
  Tag,
  Step,
  Steps,
  Tabs,
  Tab,
  Badge,
  DatetimePicker,
  Calendar,
  Notify,
  ActionSheet,
  List,
  Dialog,
  NoticeBar,
  PullRefresh,
  Cell,
  CellGroup,
  Sticky,
  Collapse,
  CollapseItem,
  Icon,
  Image as VanImage,
  Panel,
  Switch,
  Cascader,
  Grid,
  GridItem,
  Uploader,
  TreeSelect ,
} from "vant";
Vue.use(Row);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Sticky);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(PullRefresh);
Vue.use(NoticeBar);
Vue.use(Dialog);
Vue.use(List);
Vue.use(ActionSheet);
Vue.use(Notify);
Vue.use(Calendar);
Vue.use(DatetimePicker);
Vue.use(Badge);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Tag);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Area);
Vue.use(Field);
Vue.use(Form);
Vue.use(NavBar);
Vue.use(Button);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Icon);
Vue.use(Panel);
Vue.use(Switch);
Vue.use(Cascader);
Vue.use(Uploader);
Vue.use(VanImage);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(TreeSelect);

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
if (process.env.NODE_ENV === "development") {
  (function () {
    var src =
      "https://cdn.bootcdn.net/ajax/libs/vConsole/3.4.1/vconsole.min.js";
    document.write("<scr" + 'ipt src="' + src + '"></scr' + "ipt>");
    document.write("<scr" + "ipt>var vConsole = new VConsole();</scr" + "ipt>");
  })();
}
new Vue({
  store,
  router,
  el: "#app",
  render: (h) => h(App),
});
