export default [
  {
    label: "管理员信息管理",
    to: "",
    children: [
      {
        label: "密码修改",
        to: "/end/mod",
      },
    ],
  },
  {
    label: "基础信息录入",
    to: "",
    children: [
      {
        label: "专业信息管理",
        to: "/end/zhuanye",
      },
      {
        label: "班级信息管理",
        to: "/end/banji",
      },
    ],
  },
  {
    label: "人员信息录入",
    to: "",
    children: [
      {
        label: "教师信息管理",
        to: "/end/jiaoshi",
      },
      {
        label: "学生信息管理",
        to: "/end/xuesheng",
      },
      {
        label: "管理员信息管理",
        to: "/end/admins",
      },
    ],
  },

  {
    label: "课程信息管理",
    to: "",
    children: [
      {
        label: "课程类型管理",
        to: "/end/kechengleixing",
      },
      {
        label: "课程信息管理",
        to: "/end/kecheng",
      },
    ],
  },
  {
    label: "公告信息管理",
    to: "",
    children: [
      // {
      //   label: "公告添加",
      //   to: "/end/gonggaoadd",
      // },
      {
        label: "公告信息管理",
        to: "/end/gonggao",
      },
    ],
  },
  {
    label: "题库信息管理",
    to: "",
    children: [
      // {
      //   label: "评价题库添加",
      //   to: "/end/tikuadd",
      // },
      {
        label: "题库信息添加",
        to: "/end/tiku",
      },
      {
        label: "题库试题查询",
        to: "/end/shiti",
      },
      {
        label: "结果查询",
        to: "/end/jieguo",
      },
      {
        label: "评价结果查询",
        to: "/end/kaoshijieguo",
      },
    ],
  },
  {
    label: "教学评价管理",
    to: "",
    children: [
      {
        label: "教学结果查询",
        to: "/end/jieguo",
      },
      {
        label: "评价分数查询",
        to: "/end/kaoshijieguo",
      },
    ],
  },
  //   {
  //     label: "问题抢答管理",
  //     to: "",
  //     children: [
  //       /*  {
  //                     label: '问题抢答添加',
  //                     to: '/end/wentiqiangdaadd',
  //                 },*/
  //       {
  //         label: "问题抢答查询",
  //         to: "/end/wentiqiangda",
  //       },
  //       {
  //         label: "抢答问题查询",
  //         to: "/end/qiangdawenti",
  //       },
  //       {
  //         label: "回答问题查询",
  //         to: "/end/huidawenti",
  //       },
  //       {
  //         label: "评阅问题查询",
  //         to: "/end/pingyuewenti",
  //       },
  //     ],
  //   },
  {
    label: "答疑内容管理",
    to: "",
    children: [
      /*  {
                label: '问题搜索添加',
                to: '/end/wentisousuoadd',
            },*/
      {
        label: "答疑问题查询",
        to: "/end/wentisousuo",
      },
    ],
  },
  {
    label: "论坛管理",
    to: "",
    children: [
      // {
      //   label: "帖子分类添加",
      //   to: "/end/tiezifenleiadd",
      // },
      {
        label: "帖子类型管理",
        to: "/end/tiezifenlei",
      },
      {
        label: "帖子信息管理",
        to: "/end/tiezi",
      },
      {
        label: "点赞查询",
        to: "/end/dianzan",
      },
      {
        label: "帖子回复查询",
        to: "/end/tiezihuifu",
      },
    ],
  },
  // {
  //   label: "资源管理",
  //   to: "",
  //   children: [
  //     // {
  //     //   label: "资源添加",
  //     //   to: "/end/ziyuanadd",
  //     // },
  //     {
  //       label: "资源管理",
  //       to: "/end/ziyuan",
  //     },
  //   ],
  // },
  {
    label: "屏蔽词管理",
    to: "",
    children: [
      // {
      //   label: "屏蔽词添加",
      //   to: "/end/pingbiciadd",
      // },
      {
        label: "屏蔽词查询",
        to: "/end/pingbici",
      },
    ],
  },
  {
    label: "随堂测试管理",
    to: "",
    children: [
      /*  {
                label: '随堂测试添加',
                to: '/end/suitangceshiadd',
            },*/
      {
        label: "随堂测试查询",
        to: "/end/suitangceshi",
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
    label: "成绩管理",
    to: "",
    children: [
      {
        label: "成绩查询",
        to: "/end/chengji",
      },
    ],
  },
  {
    label: "学生互评管理",
    to: "",
    children: [
      {
        label: "学生互评查询",
        to: "/end/xueshenghuping",
      },
    ],
  },

  {
    label: "课前考勤管理",
    to: "",
    children: [
      {
        label: "课程考勤添加",
        to: "/end/keqiankaoqinadd",
      },
      {
        label: "课前考勤查询",
        to: "/end/keqiankaoqin",
      },
      {
        label: "签到查询",
        to: "/end/qiandao",
      },
    ],
  },
  {
    label: "系统管理",
    to: "",
    children: [
      {
        label: "友情链接添加",
        to: "/end/youqinglianjieadd",
      },
      {
        label: "友情链接查询",
        to: "/end/youqinglianjie",
      },
      {
        label: "轮播图添加",
        to: "/end/lunbotuadd",
      },
      {
        label: "轮播图查询",
        to: "/end/lunbotu",
      },
      {
        label: "评论查询",
        to: "/end/pinglun",
      },
    ],
  },
];
