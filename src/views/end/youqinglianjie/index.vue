<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <div class="app-title">
      <el-button @click="add" type="primary" icon="el-icon-plus">新增网站</el-button>
    </div>

    <el-table border :data="list" highlight-current-row stripe>
      <el-table-column type="index" label=" "></el-table-column>
      <!-- 序号 -->

      <el-table-column label="网站名称" align="center">
        <template slot-scope="{ row }">
          {{ row.wangzhanmingcheng }}
        </template>
      </el-table-column>
      <el-table-column label="网址" align="center">
        <template slot-scope="{ row }"> {{ row.wangzhi }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <!-- @click="
              $goto({
                path: '/admin/youqinglianjieupdt',
                query: { id: row.id },
              })
            " -->
          <el-button @click="edit(row)" type="text">编辑</el-button>
          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog :title="headerTitle" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="网站名称" prop="wangzhanmingcheng" required
            :rules="[{ required: true, message: '请填写网站名称' }]">
            <el-input placeholder="请输入网站名称" v-model="form.wangzhanmingcheng" />
          </el-form-item>

          <el-form-item label="网址" prop="wangzhi" required :rules="[{ required: true, message: '请填写网址' }]">
            <el-input placeholder="请输入网址" v-model="form.wangzhi" />
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" v-if="oper=='add'">确 定</el-button>
        <el-button type="primary" @click="submit1" v-if="oper=='edit'">确 定</el-button>

      </span>
    </el-dialog>
  </div>
</template>
<style type="text/scss" scoped lang="scss">
  .app-title{
  margin-bottom: 20px;
}
</style>
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
        oper: '',
        rule,
        form: {
          wangzhanmingcheng: "",
          wangzhi: "",
        },
        headerTitle: '',
        dialogVisible: false,
        loading: false,
        list: [],
        search: {},
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
      };
    },
    watch: {},
    computed: {},
    methods: {
      add() {
        this.oper = 'add'
        this.dialogVisible = true
        this.headerTitle = '添加网站'
      },
      submit() {
        this.$refs.formModel
          .validate()
          .then((res) => {
            if (this.loading) return;
            this.loading = true;
            var form = this.form;

            this.$post(api.youqinglianjie.insert, form)
              .then((res) => {
                this.loading = false;
                if (res.code == api.code.OK) {
                  this.$message.success("添加成功");
                  this.dialogVisible = false
                  this.loadList(1)
                  this.$refs.formModel.resetFields();
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
        this.oper = 'edit'
        this.dialogVisible = true
        this.headerTitle = '编辑网站'
        this.loadInfo1(row.id);
      },
      submit1() {
        this.$refs.formModel.validate().then(res => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.youqinglianjie.update, form).then(res => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.$message.success('添加成功');
              this.dialogVisible = false
              this.loadList(1)
              this.$refs.formModel.resetFields();

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
      loadInfo1(id) {

        // 更新数据,获取数据
        this.loading = true;
        var form = this.form;
        this.$post(api.youqinglianjie.edit, {
          id: id
        }).then(res => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
            this.form = res.data.mmm;

          } else {
            this.$message.error(res.msg);
            this.$router.go(-1);
          }
        }).catch(err => {
          this.$message.error(err.message);
          this.$router.go(-1);
        });
      },
      searchSubmit() {
        this.loadList(1);
      },
      sizeChange(e) {
        this.pagesize = e;
        this.loadList(1);
      },
      checkIssh,

      loadList(page) {
        // 防止重新点加载列表
        if (this.loading) return;
        this.loading = true;
        this.page = page;
        // 筛选条件
        var filter = extend(true, {}, this.search, {
          page: page + "",
          pagesize: this.pagesize + "",
        });
        var diff = objectDiff.diff(filter, this.$route.query);
        if (diff.changed != "equal") {
          // 筛选的条件不一致则更新链接
          this.$router.push({
            // 更新query
            path: this.$route.path,
            query: filter,
          });
        }
        this.$post(api.youqinglianjie.list, filter)
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
            this.$post(api.youqinglianjie.delete, {
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

      this.loadList(1);
    },
    mounted() {},
    destroyed() {},
  };
</script>