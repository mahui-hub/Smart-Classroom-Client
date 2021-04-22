import store from "@/store";
//前台路由
import WebRoutes from "./web-routes";
//后台路由
import AdminRoutes from "./admin-routes";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/layout/first/home"),
    redirect: "/index",
    meta: { title: "前台管理", authLogin: true },
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/first/index"),
        meta: { title: "首页", authLogin: true },
      },
      ...WebRoutes,
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login"),
    meta: { title: "系统登录" },
  },
  {
    path: "/end",
    name: "End",
    component: () => import("@/layout/end"),
    redirect: "/end/sy",
    meta: { title: "后台管理", authLogin: true },
    children: [
      {
        path: "sy",
        name: "AdminSy",
        component: () => import("@/layout/end/sy"),
        meta: { authLogin: true, title: "欢迎页", affix: true },
      },
      {
        path: "mod",
        name: "AdminMod",
        component: () => import("@/views/end/mod/index"),
        meta: { authLogin: true, title: "修改密码" },
      },
      {
        path: "total",
        name: "AdminTotal",
        component: () => import("@/views/total/total"),
        meta: { authLogin: true, title: "统计" },
        props: (route) => ({ src: route.query.src }),
      },
      ...AdminRoutes,
    ],
  },
];

export default routes;
