<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form :inline="true" size="mini" :model="search">
        <!-- <el-form-item label="学号">
          <el-input v-model="search.xuehao"></el-input>
        </el-form-item> -->
        <el-form-item label="姓名">
          <el-input v-model="search.xingming"></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别">
          <el-select v-model="search.xingbie">
            <el-option label="请选择" value=""></el-option>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="班级">
          <el-select v-model="search.banji">
            <el-option label="请选择" value=""></el-option>
            <el-option :key="m.id" v-for="m in banjiList" :value="m.banjimingcheng" :label="m.banjimingcheng">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="search.zhuanye">
            <el-option label="请选择" value=""></el-option>
            <el-option :key="m.id" v-for="m in zhuanyeList" :value="m.zhuanye" :label="m.zhuanye"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit" icon="el-icon-plus">添加学生信息</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <!-- 序号 -->
      <el-table-column label="学号" align="center">
        <template slot-scope="{ row }">
          {{ row.xuehao }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{ row }">
          {{ row.xingming }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" min-width="50">
        <template slot-scope="{ row }">
          {{ row.xingbie }}
        </template>
      </el-table-column>
      <el-table-column label="班级名称" align="center" min-width="80">
        <template slot-scope="{ row }">
          {{ row.banji }}
        </template>
      </el-table-column>
      <el-table-column label="专业名称" align="center" min-width="120" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.zhuanye }}
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{ row }">
          {{ row.lianxidianhua }}
        </template>
      </el-table-column>
      <el-table-column label="QQ号" align="center">
        <template slot-scope="{ row }">
          {{ row.qqhao }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150">
        <template slot-scope="{ row }">
          <el-button @click="addScope(row)" type="text" v-if="role != '管理员'">
            成绩添加
          </el-button>
          <el-button @click="huping(row)" type="text" v-if="role != '管理员'">
            评价学生
          </el-button>
          <!-- <el-button @click="$goto('/end/xueshenghupingadd?id=' + row.id)" type="text" v-if="role != '管理员'">
            互评添加
          </el-button> -->
          <el-button type="text" @click="$goto('/end/xueshenghuping?xuehao=' + row.xuehao)" v-if="role != '管理员'">
            互评查询
          </el-button>

          <el-button @click="
              $goto({
                path: '/end/xueshengdetail',
                query: { id: row.id },
              })
            " type="text" v-if="role == '管理员'">详情</el-button>
          <el-button @click="edit(row)" v-if="role == '管理员'" type="text">编辑信息</el-button>
          <el-button type="text" v-if="role == '管理员'" @click="deleteItem(row)">删除信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!-- 添加学生信息 -->
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini" :inline="true">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" :rules="rules">
          <el-form-item label="学号" prop="xuehao">
            <el-input placeholder="输入学号" v-model="form.xuehao" />
          </el-form-item>

          <el-form-item label="密码" prop="mima">
            <el-input type="password" placeholder="输入密码" v-model="form.mima" />
          </el-form-item>

          <el-form-item label="姓名" prop="xingming">
            <el-input placeholder="输入姓名" v-model="form.xingming" />
          </el-form-item>

          <el-form-item label="性别" prop="xingbie" required>
            <el-select v-model="form.xingbie" style="width:100%">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="专业名称" prop="zhuanye">
            <el-select v-model="form.zhuanye" style="width:100%" @change="handleChange1">
              <el-option :key="m.zhuanye" v-for="m in zhuanyeList" :value="m.zhuanye" :label="m.zhuanye"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="banji">
            <el-select v-model="form.banji" style="width:100%" @change="handleChange">
              <el-option :key="m.banjimingcheng" v-for="m in banjiList1" :value="m.banjimingcheng"
                :label="m.banjimingcheng"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系方式" prop="lianxidianhua">
            <el-input placeholder="请输入联系方式" v-model="form.lianxidianhua" />
          </el-form-item>

          <el-form-item label="QQ号" prop="qqhao">
            <el-input placeholder="请输入QQ号" v-model="form.qqhao" />
          </el-form-item>

          <el-form-item label="头像" prop="touxiang">
            <e-upload-image v-model="form.touxiang"></e-upload-image>
          </el-form-item>

          <el-form-item label="详情" prop="xiangqing">
            <el-input v-model="form.xiangqing" type="textarea" :rows="3"></el-input>
            <!-- <e-editor v-model="form.xiangqing"></e-editor> -->
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改学生信息 -->
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible1" size="mini">
      <div class="form-database-form">
        <el-form :model="form1" ref="formModel1" label-width="100px" :rules="rules1">
          <el-form-item label="学号" prop="xuehao">
            <el-input placeholder="输入学号" v-model="form1.xuehao" disabled />
          </el-form-item>

          <el-form-item label="姓名" prop="xingming">
            <el-input placeholder="输入姓名" v-model="form1.xingming" />
          </el-form-item>

          <el-form-item label="性别" prop="xingbie">
            <el-select v-model="form1.xingbie" style="width:100%">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="专业名称" prop="zhuanye">
            <el-select v-model="form1.zhuanye" style="width:100%" @change="handleChange1">
              <el-option :key="m.zhuanye" v-for="m in zhuanyeList" :value="m.zhuanye" :label="m.zhuanye"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="班级名称" prop="banji">
            <el-select v-model="form1.banji" style="width:100%" @change="handleChange">
              <el-option :key="m.banjimingcheng" v-for="m in banjiList1" :value="m.banjimingcheng"
                :label="m.banjimingcheng"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系方式" prop="lianxidianhua">
            <el-input placeholder="请输入联系方式" v-model="form1.lianxidianhua" />
          </el-form-item>

          <el-form-item label="QQ号" prop="qqhao">
            <el-input placeholder="输入QQ号" v-model="form1.qqhao" />
          </el-form-item>

          <el-form-item label="头像" prop="touxiang">
            <e-upload-image v-model="form1.touxiang"></e-upload-image>
          </el-form-item>

          <el-form-item label="详情" prop="xiangqing">
            <el-input v-model="form1.xiangqing" type="textarea" :rows="3"></el-input>
            <!-- <e-editor v-model="form1.xiangqing"></e-editor> -->
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 成绩添加 -->
    <el-dialog title="添加成绩" :visible.sync="dialogVisible2" size="mini">
      <div class="form-database-form">
        <el-form :model="form3" ref="formModel3" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="学号" prop="xuehao">
            <el-input v-model="form3.xuehao" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="xingming">
            <el-input v-model="form3.xingming" disabled></el-input>
          </el-form-item>
          <el-form-item label="课程名称">
            <el-select v-model="form3.kechengid" style="width: 100%" clearable @change="handleChengji">
              <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最小不能小于1', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]" -->
          <el-form-item label="期末成绩" prop="qimochengji" v-if="form3.kechengid"
            :rules="[{validator:rule.checkMax, message:'最大不能超过100', value:100}]">
            <el-input v-model="form3.qimochengji" @input="input" />
          </el-form-item>
          <el-form-item label="随堂测试成绩" prop="suitangceshichengji" v-if="form3.kechengid"
            :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最小不能小于等于0', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
            <el-input v-model="form3.suitangceshichengji" disabled @input="input" />
          </el-form-item>
          <el-form-item label="抢答问题成绩" prop="qiangdawentichengji" v-if="form3.kechengid"
            :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
            <el-input v-model="form3.qiangdawentichengji" disabled @input="input" />
          </el-form-item>
          <el-form-item label="教师评价成绩" prop="jiaoshipingjiachengji" v-if="form3.kechengid"
            :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最小不能小于等于0', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
            <el-input disabled v-model="form3.jiaoshipingjiachengji" />
          </el-form-item>
          <el-form-item label="学生互评成绩" prop="shenghupingchengji" v-if="form3.kechengid"
            :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}, {validator:rule.checkMin, message:'最小不能小于等于0', value:1}, {validator:rule.checkMax, message:'最大不能超过100', value:100}]">
            <el-input v-model="form3.shenghupingchengji" disabled />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submit3">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 评价学生 -->
    <el-dialog :title="headtitle" :visible.sync="dialogVisible3" size="mini">
      <div class="form-database-form">
        <el-form :model="form4" ref="formModel4" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="学号" prop="xuehao">
            <el-input v-model="form4.xuehao" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="xingming">
            <el-input v-model="form4.xingming" disabled></el-input>
          </el-form-item>
          <el-form-item label="课程名称" prop="kechengid" required>
            <el-select v-model="form4.kechengid" style="width: 100%">
              <el-option v-for="m in kechengmingchengList" :key="m.id" :value="m.id" :label="m.kechengmingcheng">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="互评内容" prop="hupingneirong">
            <el-input type="textarea" v-model="form4.hupingneirong"></el-input>
          </el-form-item>

          <el-form-item label="互评分数" prop="hupingfenshu" :rules="[
              { validator: rule.checkNumber, message: '输入一个有效数字' },
            ]">
            <el-input placeholder="请输入该同学的评价分数" v-model="form4.hupingfenshu" />
          </el-form-item>
          <el-form-item label="互评人" prop="hupingren">
            <el-input v-model="form4.hupingren" readonly disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="submit4">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" scoped lang="scss"></style>
