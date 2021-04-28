export default [
  {
    label: "学生信息管理",
    to: "",
    children: [
      {
        label: "学生信息管理",
        to: "/end/xuesheng",
      },
    ],
  },
  {
    label: "课程信息管理",
    to: "",
    children: [
      // {
      //   label: "课程添加",
      //   to: "/end/kechengadd",
      // },
      {
        label: "课程管理",
        to: "/end/kecheng",
      },
    ],
  },
  {
    label: "公告信息管理",
    to: "",
    children: [
      {
        label: "公告信息管理",
        to: "/end/gonggao",
      },
    ],
  },
  {
    label: "答疑内容管理",
    to: "",
    children: [
      /*  {
                label: '问题搜索添加',
                to: '/end/wentisousuoadd',
            },*/
      {
        label: "答疑问题管理",
        to: "/end/wentisousuo",
      },
      // {
      //   label: "答疑问题添加",
      //   to: "/end/wentisousuo/add",
      // },
    ],
  },
  // {
  //   label: "答疑内容管理",
  //   to: "",
  //   children: [
  //     {
  //       label: "答疑内容管理",
  //       to: "/end/wentisousuo_xuehao",
  //     },
  //   ],
  // },
  {
    label: "抢答问题管理",
    to: "",
    children: [
      // {
      //   label: "问题抢答添加",
      //   to: "/end/wentiqiangdaadd",
      // },
      {
        label: "抢答问题管理",
        to: "/end/wentiqiangda",
      },
      {
        label: "抢答问题查询",
        to: "/end/qiangdawenti",
      },
      // {
      //   label: "回答问题查询",
      //   to: "/end/huidawenti",
      // },
      {
        label: "评阅问题查询",
        to: "/end/pingyuewenti",
      },
    ],
  },
  {
    label: "资源管理",
    to: "",
    children: [
      // {
      //   label: "资源添加",
      //   to: "/end/ziyuanadd",
      // },
      {
        label: "资源列表",
        to: "/end/ziyuan",
      },
    ],
  },
  {
    label: "成绩信息管理",
    to: "",
    children: [
      {
        label: "成绩比例设置",
        to: "/end/chengjibili",
      },
      {
        label: "成绩查询",
        to: "/end/chengji",
      },
    ],
  },

  {
    label: "课前考勤管理",
    to: "",
    children: [
      // {
      //   label: "课前考勤添加",
      //   to: "/end/keqiankaoqinadd",
      // },
      {
        label: "课前考勤管理",
        to: "/end/keqiankaoqin",
      },
      {
        label: "学生签到情况",
        to: "/end/qiandao",
      },
    ],
  },
  {
    label: "随堂测试管理",
    to: "",
    children: [
      {
        label: "随堂测试添加",
        to: "/end/suitangceshiadd",
      },
      {
        label: "随堂测试查询",
        to: "/end/suitangceshi_faburen",
      },
      {
        label: "答题查询",
        to: "/end/dati",
      },
      {
        label: "答题评阅查询",
        to: "/end/datipingyue",
      },
    ],
  },

  {
    label: "个人中心",
    to: "",
    children: [
      {
        label: "修改个人资料",
        to: "/end/jiaoshiupdtself",
      },
      {
        label: "修改密码",
        to: "/end/mod",
      },
    ],
  },
];
