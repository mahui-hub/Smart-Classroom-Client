import store from "@/store";

export default [{
    path: "qiangdawentiupdt",
    name: "AdminqiangdawentiUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/qiangdawenti/updt"),
    meta: {
      title: "编辑抢答问题",
      authLogin: true
    },
  },
  {
    path: "qiangdawenti",
    name: "AdminqiangdawentiList",
    component: () => import("@/views/end/qiangdawenti/list"),
    meta: {
      title: "抢答问题列表",
      authLogin: true
    },
  },
  {
    path: "qiangdawenti_qiangdaren",
    name: "AdminqiangdawentiListqiangdaren",
    component: () => import("@/views/end/qiangdawenti/list-qiangdaren"),
    meta: {
      title: "抢答问题管理 - 学生",
      authLogin: true
    },
  },
  {
    path: "ziyuanfenlei",
    name: "AdminziyuanfenleiList",
    component: () => import("@/views/end/ziyuanfenlei/index"),
    meta: {
      title: "资源分类列表",
      authLogin: true
    },
  },
  {
    path: "qiangdawentidetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminqiangdawentiDetail",
    component: () => import("@/views/end/qiangdawenti/detail"),
    meta: {
      title: "抢答问题详情"
    },
  },
  {
    path: "pingyuewenti_qiangdaren",
    name: "AdminpingyuewentiListqiangdaren",
    component: () => import("@/views/end/pingyuewenti/list-qiangdaren"),
    meta: {
      title: "评阅问题列表 - 学生",
      authLogin: true
    },
  },
  {
    path: "pingyuewentidetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminpingyuewentiDetail",
    component: () => import("@/views/end/pingyuewenti/detail"),
    meta: {
      title: "评阅问题详情"
    },
  },
  {
    path: "pingyuewenti",
    name: "AdminpingyuewentiList",
    component: () => import("@/views/end/pingyuewenti/list"),
    meta: {
      title: "评阅问题列表",
      authLogin: true
    },
  },

  {
    path: "pingyuewentiupdt",
    name: "AdminpingyuewentiUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/pingyuewenti/updt"),
    meta: {
      title: "编辑评阅问题",
      authLogin: true
    },
  },

  {
    path: "chengji_xuehao",
    name: "AdminchengjiListxuehao",
    component: () => import("@/views/end/chengji/list-xuehao"),
    meta: {
      title: "成绩列表",
      authLogin: true
    },
  },
  {
    path: "chengji",
    name: "AdminchengjiList",
    component: () => import("@/views/end/chengji/list"),
    meta: {
      title: "成绩列表",
      authLogin: true
    },
  },
  {
    path: "chengjibili",
    name: "AdminchengjiList",
    component: () => import("@/views/end/chengji/biliindex"),
    meta: {
      title: "成绩比例列表",
      authLogin: true
    },
  },

  {
    path: "chengjiupdt",
    name: "AdminchengjiUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/chengji/updt"),
    meta: {
      title: "编辑成绩",
      authLogin: true
    },
  },
  {
    path: "chengjidetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminchengjiDetail",
    component: () => import("@/views/end/chengji/detail"),
    meta: {
      title: "成绩详情"
    },
  },
  {
    path: "xueshenghuping_hupingren",
    name: "AdminxueshenghupingListhupingren",
    component: () => import("@/views/end/xueshenghuping/list-hupingren"),
    meta: {
      title: "学生互评查询",
      authLogin: true
    },
  },
  {
    path: "xueshenghuping",
    name: "AdminxueshenghupingList",
    props: (route) => ({
      xuehao: route.query.xuehao
    }),
    component: () => import("@/views/end/xueshenghuping/list"),
    meta: {
      title: "学生互评列表",
      authLogin: true
    },
  },

  {
    path: "xueshenghupingupdt",
    name: "AdminxueshenghupingUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/xueshenghuping/updt"),
    meta: {
      title: "编辑学生互评",
      authLogin: true
    },
  },
  {
    path: "xueshenghupingdetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminxueshenghupingDetail",
    component: () => import("@/views/end/xueshenghuping/detail"),
    meta: {
      title: "学生互评详情"
    },
  },
  {
    path: "xuesheng",
    name: "AdminxueshengList",
    component: () => import("@/views/end/xuesheng/index"),
    meta: {
      title: "学生列表",
      authLogin: true
    },
  },
  {
    path: "xueshengdetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminxueshengDetail",
    component: () => import("@/views/end/xuesheng/detail"),
    meta: {
      title: "学生详情"
    },
  },
  {
    path: "xueshengupdtself",
    name: "AdminxueshengUpdtSelf",
    props: (route) => ({
      id: store.state.user.session.id
    }),
    component: () => import("@/views/end/xuesheng/updt"),
    meta: {
      title: "修改学生资料",
      authLogin: true
    },
  },
  {
    path: "wentisousuo",
    name: "AdminwentisousuoList",
    component: () => import("@/views/end/wentisousuo/index"),
    meta: {
      title: "问题搜索列表",
      authLogin: true
    },
  },
  {
    path: "wentisousuodetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminwentisousuoDetail",
    component: () => import("@/views/end/wentisousuo/detail"),
    meta: {
      title: "问题搜索详情"
    },
  },
  {
    path: "xueyuan",
    name: "AdminxueyanList",
    component: () => import("@/views/end/xueyuan/index"),
    meta: {
      title: "学院列表",
      authLogin: true
    },
  },
  {
    path: "zhicheng",
    name: "AdminzhichenList",
    component: () => import("@/views/end/zhicheng/index"),
    meta: {
      title: "职称列表",
      authLogin: true
    },
  },
  {
    path: "zhuanye",
    name: "AdminzhuanyeList",
    component: () => import("@/views/end/zhuanye/index"),
    meta: {
      title: "专业列表",
      authLogin: true
    },
  },
  {
    path: "banji",
    name: "AdminbanjiList",
    component: () => import("@/views/end/banji/index"),
    meta: {
      title: "班级列表",
      authLogin: true
    },
  },
  {
    path: "jiaoshi",
    name: "AdminjiaoshiList",
    component: () => import("@/views/end/jiaoshi/index"),
    meta: {
      title: "教师列表",
      authLogin: true
    },
  },
  {
    path: "jiaoshiupdt",
    name: "AdminjiaoshiUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/jiaoshi/updt"),
    meta: {
      title: "编辑教师",
      authLogin: true
    },
  },
  {
    path: "jiaoshidetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminjiaoshiDetail",
    component: () => import("@/views/end/jiaoshi/detail"),
    meta: {
      title: "教师详情"
    },
  },
  {
    path: "admins",
    name: "AdminadminsList",
    component: () => import("@/views/end/admins/index"),
    meta: {
      title: "管理员列表",
      authLogin: true
    },
  },
  {
    path: "kechengleixing",
    name: "AdminkechengleixingList",
    component: () => import("@/views/end/kechengleixing/index"),
    meta: {
      title: "课程类型",
      authLogin: true
    },
  },
  {
    path: "kecheng",
    name: "AdminkechengList",
    component: () => import("@/views/end/kecheng/index"),
    meta: {
      title: "课程列表",
      authLogin: true
    },
  },
  {
    path: "kechengdetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminkechengDetail",
    component: () => import("@/views/end/kecheng/detail"),
    meta: {
      title: "课程详情"
    },
  },
  // {
  //   path: "kechengadd",
  //   name: "AdminkechengAdd",
  //   component: () => import("@/views/end/kecheng/add"),
  //   meta: { title: "添加课程", authLogin: true },
  // },
  //管理员模块-----------公告管理
  {
    path: "gonggao",
    name: "AdmingonggaoList",
    component: () => import("@/views/end/gonggao/index"),
    meta: {
      title: "公告列表",
      authLogin: true
    },
  },
  {
    path: "gonggaodetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdmingonggaoDetail",
    component: () => import("@/views/end/gonggao/detail"),
    meta: {
      title: "公告详情"
    },
  },

  // {
  //   path: "gonggao_faburen",
  //   name: "AdmingonggaoListfaburen",
  //   component: () => import("@/views/end/gonggao/list-faburen"),
  //   meta: { title: "公告列表", authLogin: true },
  // },
  // {
  //   path: "gonggaoadd",
  //   name: "AdmingonggaoAdd",
  //   component: () => import("@/views/end/gonggao/add"),
  //   meta: { title: "添加公告", authLogin: true },
  // },
  // {
  //   path: "gonggaoupdt",
  //   name: "AdmingonggaoUpdt",
  //   props: (route) => ({ id: route.query.id }),
  //   component: () => import("@/views/end/gonggao/updt"),
  //   meta: { title: "编辑公告", authLogin: true },
  // },

  {
    path: "youqinglianjie",
    name: "AdminyouqinglianjieList",
    component: () => import("@/views/end/youqinglianjie/index"),
    meta: {
      title: "友情链接列表",
      authLogin: true
    },
  },
  // {
  //   path: "youqinglianjieadd",
  //   name: "AdminyouqinglianjieAdd",
  //   component: () => import("@/views/end/youqinglianjie/add"),
  //   meta: { title: "添加友情链接", authLogin: true },
  // },
  // {
  //   path: "youqinglianjieupdt",
  //   name: "AdminyouqinglianjieUpdt",
  //   props: (route) => ({ id: route.query.id }),
  //   component: () => import("@/views/end/youqinglianjie/updt"),
  //   meta: { title: "编辑友情链接", authLogin: true },
  // },
  {
    path: "lunbotu",
    name: "AdminlunbotuList",
    component: () => import("@/views/end/lunbotu/index"),
    meta: {
      title: "轮播图列表",
      authLogin: true
    },
  },
  // {
  //   path: "lunbotuadd",
  //   name: "AdminlunbotuAdd",
  //   component: () => import("@/views/end/lunbotu/add"),
  //   meta: { title: "添加轮播图", authLogin: true },
  // },
  // {
  //   path: "lunbotuupdt",
  //   name: "AdminlunbotuUpdt",
  //   props: (route) => ({ id: route.query.id }),
  //   component: () => import("@/views/end/lunbotu/updt"),
  //   meta: { title: "编辑轮播图", authLogin: true },
  // },

  {
    path: "dianzan",
    name: "AdmindianzanList",
    component: () => import("@/views/end/dianzan/index"),
    meta: {
      title: "点赞列表",
      authLogin: true
    },
  },
  // {
  //   path: "dianzanadd",
  //   name: "AdmindianzanAdd",
  //   component: () => import("@/views/end/dianzan/add"),
  //   meta: { title: "添加点赞", authLogin: true },
  // },
  {
    path: "dianzanupdt",
    name: "AdmindianzanUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/dianzan/updt"),
    meta: {
      title: "编辑点赞",
      authLogin: true
    },
  },
  {
    path: "suitangceshi",
    name: "AdminsuitangceshiList",
    component: () => import("@/views/end/suitangceshi/list"),
    meta: {
      title: "随堂测试列表",
      authLogin: true
    },
  },
  // {
  //   path: "suitangceshi_faburen",
  //   name: "AdminsuitangceshiListfaburen",
  //   component: () => import("@/views/end/suitangceshi/list-faburen"),
  //   meta: {
  //     title: "随堂测试列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "suitangceshiadd",
  //   name: "AdminsuitangceshiAdd",
  //   component: () => import("@/views/end/suitangceshi/add"),
  //   meta: {
  //     title: "添加随堂测试",
  //     authLogin: true
  //   },
  // },
  {
    path: "suitangceshiupdt",
    name: "AdminsuitangceshiUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/suitangceshi/updt"),
    meta: {
      title: "编辑随堂测试",
      authLogin: true
    },
  },
  {
    path: "suitangceshidetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminsuitangceshiDetail",
    component: () => import("@/views/end/suitangceshi/detail"),
    meta: {
      title: "随堂测试详情"
    },
  },

  // {
  //   path: "dati",
  //   name: "AdmindatiList",
  //   component: () => import("@/views/end/dati/list"),
  //   meta: {
  //     title: "答题列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "dati_faburen",
  //   name: "AdmindatiListfaburen",
  //   component: () => import("@/views/end/dati/list-faburen"),
  //   meta: {
  //     title: "答题列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "dati_huidaren",
  //   name: "AdmindatiListhuidaren",
  //   component: () => import("@/views/end/dati/list-huidaren"),
  //   meta: {
  //     title: "答题列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "datiadd",
  //   name: "AdmindatiAdd",
  //   component: () => import("@/views/end/dati/add"),
  //   meta: {
  //     title: "添加答题",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "datiupdt",
  //   name: "AdmindatiUpdt",
  //   props: (route) => ({
  //     id: route.query.id
  //   }),
  //   component: () => import("@/views/end/dati/updt"),
  //   meta: {
  //     title: "编辑答题",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "datidetail",
  //   props: (route) => ({
  //     id: route.query.id
  //   }),
  //   name: "AdmindatiDetail",
  //   component: () => import("@/views/end/dati/detail"),
  //   meta: {
  //     title: "答题详情"
  //   },
  // },

  //管理员----论坛管理
  {
    path: "tiezi",
    name: "AdmintieziList",
    component: () => import("@/views/end/tiezi/list"),
    meta: {
      title: "帖子列表",
      authLogin: true
    },
  },
  // {
  //   path: "tieziadd",
  //   name: "AdmintieziAdd",
  //   component: () => import("@/views/end/tiezi/add"),
  //   meta: {
  //     title: "添加帖子",
  //     authLogin: true
  //   },
  // },
  {
    path: "tieziupdt",
    name: "AdmintieziUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/tiezi/updt"),
    meta: {
      title: "编辑帖子",
      authLogin: true
    },
  },
  {
    path: "tiezidetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdmintieziDetail",
    component: () => import("@/views/end/tiezi/detail"),
    meta: {
      title: "帖子详情"
    },
  },
  {
    path: "tiezifenlei",
    name: "AdmintiezifenleiList",
    component: () => import("@/views/end/tiezifenlei/index"),
    meta: {
      title: "帖子分类列表",
      authLogin: true
    },
  },

  {
    path: "tiezihuifu",
    name: "AdmintiezihuifuList",
    component: () => import("@/views/end/tiezihuifu/list"),
    meta: {
      title: "帖子回复列表",
      authLogin: true
    },
  },
  // {
  //   path: "tiezihuifu_huifuren",
  //   name: "AdmintiezihuifuListhuifuren",
  //   component: () => import("@/views/end/tiezihuifu/list-huifuren"),
  //   meta: {
  //     title: "帖子回复列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "tiezihuifuadd",
  //   name: "AdmintiezihuifuAdd",
  //   component: () => import("@/views/end/tiezihuifu/add"),
  //   meta: {
  //     title: "添加帖子回复",
  //     authLogin: true
  //   },
  // },
  {
    path: "tiezihuifuupdt",
    name: "AdmintiezihuifuUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/tiezihuifu/updt"),
    meta: {
      title: "编辑帖子回复",
      authLogin: true
    },
  },
  {
    path: "wentiqiangda",
    name: "AdminwentiqiangdaList",
    component: () => import("@/views/end/wentiqiangda/list"),
    meta: {
      title: "问题抢答列表",
      authLogin: true
    },
  },
  // {
  //   path: "wentiqiangda_faburen",
  //   name: "AdminwentiqiangdaListfaburen",
  //   component: () => import("@/views/end/wentiqiangda/list-faburen"),
  //   meta: {
  //     title: "问题抢答列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "wentiqiangdaadd",
  //   name: "AdminwentiqiangdaAdd",
  //   component: () => import("@/views/end/wentiqiangda/add"),
  //   meta: {
  //     title: "添加问题抢答",
  //     authLogin: true
  //   },
  // },
  {
    path: "wentiqiangdaupdt",
    name: "AdminwentiqiangdaUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/wentiqiangda/updt"),
    meta: {
      title: "编辑问题抢答",
      authLogin: true
    },
  },
  {
    path: "wentiqiangdadetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminwentiqiangdaDetail",
    component: () => import("@/views/end/wentiqiangda/detail"),
    meta: {
      title: "问题抢答详情"
    },
  },
  {
    path: "tiku",
    name: "AdmintikuList",
    component: () => import("@/views/end/tiku/index"),
    meta: {
      title: "试卷列表",
      authLogin: true
    },
  },
  {
    path: "tiku_faburen",
    name: "AdmintikuListfaburen",
    component: () => import("@/views/end/tiku/list-faburen"),
    meta: {
      title: "试卷列表",
      authLogin: true
    },
  },
  // {
  //   path: "tikuadd",
  //   name: "AdmintikuAdd",
  //   component: () => import("@/views/end/tiku/add"),
  //   meta: {
  //     title: "添加试卷",
  //     authLogin: true
  //   },
  // },
  {
    path: "tikuupdt",
    name: "AdmintikuUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/tiku/updt"),
    meta: {
      title: "编辑试卷",
      authLogin: true
    },
  },
  {
    path: "tikudetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdmintikuDetail",
    component: () => import("@/views/end/tiku/detail"),
    meta: {
      title: "试卷详情"
    },
  },
  {
    path: "shiti",
    name: "AdminshitiList",
    component: () => import("@/views/end/shiti/list"),
    meta: {
      title: "试题列表",
      authLogin: true
    },
  },
  // {
  //   path: "shiti_faburen",
  //   name: "AdminshitiListfaburen",
  //   component: () => import("@/views/end/shiti/list-faburen"),
  //   meta: {
  //     title: "试题列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "shitiadd",
  //   name: "AdminshitiAdd",
  //   component: () => import("@/views/end/shiti/add"),
  //   meta: { title: "添加试题", authLogin: true },
  // },
  // {
  //   path: "shitiupdt",
  //   name: "AdminshitiUpdt",
  //   props: (route) => ({ id: route.query.id }),
  //   component: () => import("@/views/end/shiti/updt"),
  //   meta: { title: "编辑试题", authLogin: true },
  // },
  // {
  //   path: "shitidetail",
  //   props: (route) => ({ id: route.query.id }),
  //   name: "AdminshitiDetail",
  //   component: () => import("@/views/end/shiti/detail"),
  //   meta: { title: "试题详情" },
  // },
  {
    path: "jieguo",
    name: "AdminjieguoList",
    component: () => import("@/views/end/jieguo/list"),
    meta: {
      title: "结果列表",
      authLogin: true
    },
  },
  // {
  //   path: "jieguo_faburen",
  //   name: "AdminjieguoListfaburen",
  //   component: () => import("@/views/end/jieguo/list-faburen"),
  //   meta: {
  //     title: "结果列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "jieguo_kaoshiren",
  //   name: "AdminjieguoListkaoshiren",
  //   component: () => import("@/views/end/jieguo/list-kaoshiren"),
  //   meta: {
  //     title: "结果列表",
  //     authLogin: true
  //   },
  // },
  {
    path: "jieguoadd",
    name: "AdminjieguoAdd",
    component: () => import("@/views/end/jieguo/add"),
    meta: {
      title: "添加结果",
      authLogin: true
    },
  },
  // {
  //   path: "jieguoupdt",
  //   name: "AdminjieguoUpdt",
  //   props: (route) => ({
  //     id: route.query.id
  //   }),
  //   component: () => import("@/views/end/jieguo/updt"),
  //   meta: {
  //     title: "编辑结果",
  //     authLogin: true
  //   },
  // },
  {
    path: "jieguodetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminjieguoDetail",
    component: () => import("@/views/end/jieguo/detail"),
    meta: {
      title: "结果详情"
    },
  },
  {
    path: "kaoshijieguo",
    name: "AdminkaoshijieguoList",
    component: () => import("@/views/end/kaoshijieguo/list"),
    meta: {
      title: "考试结果列表",
      authLogin: true
    },
  },
  // {
  //   path: "kaoshijieguo_faburen",
  //   name: "AdminkaoshijieguoListfaburen",
  //   component: () => import("@/views/end/kaoshijieguo/list-faburen"),
  //   meta: {
  //     title: "考试结果列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "kaoshijieguo_kaoshiren",
  //   name: "AdminkaoshijieguoListkaoshiren",
  //   component: () => import("@/views/end/kaoshijieguo/list-kaoshiren"),
  //   meta: {
  //     title: "考试结果列表",
  //     authLogin: true
  //   },
  // },
  {
    path: "kaoshijieguoadd",
    name: "AdminkaoshijieguoAdd",
    component: () => import("@/views/end/kaoshijieguo/add"),
    meta: {
      title: "添加考试结果",
      authLogin: true
    },
  },
  {
    path: "kaoshijieguoupdt",
    name: "AdminkaoshijieguoUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/kaoshijieguo/updt"),
    meta: {
      title: "编辑考试结果",
      authLogin: true
    },
  },
  {
    path: "kaoshijieguodetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminkaoshijieguoDetail",
    component: () => import("@/views/end/kaoshijieguo/detail"),
    meta: {
      title: "考试结果详情"
    },
  },
  {
    path: "keqiankaoqin",
    name: "AdminkeqiankaoqinList",
    component: () => import("@/views/end/keqiankaoqin/list"),
    meta: {
      title: "课前考勤列表",
      authLogin: true
    },
  },
  {
    path: "kaoqinchengji",
    name: "AdminkeqiankaoqinList",
    component: () => import("@/views/end/keqiankaoqin/chengji"),
    meta: {
      title: "考勤成绩",
      authLogin: true
    },
  },
  // {
  //   path: "keqiankaoqin_faburen",
  //   name: "AdminkeqiankaoqinListfaburen",
  //   component: () => import("@/views/end/keqiankaoqin/list-faburen"),
  //   meta: {
  //     title: "课前考勤列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "keqiankaoqinadd",
  //   name: "AdminkeqiankaoqinAdd",
  //   component: () => import("@/views/end/keqiankaoqin/add"),
  //   meta: { title: "添加课前考勤", authLogin: true },
  // },
  // {
  //   path: "keqiankaoqinupdt",
  //   name: "AdminkeqiankaoqinUpdt",
  //   props: (route) => ({ id: route.query.id }),
  //   component: () => import("@/views/end/keqiankaoqin/updt"),
  //   meta: { title: "编辑课前考勤", authLogin: true },
  // },
  {
    path: "keqiankaoqindetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminkeqiankaoqinDetail",
    component: () => import("@/views/end/keqiankaoqin/detail"),
    meta: {
      title: "课前考勤详情"
    },
  },
  {
    path: "qiandao",
    name: "AdminqiandaoList",
    component: () => import("@/views/end/qiandao/list"),
    meta: {
      title: "签到列表",
      authLogin: true
    },
  },
  // {
  //   path: "qiandao_faburen",
  //   name: "AdminqiandaoListfaburen",
  //   component: () => import("@/views/end/qiandao/list-faburen"),
  //   meta: {
  //     title: "签到列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "qiandao_qiandaoren",
  //   name: "AdminqiandaoListqiandaoren",
  //   component: () => import("@/views/end/qiandao/list-qiandaoren"),
  //   meta: {
  //     title: "签到列表",
  //     authLogin: true
  //   },
  // },
  // {
  //   path: "qiandaoadd",
  //   name: "AdminqiandaoAdd",
  //   component: () => import("@/views/end/qiandao/add"),
  //   meta: { title: "添加签到", authLogin: true },
  // },
  {
    path: "qiandaoupdt",
    name: "AdminqiandaoUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/qiandao/updt"),
    meta: {
      title: "编辑签到",
      authLogin: true
    },
  },
  {
    path: "qiandaodetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminqiandaoDetail",
    component: () => import("@/views/end/qiandao/detail"),
    meta: {
      title: "签到详情"
    },
  },
  {
    path: "ziyuan",
    name: "AdminziyuanList",
    component: () => import("@/views/end/ziyuan/index"),
    meta: {
      title: "资源列表",
      authLogin: true
    },
  },
  {
    path: "ziyuanupdt",
    name: "AdminziyuanUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/ziyuan/updt"),
    meta: {
      title: "编辑资源",
      authLogin: true
    },
  },
  {
    path: "ziyuandetail",
    props: (route) => ({
      id: route.query.id
    }),
    name: "AdminziyuanDetail",
    component: () => import("@/views/end/ziyuan/detail"),
    meta: {
      title: "资源详情"
    },
  },
  {
    path: "pinglun",
    name: "AdminpinglunList",
    component: () => import("@/views/end/pinglun/list"),
    meta: {
      title: "评论列表",
      authLogin: true
    },
  },
  {
    path: "pinglunupdt",
    name: "AdminpinglunUpdt",
    props: (route) => ({
      id: route.query.id
    }),
    component: () => import("@/views/end/pinglun/updt"),
    meta: {
      title: "编辑评论",
      authLogin: true
    },
  },
];