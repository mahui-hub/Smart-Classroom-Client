<template>
  <div class="lanserichang-index-login">
    <div class="div_top">{{ setting.title }}</div>
    <div class="login">
      <div class="message">系统登录</div>
      <div id="darkbannerwrap"></div>
      <form action="javascript:;" method="post" @submit="login">
        <input name="username" v-model="form.username" placeholder="用户名" type="text" id="user" />
        <hr class="hr15" />
        <input name="pwd" placeholder="密码" v-model="form.pwd" type="password" id="pass" />
        <hr class="hr15" />
        <el-select name="cx" v-model="form.cx" style="width: 100%">
          <el-option :key="r" :value="r" :label="r" v-for="r in rules"></el-option>
        </el-select>
        <hr class="hr15" />
        <input value="登录" style="width:100%;" type="submit" id="login_btn" />
        <hr class="hr20" />
      </form>
    </div>
    <div class="copyright">版权所有@{{ setting.title }}</div>
  </div>
</template>
<style type="text/scss" lang="scss">
  .lanserichang-index-login {
  background-image: url(http://al.cnweike.cn/content/0/0/1/258/598289.jpg);
  width: 100%;
  height: 100%;
  // background-image: url("./image/bg4.jpg");
  background-size: 100% 100%;
  background-size: cover;
  a {
    color: #2e619a;
    text-decoration: none;
    cursor: pointer;
  }
  .div_top {
    width: 100%;
    padding-top: 115px;
    padding-bottom: 15px;
    color: #ffffff;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin: 0 auto;
    text-shadow: 3px 3px 3px #000;
  }
  .login {
    margin: 20px auto 0 auto;
    min-height: 420px;
    max-width: 420px;
    padding: 40px;
    background-color: #ffffff;
    margin-left: auto;
    margin-right: auto;
    border-radius: 4px;
    /* overflow-x: hidden; */
    box-sizing: border-box;
    box-shadow: 0px 0px 5px 0px #828282;
  }
  a.logo {
    display: block;
    height: 58px;
    width: 167px;
    margin: 0 auto 30px auto;
    background-size: 167px 42px;
  }
  .message {
    margin: 10px 0 0 -58px;
    padding: 18px 10px 18px 60px;
    background: #2a83cf;
    position: relative;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
  #darkbannerwrap {
    width: 18px;
    height: 10px;
    margin: 0 0 20px -58px;
    position: relative;
  }

  input[type="text"],
  input[type="file"],
  input[type="password"],
  input[type="email"],
  select {
    border: 1px solid #dcdee0;
    vertical-align: middle;
    border-radius: 3px;
    height: 50px;
    padding: 0px 16px;
    font-size: 14px;
    color: #555555;
    outline: none;
    width: 100%;

    transition: all 200ms linear;
  }
  input[type="text"]:focus,
  input[type="file"]:focus,
  input[type="password"]:focus,
  input[type="email"]:focus,
  select:focus {
    border: 1px solid #27a9e3;
  }

  input[type="submit"],
  input[type="button"] {
    display: inline-block;
    vertical-align: middle;
    padding: 12px 24px;
    margin: 0px;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    color: #ffffff;
    background-color: #2a83cf;
    border-radius: 3px;
    border: none;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
    letter-spacing: 15px;
  }

  .pagerandom {
    position: relative;
  }
  .pagerandom img {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  hr.hr15 {
    height: 15px;
    border: none;
    margin: 0px;
    padding: 0px;
    width: 100%;
  }
  hr.hr20 {
    height: 20px;
    border: none;
    margin: 0px;
    padding: 0px;
    width: 100%;
    color: #2e619a;
  }
  .copyright {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    display: block;
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
    text-shadow: 5px 5px 5px #000;
  }
}
</style>
<script>
  import setting from "@/setting";
  import api from "@/api";

  export default {
    name: "lanserichang-index",
    data() {
      return {
        setting,
        loading: false,
        form: {
          username: "",
          pwd: "",
          cx: "管理员",
        },
        rules: ["管理员", "学生", "教师"],
      };
    },
    watch: {},
    computed: {},
    methods: {
      validateLogin() {
        var form = this.form;
        var username = form.username;
        var pwd = form.pwd;

        if (username == "") {
          this.$message.error("帐号不能为空");
          return false;
        }
        if (pwd == "") {
          this.$message.error("密码不能为空");
          return false;
        }
        return true;
      },

      login() {
        /*if(this.captchCode != this.form.pagerandom)
              {
                  this.$message.error('验证码错误');
                  return;
              }*/

        if (this.validateLogin()) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.form)
            .then((res) => {
              this.loading = false;
              if (res.code == api.code.OK) {
                this.$message({
                  showClose: true,
                  message: '登录成功',
                  type: 'success'
                });

                localStorage.setItem("role", this.form.cx);
                var redirect = this.$route.query.redirect;
                if (redirect) {
                  this.$router.replace(redirect);
                } else {
                  this.$router.replace("/admin/sy");
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
    },
    created() {},
    mounted() {},
    destroyed() {},
  };
</script>