<script>
  import api from "@/api";
  import {
    remove,
    checkIssh
  } from "@/utils/utils";
  import {
    extend
  } from "@/utils/extend";
  import objectDiff from "objectdiff";
  import rule from "@/utils/rule";

  /**
   * 后台列表页面
   */
  export default {
    data() {
      return {
        form4: {
          kechengid: '',
          xuehao: "",
          xingming: "",
          hupingneirong: "",
          hupingfenshu: "",
          hupingren: this.$store.state.user.session.username,
          xueshengid: 0,
        },
        headtitle: "",
        dialogVisible3: false,
        role: localStorage.getItem("role"),
        rule,
        rules: {
          xuehao: [{
              required: true,
              message: "请填写学号"
            },
            {
              validator: rule.checkRemote,
              message: "内容重复了",
              checktype: "insert",
              module: "xuesheng",
              col: "xuehao",
              trigger: "blur",
            },
          ],
          mima: [{
            required: true,
            message: "请填写密码",
            trigger: "blur"
          }],
          xingming: [{
            required: true,
            message: "请填写姓名",
            trigger: "blur"
          }],
          xingbie: [{
            required: true,
            message: "请选择性别",
            trigger: "change"
          }],
          lianxidianhua: [{
              required: true,
              message: "请填写联系方式",
              trigger: "blur"
            },
            {
              validator: rule.checkPhone,
              message: "请输入正确手机号码"
            },
          ],
          qqhao: [{
              required: true,
              message: "请填写QQ号，用于在线交流",
              trigger: "blur",
            },
            {
              min: 6,
              max: 10,
              message: "QQ号长度在6-10字符"
            },
          ],
        },
        rules1: {
          xuehao: [{
            required: true,
            message: "请填写学号"
          }],
          xingming: [{
            required: true,
            message: "请填写姓名",
            trigger: "blur"
          }],
          xingbie: [{
            required: true,
            message: "请选择性别",
            trigger: "change"
          }],
          lianxidianhua: [{
              required: true,
              message: "请填写联系电话",
              trigger: "blur"
            },
            {
              validator: rule.checkPhone,
              message: "请输入正确手机号码"
            },
          ],
          qqhao: [{
              required: true,
              message: "请填写QQ号，用于在线交流",
              trigger: "blur",
            },
            {
              min: 6,
              max: 10,
              message: "QQ号长度在6-10字符"
            },
          ],
        },
        oper: "",
        headerTitle: "",
        form: {
          xuehao: "",
          mima: "",
          xingming: "",
          xingbie: "",
          banjiid: "",
          banji: "",
          zhuanye: "",
          lianxidianhua: "",
          qqhao: "",
          touxiang: "",
          xiangqing: "",
        },
        form1: {
          xuehao: "",
          xingming: "",
          xingbie: "",
          banji: "",
          banjiid: "",
          zhuanye: "",
          lianxidianhua: "",
          qqhao: "",
          touxiang: "",
          xiangqing: "",
        },
        dialogVisible1: false,
        dialogVisible: false,
        dialogVisible2: false,
        loading: false,
        list: [],
        search: {
          xuehao: "",
          xingming: "",
          xingbie: "",
          banji: "",
          zhuanye: "",
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
        banjiList: [], //所有班级
        banjiList1: [], //专业对应的班级
        zhuanyeList: [],
        form3: {
          kechengid: '',
          xuehao: this.$store.state.user.session.username,
          xingming: '',
          banji: '',
          zhuanye: '',
          qimochengji: '',
          shenghupingchengji: '',
          jiaoshipingjiachengji: '',
          suitangceshichengji: '',
          qiangdawentichengji: '',
          tianjiaren: this.$store.state.user.session.username,
          xueshengid: 0,
          zongfen: ''
        },
        xueshengid: '',
        kechengmingchengList: [],
        kaoqinchengjiList: [],
        suitangceshichengjiList: [],
        qiangdawentichengjiList: [],
        jiaoshipingjiachengjiList: [],
        array: []
      };
    },

    methods: {
      huping(row) {
        this.headtitle = "对" + row.xingming + "同学进行评价";
        this.dialogVisible3 = true;
        this.form4 = row;
        this.form4.hupingren = localStorage.getItem('username');
        if (localStorage.getItem("role") == '教师') {
          this.initKecheng1(row.banjiid)
        }
      },
      submit4() {
        this.$refs.formModel4
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form4;
            this.$post(api.xueshenghuping.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("评价成功");
                  this.dialogVisible3 = false
                  this.$refs.formModel4.resetFields();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      input(e) {
        this.$forceUpdate()
      },
      addScope(row) {
        if (localStorage.getItem("role") == '教师') {
          this.initKecheng1(row.banjiid)
        }
        this.xueshengid = row.id
        this.form3 = row
        this.dialogVisible2 = true;
        this.qiangdawentichengji(this.form3.xuehao)
        this.jiaoshipingjiachengji(this.form3.xuehao)
      },
      initKecheng1(banjiid) {
        // 防止重新点加载列表
        // 筛选条件
        var filter = extend(true, {}, {
          jiaoshiid: localStorage.getItem("jiaoshiid"),
          banjiid: banjiid,
          page: 1,
          pagesize: 10,
        });
        this.$post(api.kecheng.list, filter)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.kechengmingchengList = res.data.list;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      chengji() {
        //考勤成绩列表
        // this.$post(api.qiandao.list)
        //   .then((res) => {
        //     if (res.code == api.code.OK) {
        //       this.kaoqinchengjiList = res.data.kaoqinCount
        //     } else {
        //       this.$message.error(res.msg);
        //     }
        //   })
        //随堂测试列表
        const params = {}
        params.tikumingcheng = ''
        params.kechengid = ''
        params.tikutype = '测验题库'
        params.kaoshiren = ''
        this.$post(api.kaoshijieguo.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.suitangceshichengjiList = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
      },
      handleChengji(val) {
        this.suitangceshichengji(val)
        this.qiangdawentichengjihuoqu(val)
        this.jiaoshipingjiachengjihuoqu(val)
        this.shenghupingchengji(val)
      },
      suitangceshichengji(val) {
        //随堂测验成绩获取
        var a = 0
        var array = []
        var pingjun = 0
        console.log(this.suitangceshichengjiList)
        for (var i in this.suitangceshichengjiList) {
          if (val == this.suitangceshichengjiList[i].kechengid && this.form3.xuehao == this.suitangceshichengjiList[i]
            .kaoshiren) {
            array.push(this.suitangceshichengjiList[i].zongdefen)
          }
        }
        console.log(array)
        for (var j in array) {
          pingjun = pingjun + array[j]
          a = pingjun / array.length
        }
        this.form3.suitangceshichengji = a
      },
      qiangdawentichengji(xuehao) {
        const params = {}
        params.xuehao = xuehao
        if (localStorage.getItem('role') == '教师') {
          params.faburen = localStorage.getItem('username')
        }

        this.$post(api.pingyuewenti.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.qiangdawentichengjiList = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
      },
      qiangdawentichengjihuoqu(val) {
        //抢答测验成绩获取
        var a = 0
        var array = []
        var pingjun = 0
        for (var i in this.qiangdawentichengjiList) {
          if (this.qiangdawentichengjiList[i].kechengid == val) {
            array.push(this.qiangdawentichengjiList[i].pingfen)
          }
        }
        for (var j in array) {
          pingjun = pingjun + array[j]
          a = pingjun / array.length
        }
        this.form3.qiangdawentichengji = a
      },
      jiaoshipingjiachengji(xuehao) {
        //评价成绩
        const param = {}
        param.xuehao = xuehao
        // param.hupingren = localStorage.getItem('username')
        this.$post(api.xueshenghuping.list, param)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.jiaoshipingjiachengjiList = res.data.list
            } else {
              this.$message.error(res.msg);
            }
          })
      },
      jiaoshipingjiachengjihuoqu(val) {
        //教师评价成绩获取
        var a = 0
        for (var i in this.jiaoshipingjiachengjiList) {
          if (this.jiaoshipingjiachengjiList[i].kechengid == val && this.jiaoshipingjiachengjiList[i].hupingren ==
            localStorage.getItem('username')) {
            a = this.jiaoshipingjiachengjiList[i].hupingfenshu
          }
        }
        this.form3.jiaoshipingjiachengji = a
      },
      shenghupingchengji(val) {
        //学生互评成绩获取
        var a = 0
        var array = []
        var pingjun = 0
        for (var i in this.jiaoshipingjiachengjiList) {
          if (this.jiaoshipingjiachengjiList[i].kechengid == val && this.jiaoshipingjiachengjiList[i].hupingren !=
            localStorage.getItem('username')) {
            array.push(this.jiaoshipingjiachengjiList[i].hupingfenshu)
          }
          1
        }
        for (var j in array) {
          pingjun = pingjun + array[j]
          a = pingjun / array.length
        }
        this.form3.shenghupingchengji = a
      },
      initKecheng() {
        // 防止重新点加载列表
        // 筛选条件
        var filter = extend(true, {}, {
          jiaoshiid: localStorage.getItem("jiaoshiid"),
          page: 1,
          pagesize: 10,
        });
        this.$post(api.kecheng.list, filter)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.kechengmingchengList = res.data.list;
              if (localStorage.getItem('role') == '教师') {
                for (var i in this.kechengmingchengList) {
                  var banjiid = this.kechengmingchengList[i].banjiId
                  this.loadList1(banjiid, 1)
                }
              }
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      submit3() {
        this.$refs.formModel3.validate().then(res => {
          if (this.loading) return;
          this.loading = true;
          this.form3.xueshengid = this.xueshengid
          this.form3.tianjiaren = localStorage.getItem('username')
          this.form3.zongfen = ''
          var form = this.form3;
          console.log(this.form3)
          this.$post(api.chengji.insert, form).then(res => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.$message.success('添加成功');
              this.dialogVisible2 = false
              this.$refs.formModel3.resetFields();
            } else {
              this.$message.error(res.msg);
            }
          }).catch(err => {
            this.loading = false;
            this.$message.error(err.message);
          })

        }).catch(err => {
          console.log(err.message);
        })

      },
      handleChange1(data) {
        const params = {};
        params.xueyuan = "";
        params.zhuanye = data;
        params.banjimingcheng = "";
        params.page = 1;
        params.pagesize = 10;
        this.$post(api.banji.list, params)
          .then((res) => {
            if (res.code == api.code.OK) {
              this.banjiList1 = res.data.list;
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      },
      handleChange(data) {
        console.log(this.banjiList);
        var id = "";
        this.banjiList.map(function (item) {
          console.log(item);
          if (item.banjimingcheng == data) {
            id = item.id;
          }
        });
        this.form.banjiid = id;
        this.form1.banjiid = id;
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;
            this.$post(api.xuesheng.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加学生信息成功");
                  this.loadList(1);
                  this.dialogVisible = false;
                  this.$refs.formModel.resetFields();
                  this.loadInfo();
                  // this.loadList();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      submit1() {
        this.$refs.formModel1
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form1;
            this.$post(api.xuesheng.update, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("修改学生信息成功");
                  this.loadList(1);
                  this.dialogVisible1 = false;
                  this.$emit("success", res.data);
                  this.$refs.formModel1.resetFields();
                  this.loadInfo();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      },
      edit(row) {
        this.form1 = row;
        this.dialogVisible1 = true;
        this.oper = "edit";
        this.operChange();
        this.handleChange1(row.zhuanye);
      },
      loadInfo() {
        var form = this.form;
        // 获取模块得数据
        this.loading = true;
        this.$post(api.xuesheng.create, {
            id: this.$route.query.id,
          })
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
            } else {
              this.$message.error(res.msg);
              this.$router.go(-1);
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
            this.$router.go(-1);
          });
      },
      operChange() {
        if (this.oper == "add") {
          this.headerTitle = "添加学生信息";
        } else {
          this.headerTitle = "编辑学生信息";
        }
      },
      addSubmit() {
        this.oper = "add";
        this.dialogVisible = true;
        this.operChange();
      },

      searchSubmit() {
        this.initKecheng()
        // this.loadList(1);
      },
      sizeChange(e) {
        this.pagesize = e;
        this.loadList(1);
      },
      checkIssh,
      loadList1(banjiid, page) {
        this.page = page;

        // 筛选条件
        var filter = extend(true, {}, this.search, {
          banjiid: banjiid,
          page: page + "",
          pagesize: this.pagesize + "",
        });
        this.list = []
        this.$post(api.xuesheng.list, filter)
          .then((res) => {

            this.loading = false;
            if (res.code == api.code.OK) {
              this.banjiList = res.data.banjiList
              this.zhuanyeList = res.data.zhuanyeList
              this.totalCount = res.data.totalCount;
              var array1 = res.data.list;
              var array = [];

              if (this.totalCount != 0) {
                array1.forEach((item) => {
                  array.push(item);
                });
                for (var i in array) {
                  this.list.push(array[i]);
                }
                // console.log(this.list)
              }
              this.totalCount = this.list.length
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      loadList(page) {
        this.page = page;
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          page: page + "",
          pagesize: this.pagesize + "",
        });
        this.$post(api.xuesheng.list, filter)
          .then((res) => {
            this.loading = false;
            if (res.code == api.code.OK) {
              extend(this, res.data);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.message);
          });
      },
      // 删除某行方法
      deleteItem(row) {
        this.$confirm("确定删除数据？", "提示", {
            // 弹出 确认框提示是否要删除
            type: "warning",
          })
          .then(() => {
            // 确定操作

            this.loading = true; // 滚动条
            this.$post(api.xuesheng.delete, {
                // 提交后台
                id: row.id,
              })
              .then((res) => {
                this.loading = false;
                if (res.code != api.code.OK) {
                  this.$message.error(res.msg);
                } else {
                  remove(this.list, row);
                }
              })
              .catch((err) => {
                // 访问网络错误
                this.loading = false;
                this.$message.error(err.message);
              });
          })
          .catch(() => {
            // 取消操作
          });
      },
    },
    beforeRouteUpdate(to, form, next) {
      extend(this.search, to.query);
      this.loadList(1);
      next();
    },
    created() {
      var search = extend(this.search, this.$route.query);
      if (search.page) {
        this.page = Math.floor(this.$route.query.page);
        delete search.page;
      }
      if (search.pagesize) {
        this.pagesize = Math.floor(this.$route.query.pagesize);
        delete search.pagesize;
      }


      if (localStorage.getItem('role') == '教师') {
        this.initKecheng()
      } else {
        this.loadList(1);
      }
      this.chengji()
    },
    mounted() {},
    destroyed() {},
  };
</script>