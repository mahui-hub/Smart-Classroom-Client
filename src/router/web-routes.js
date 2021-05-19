 export default [{
     path: "kecheng",
     name: "IndexkechengList",
     component: () => import("@/views/first/kecheng/index"),
     meta: {
       title: "课程列表",
       authLogin: true
     },
   },
   {
     path: "kechengdetail",
     name: "IndexkechengDetail",
     props: (route) => ({
       id: route.query.id
     }),
     component: () => import("@/views/first/kecheng/webdetail"),
     meta: {
       title: "课程详情",
       authLogin: true
     },
   },
   {
     path: "xuesheng",
     name: "IndexxueshengList",
     component: () => import("@/views/first/xuesheng/index"),
     meta: {
       title: "学生列表",
       authLogin: true
     },
   },
   {
     path: "gonggao",
     name: "IndexgonggaoList",
     component: () => import("@/views/first/gonggao/index"),
     meta: {
       title: "公告列表",
       authLogin: true
     },
   },
   {
     path: "gonggaodetail",
     name: "IndexgonggaoDetail",
     props: (route) => ({
       id: route.query.id
     }),
     component: () => import("@/views/first/gonggao/webdetail"),
     meta: {
       title: "公告详情",
       authLogin: true
     },
   },
   {
     path: "suitangceshi",
     name: "IndexsuitangceshiList",
     component: () => import("@/views/first/suitangceshi/index"),
     meta: {
       title: "随堂测试列表",
       authLogin: true
     },
   },
   {
     path: "suitangceshidetail",
     name: "IndexsuitangceshiDetail",
     props: (route) => ({
       id: route.query.id
     }),
     component: () => import("@/views/first/suitangceshi/webdetail"),
     meta: {
       title: "随堂测试详情",
       authLogin: true
     },
   },
   {
     path: "tiezi",
     name: "IndextieziList",
     component: () => import("@/views/first/tiezi/index"),
     meta: {
       title: "帖子列表",
       authLogin: true
     },
   },
   {
     path: "tiezidetail",
     name: "IndextieziDetail",
     props: (route) => ({
       id: route.query.id
     }),
     component: () => import("@/views/first/tiezi/webdetail"),
     meta: {
       title: "帖子详情",
       authLogin: true
     },
   },
   {
     path: "wentiqiangda",
     name: "IndexwentiqiangdaList",
     component: () => import("@/views/first/wentiqiangda/index"),
     meta: {
       title: "问题抢答列表",
       authLogin: true
     },
   },
   {
     path: "wentiqiangdadetail",
     name: "IndexwentiqiangdaDetail",
     props: (route) => ({
       id: route.query.id
     }),
     component: () => import("@/views/first/wentiqiangda/webdetail"),
     meta: {
       title: "问题抢答详情",
       authLogin: true
     },
   },

   {
     path: "wentisousuo",
     name: "IndexwentisousuoList",
     component: () => import("@/views/first/wentisousuo/index"),
     meta: {
       title: "问题搜索列表",
       authLogin: true
     },
   },
   {
     path: "qiuzhujiaoshi",
     name: "IndexqiuzhujiaoshiList",
     component: () => import("@/views/first/qiuzhujiaoshi/index"),
     meta: {
       title: "求助教师列表",
       authLogin: true
     },
   },
   {
     path: "qiuzhujiaoshidetail",
     name: "IndexqiuzhujiaoshiDetail",
     props: (route) => ({
       id: route.query.id
     }),
     component: () => import("@/views/first/qiuzhujiaoshi/webdetail"),
     meta: {
       title: "求助教师详情",
       authLogin: true
     },
   },
   {
     path: "tiku",
     name: "IndextikuList",
     component: () => import("@/views/first/tiku/index"),
     meta: {
       title: "题库列表",
       authLogin: true
     },
   },
   {
     path: "tikudetail",
     name: "IndextikuDetail",
     props: (route) => ({
       id: route.query.id
     }),
     component: () => import("@/views/first/tiku/webdetail"),
     meta: {
       title: "题库详情",
       authLogin: true
     },
   },
   {
     path: "keqiankaoqin",
     name: "IndexkeqiankaoqinList",
     component: () => import("@/views/first/keqiankaoqin/index"),
     meta: {
       title: "课前考勤列表",
       authLogin: true
     },
   },
   {
     path: "ziyuan",
     name: "IndexziyuanList",
     component: () => import("@/views/first/ziyuan/index"),
     meta: {
       title: "资源列表",
       authLogin: true
     },
   },
 ];