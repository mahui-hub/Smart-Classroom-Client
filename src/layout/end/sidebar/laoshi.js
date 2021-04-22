export default [
  {
    label: "课程管理",
    to: "",
    children: [
      {
        label: "课程添加",
        to: "/end/kechengadd",
      },
      {
        label: "课程查询",
        to: "/end/kecheng_faburen",
      },
    ],
  },
  /*  {
        label:'论坛管理',
        to:'',
        children:[
                        {
                label:'帖子添加',
                to:'/end/tieziadd',
            },
                        {
                label:'帖子查询',
                to:'/end/tiezi_faburen',
            },
                        {
                label:'回复查询',
                to:'/end/tiezihuifu_huifuren',
            },
                        {
                label:'点赞查询',
                to:'/end/dianzan_dianzanren',
            },
                    ]
    },*/
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
        to: "/end/dati_faburen",
      },
    ],
  },
  {
    label: "成绩管理",
    to: "",
    children: [
      {
        label: "成绩添加",
        to: "/end/chengjiadd",
      },
      {
        label: "成绩查询",
        to: "/end/chengji_tianjiaren",
      },
    ],
  },
  {
    label: "个人中心",
    to: "",
    children: [
      {
        label: "修改个人资料",
        to: "/end/laoshiupdtself",
      },
      {
        label: "修改密码",
        to: "/end/mod",
      },
    ],
  },
];
