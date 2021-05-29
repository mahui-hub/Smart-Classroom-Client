<template>
  <div class="v-list" v-loading="loading" element-loading-text="加载中">
    <!-- 搜索 -->
    <div class="form-search">
      <el-form @submit.prevent.stop :inline="true" size="mini">
        <el-form-item label="题库名称">
          <el-input v-model="search.tikumingcheng"></el-input>
        </el-form-item>
        <el-form-item label="试题题目">
          <el-input v-model="search.shititimu"></el-input>
        </el-form-item>
        <el-form-item label="题目类型">
          <el-select v-model="search.leixing" clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option label="单选题" value="单选题"></el-option>
            <el-option label="多选题" value="多选题"></el-option>
          </el-select>
        </el-form-item>
        <!-- 后续使用 -->
        <el-form-item label="题库类别">
          <el-select v-model="search.tikutype" clearable>
            <el-option label="请选择" value=""></el-option>
            <el-option label="评价题库" value="评价题库"></el-option>
            <el-option label="测验题库" value="测验题库"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="list" style="width: 100%" highlight-current-row stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="题库名称" align="center">
        <template slot-scope="{ row }"> {{ row.tikumingcheng }} </template>
      </el-table-column>
      <el-table-column label="题库类别" align="center">
        <template slot-scope="{ row }"> {{ row.tikutype }} </template>
      </el-table-column>
      <el-table-column label="试题题目" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.shititimu }} </template>
      </el-table-column>
      <el-table-column label="题目类型" align="center">
        <template slot-scope="{ row }"> {{ row.leixing }} </template>
      </el-table-column>
      <el-table-column label="答案" align="center" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <e-paper-view :vo="row" :map="row.daan"></e-paper-view>
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center">
        <template slot-scope="{ row }"> {{ row.faburen }} </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="edit(row)" type="text">编辑</el-button>
          <!-- <el-button @click="$goto({ path: '/end/shitiupdt', query: { id: row.id } })" type="text">编辑</el-button> -->

          <el-button type="text" @click="deleteItem(row)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="e-pages" style="margin-top: 10px;text-align: center">
      <el-pagination @current-change="loadList" :current-page="page" :page-size="pagesize" @size-change="sizeChange"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog title="编辑试题" :visible.sync="dialogVisible" size="mini">
      <div class="form-database-form">
        <el-form :model="form" ref="formModel" label-width="100px" status-icon validate-on-rule-change>
          <el-form-item label="题库编号" prop="tikubianhao">
            <el-input v-model="form.tikubianhao" disabled></el-input>
          </el-form-item>

          <el-form-item label="题库名称" prop="tikumingcheng">
            <el-input v-model="form.tikumingcheng" disabled></el-input>
          </el-form-item>

          <el-form-item label="试题题目" prop="shititimu" required :rules="[{required:true, message:'请填写试题题目'}]">
            <el-input type="textarea" v-model="form.shititimu"></el-input>
          </el-form-item>

          <el-form-item label="题目类型" prop="leixing">
            <el-select v-model="form.leixing" style="width：100%;">
              <el-option label="单选题" value="单选题"></el-option>
              <el-option label="多选题" value="多选题"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="答案" prop="daan">
            <e-paper v-model="form.daan" :type="form.daan" danxuanti="" duoxuanti="" panduanti=""></e-paper>
          </el-form-item>
          <el-form-item label="发布人" prop="faburen">
            <el-input v-model="form.faburen" readonly disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
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

  /**
   * 后台列表页面
   */
  export default {
    data() {
      return {
        form: {
          tikubianhao: '',
          tikumingcheng: '',
          shititimu: '',
          leixing: '',
          daan: '',
          faburen: this.$store.state.user.session.username,
          tikuid: 0,
        },
        dialogVisible: false,
        loading: false,
        list: [],
        search: {
          tikutype: '',
          tikumingcheng: "",
          shititimu: "",
          leixing: "",
          faburen: ''
        },
        total: {},
        page: 1, // 当前页
        pagesize: 10, // 页大小
        totalCount: 0, // 总行数
      };
    },
    watch: {},
    computed: {},
    methods: {
      edit(row) {
        this.loadInfo(row.id)
        this.dialogVisible = true
      },
      submit() {
        this.$refs.formModel.validate().then(res => {
          if (this.loading) return;
          this.loading = true;
          var form = this.form;

          this.$post(api.shiti.update, form).then(res => {
            this.loading = false;
            if (res.code == api.code.OK) {
              this.$message.success('修改成功');
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
      loadInfo(id) {
        // 更新数据,获取数据
        this.loading = true;
        this.$post(api.shiti.edit, {
          id: id
        }).then(res => {
          this.loading = false;
          if (res.code == api.code.OK) {
            extend(this, res.data);
            this.form = res.data.mmm;

          } else {
            this.$message.error(res.msg);

          }
        }).catch(err => {
          this.$message.error(err.message);

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
        if (localStorage.getItem('role') == '教师') {
          this.search.faburen = localStorage.getItem('username')
        }
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
        this.$post(api.shiti.list, filter)
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
            this.$post(api.shiti.delete, {
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