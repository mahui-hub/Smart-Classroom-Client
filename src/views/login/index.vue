<template>
  <div class="login-container">
    <div class="form-box">
      <div class="logo">
        <span> {{ setting.title }} </span>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form" autocomplete="off"
        label-position="right">
        <span v-if="login.type === 'up'">
          <el-form-item prop="username">
            <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"
              name="username" type="text" autocomplete="off" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input ref="pwd" v-model="loginForm.pwd" prefix-icon="el-icon-key" type="password" placeholder="请输入密码"
              name="pwd" autocomplete="off" :show-password="true" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item prop="cx">
            <el-radio-group v-model="loginForm.cx">
              <el-radio :key="r" :value="r" :label="r" v-for="r in roles">{{
                r
              }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:14px;"
            @click.native.prevent="handleLogin">登录</el-button>
          <p class="forget-password">
            <span @click="changeTab('forget')">忘记密码？</span>
          </p>
        </span>
        <span v-if="login.type === 'forget'">
          <el-form-item prop="username">
            <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"
              name="username" type="text" autocomplete="off" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item prop="password1">
            <el-input ref="password" v-model="loginForm.password1" prefix-icon="el-icon-key" type="password"
              placeholder="请输入密码" name="password1" autocomplete="off" :show-password="true" />
          </el-form-item>
          <el-form-item prop="password2">
            <el-input ref="password" v-model="loginForm.password2" prefix-icon="el-icon-key" type="password"
              placeholder="请再次确认密码" name="password2" autocomplete="off" :show-password="true" />
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:14px;"
            @click.native.prevent="handleConfirm">提交</el-button>
          <p class="forget-password">
            <span @click="changeTab('up')">返回登录</span>
          </p>
        </span>
      </el-form>
      <div class="copyright">版权所有@{{ setting.title }}</div>
    </div>
    <div class="bg-box"></div>
  </div>
</template>

<script>
  // import db from "@/utils/localstorage";
  import setting from "@/setting.js";
  import api from "@/api";
  export default {
    name: "Login",
    data() {
      return {
        setting,
        ifFirstLogin: true,
        login: {
          type: "up",
        },
        roles: ["管理员", "学生", "教师"],
        loginForm: {
          username: "",
          pwd: "",
          cx: "管理员",
          password1: "",
          password2: "",
        },
        timeMachine: null,
        rules: {
          username: {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
          pwd: {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          password1: [{
              required: true,
              message: "请输入密码",
              trigger: "blur",
            },
            {
              min: 8,
              message: "密码长度应最少8位",
              trigger: "blur"
            },
            //   {
            //     pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,30}$/,
            //     message: "密码需包含大小写、数字、符号其中三项",
            //   },
          ],
          password2: [{
              required: true,
              message: "请再次输入密码",
              trigger: "blur",
            },
            {
              validator: (rule, value, callback) => {
                if (this.loginForm.password1 !== value) {
                  // callback(this.$t("tips.notEqual"));
                  callback("两次密码不一致");
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
        },
        loading: false,
        page: {
          width: window.screen.width * 0.5,
          height: window.screen.height * 0.5,
        },
      };
    },
    mounted() {
      // db.clear();
    },
    destroyed() {
      // window.removeEventListener("message", this.resolveSocialLogin);
    },
    methods: {
      handleLogin() {
        let username_c = false;
        let password_c = false;
        let code_c = false;
        this.$refs.loginForm.validateField("username", (e) => {
          if (!e) {
            username_c = true;
          }
        });
        this.$refs.loginForm.validateField("pwd", (e) => {
          if (!e) {
            password_c = true;
          }
        });
        this.$refs.loginForm.validateField("cx", (e) => {
          if (!e) {
            code_c = true;
          }
        });
        if (username_c && password_c && code_c) {
          this.$store
            .dispatch("user/login", this.loginForm)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message({
                  showClose: true,
                  message: '登录成功',
                  type: 'success'
                });
                localStorage.setItem("role", this.loginForm.cx);
                if (this.loginForm.cx == "学生") {
                  localStorage.setItem("banjiId", res.data.session.banjiid);
                } else if (this.loginForm.cx == "教师") {
                  localStorage.setItem("jiaoshiid", res.data.session.id);
                }

                localStorage.setItem("username", res.data.session.username);
                var redirect = this.$route.query.redirect;

                if (redirect) {
                  this.$router.replace(redirect);
                } else {
                  this.$router.push("/index");
                  // this.$router.replace("/admin/sy");
                }
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error(err.message);
            });
        }
      },
      changeTab(tab) {
        this.login.type = tab;
        this.loading = false;
        this.loginForm = {
          username: "",
          pwod: "",
          cx: "",
          password1: "",
          password2: "",
        };
        this.$refs.loginForm.clearValidate();
        this.$refs.loginForm.resetFields();
      },
      handleConfirm() {
        let username_c = false;
        let password_c = false;
        let password2_c = false;
        this.$refs.loginForm.validateField("username", (e) => {
          if (!e) {
            username_c = true;
          }
        });
        this.$refs.loginForm.validateField("password1", (e) => {
          if (!e) {
            password_c = true;
          }
        });
        this.$refs.loginForm.validateField("password2", (e) => {
          if (!e) {
            password2_c = true;
          }
        });

        if (username_c && password_c && password2_c) {
          this.loading = true;
          // this.$store
          //   .dispatch("user/login", this.loginForm)
          //   .then((res) => {
          //     this.loading = false;
          //     if (res.code == api.code.OK) {
          //       this.$message.success("登录成功");
          //       var redirect = this.$route.query.redirect;
          //       if (redirect) {
          //         this.$router.replace(redirect);
          //       } else {
          //         this.$router.replace("/admin/sy");
          //       }
          //     } else {
          //       this.$message.error(res.msg);
          //     }
          //   })
          //   .catch((err) => {
          //     this.loading = false;
          //     this.$message.error(err.message);
          //   });
          const param = {
            username: this.loginForm.username,
            pwd: this.loginForm.pwd,
            cx: this.loginForm.cx,
          };
          this.$store
            .dispatch("user/login", param)
            .then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.loading = false;
              this.login.type = "up";
            })
            .catch(() => {
              // this.loginForm.password1 = AES.decrypt(this.loginForm.password1);
              this.loading = false;
            });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    background-image: url(http://al.cnweike.cn/content/0/0/1/258/598289.jpg);
    display: flex;
    height: 100%;

    .bg-box {
      flex-grow: 1;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .form-box {
      text-align: right;
      position: fixed;
      right: 0;
      width: 400px;
      padding: 0 40px;
      background: white;
      border-radius: 10px;
      margin: 80px 120px;

      .el-form-item {
        margin-bottom: 22px;
      }

      .logo {
        text-align: center;
        margin: 50px 0;
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        font-size: 24px;
        font-weight: bolder;
        background-image: -webkit-linear-gradient(bottom, red, #fd8403, yellow);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .copyright {
        text-align: center;
        margin-bottom: 30px;
      }

      .forget-password {
        cursor: pointer;
      }

      .forget-password:hover {
        color: #11ca6d;
      }
    }
  }
</style>