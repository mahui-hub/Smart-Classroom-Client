export default [{
    label: "抢答问题管理",
    to: "",
    children: [{
        label: "抢答问题查询",
        to: "/end/qiangdawenti_qiangdaren",
      },
      {
        label: "评阅问题查询",
        to: "/end/pingyuewenti_qiangdaren",
      },
    ],
  },
  {
    label: "成绩信息管理",
    to: "",
    children: [{
      label: "自我成绩查询",
      to: "/end/chengji_xuehao",
    }, ],
  },
  {
    label: "互评信息管理",
    to: "",
    children: [{
      label: "互评信息查询",
      to: "/end/xueshenghuping_hupingren",
    }, ],
  },
  {
    label: "资源信息管理",
    to: "",
    children: [{
      label: "资源信息列表",
      to: "/end/ziyuan",
    }, ],
  },
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