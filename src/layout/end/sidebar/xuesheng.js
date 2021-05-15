export default [
  // {
  //   label: "论坛管理",
  //   to: "",
  //   children: [
  //     // {
  //     //     label:'帖子添加',
  //     //     to:'/end/tieziadd',
  //     // },
  //     {
  //       label: "帖子查询",
  //       to: "/end/tiezi_faburen",
  //     },
  //     {
  //       label: "回复查询",
  //       to: "/end/tiezihuifu_huifuren",
  //     },
  //     {
  //       label: "点赞查询",
  //       to: "/end/dianzan_dianzanren",
  //     },
  //   ],
  // },
  {
    label: "抢答问题管理",
    to: "",
    children: [{
        label: "抢答问题查询",
        to: "/end/qiangdawenti_qiangdaren",
      },
      // {
      //   label: "回答问题查询",
      //   to: "/end/huidawenti_qiangdaren",
      // },
      {
        label: "评阅问题查询",
        to: "/end/pingyuewenti_qiangdaren",
      },
    ],
  },
  {
    label: "答疑信息管理",
    to: "",
    children: [
      // {
      //   label: "问题搜索添加",
      //   to: "/end/wentisousuoadd",
      // },
      {
        label: "答疑信息管理",
        to: "/end/wentisousuo",
      },
    ],
  },
  // {
  //   label: "随堂测试管理",
  //   to: "",
  //   children: [
  //     {
  //       label: "回答查询",
  //       to: "/end/dati_huidaren",
  //     },
  //     {
  //       label: "答题评阅查询",
  //       to: "/end/datipingyue_huidaren",
  //     },
  //   ],
  // },

  {
    label: "成绩管理",
    to: "",
    children: [{
      label: "成绩查询",
      to: "/end/chengji_xuehao",
    }, ],
  },
  {
    label: "互评管理",
    to: "",
    children: [{
      label: "互评查询",
      to: "/end/xueshenghuping_hupingren",
    }, ],
  },

  // {
  //   label: "互评管理",
  //   to: "",
  //   children: [{
  //     label: "互评查询",
  //     to: "/end/xueshenghuping",
  //   }, ],
  // },
  {
    label: "个人中心",
    to: "",
    children: [{
        label: "修改个人资料",
        to: "/end/xueshengupdtself",
      },
      {
        label: "修改密码",
        to: "/end/mod",
      },
    ],
  },
];