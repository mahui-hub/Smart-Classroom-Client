<template>
    <div v-if="paperList.length > 0">
        <div class="ksTime" v-if="ksTimeText">{{ ksTimeText }}</div>
        <div v-for="(r, j) in paperList" :key="j">
            <div class="zhangjie-list" style="margin-bottom: 10px; padding: 10px; background: #fff">
                <h3>第{{ j + 1 }}题：{{ r[timu] }}</h3>
                <div>
                    <template v-if="
              danxuanti.indexOf(r[type]) != -1 ||
              panduanti.indexOf(r[type]) != -1
            ">
                        <t-radio :obj="r" :paper="r.paper" :daan="daan" :disabled="isDisabled(r)"></t-radio>
                        <div v-if="success && r.zimu" class="success-daan">
                            <div class="success" v-if="Math.floor(r.defen) > 0">
                                <i class="el-icon-success" style="color: #008744"></i>
                                回答正确
                            </div>
                            <div class="error" v-else>
                                <i class="el-icon-error" style="color: #bf0000"></i>
                                回答错误,<span style="color: #990000">正确答案 {{ r[success] }}</span>
                            </div>
                        </div>
                        <div class="jieshi" v-if="jieshi && r.zimu">
                            {{ r[jieshi] }}
                        </div>
                    </template>
                    <template v-else-if="duoxuanti.indexOf(r[type]) != -1">
                        <t-checkbox :obj="r" :paper="r.paper" :daan="daan"></t-checkbox>
                        <div v-if="success && r.zimu">正确答案：{{ r[success] }}</div>
                        <div v-if="jieshi && r.zimu">
                            {{ r[jieshi] }}
                        </div>
                    </template>
                    <template v-else>
                        <t-textarea :obj="r"></t-textarea>
                    </template>
                </div>
            </div>
        </div>
        <div class="ksTime" v-if="ksTimeText">{{ ksTimeText }}</div>
        <div class="mt10">
            <el-button type="success" @click="submitPost">提交</el-button>
        </div>
        <el-dialog title="考试结果" :visible.sync="dialogVisible" size="mini">
            <div class="form-database-form">
                <div class="deji">
                    <span v-if="fenshu<60">您的等级为不合格，不要伤心哦!请再接再厉</span>
                    <span v-if="fenshu>=60&&fenshu<85">您的等级为良好，请继续努力哦</span>
                    <span v-if="fenshu>=85">您的等级为优秀，不要骄傲哦</span>
                </div>
                <div class="df">
                    <span>您的得分为</span>
                    <span> {{ fenshu }} </span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from "@/api";
    import {
        each,
        extend
    } from "@/utils/extend";
    import TRadio from "./type/radio";
    import TTextarea from "./type/textarea";
    import TCheckbox from "./type/checkbox";

    export default {
        name: "e-paper-form",
        components: {
            TCheckbox,
            TTextarea,
            TRadio,
        },
        data() {
            return {
                dialogVisible: false,
                isSelect: true,
                paperList: [],
                time: 0,
                ksTimeText: "",
                tikuid: "",
                fenshu: "",
                tikuType: "",
            };
        },
        props: {
            list: Array,
            daan: {
                type: String,
                default: "daan",
            },
            type: String,
            timu: String,
            danxuanti: {
                type: String,
                default: "",
            },
            duoxuanti: {
                type: String,
                default: "",
            },
            panduanti: {
                type: String,
                default: "",
            },
            success: String,
            jieshi: String,
            ksTime: [Number, String],
        },
        watch: {
            list: {
                handler() {
                    this.updatePaperList();
                    this.initKaoshiTime();
                },
                deep: true,
            },
        },
        methods: {
            isDisabled(r) {
                if (!this.success && !this.jieshi) {
                    return false;
                }
                return r.zimu != "";
            },
            submit() {
                this.dialogVisible = false;
                this.$router.go(-1);
            },
            submitPost() {
                this.$confirm("提交后将不可更改, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        if (this.tikuType == "测验试卷") {
                            var endtime = Math.floor(new Date().getTime() / 1000);
                            var result = extend(true, [], this.paperList);
                            each(result, (i, o) => {
                                delete o.paper;
                            });
                            this.$emit("submit", result, endtime - this.time, this.tikuType);
                        } else {
                            var endtime = Math.floor(new Date().getTime() / 1000);
                            var result = extend(true, [], this.paperList);
                            each(result, (i, o) => {
                                delete o.paper;
                            });
                            this.$emit("submit", result, endtime - this.time);
                            this.$router.go(-1);
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消提交",
                        });
                    });
            },
            defen() {
                const params = {};
                params.tikuid = this.tikuid;
                params.kaoshiren = localStorage.getItem("username");
                params.page = 1;
                params.pagesize = 10;
                this.$post(api.kaoshijieguo.list, params)
                    .then((res) => {
                        if (res.code == api.code.OK) {
                            var list = res.data.list;
                            this.fenshu = (list[0].danxuantidefen + list[0].duoxuantidefen + list[0]
                                .tiankongtidefen) / list[0].zongfen * 100;
                            console.log(this.fenshu);
                            this.$nextTick(() => {
                                this.dialogVisible = true;
                            })
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        this.$message.error(err.message);
                    });
            },
            updatePaperList() {
                // console.log(this.list);
                var result = [];
                var tikuid = "";
                var tikuType = "";
                for (var i in this.list) {
                    var ci = this.list[i];
                    tikuid = this.list[i].tikuid;
                    tikuType = this.list[i].tikutype;
                    ci.paper = ci[this.daan];
                    var obj = {
                        zimu: "",
                        daan: "",
                        defen: 0,
                    };
                    var res = extend({}, ci, obj);
                    result.push(res);
                }
                this.paperList = result;
                this.tikuid = tikuid;
                this.tikuType = tikuType;
                console.log(this.tikuid);
                console.log(this.tikuType);
            },

            initKaoshiTime() {
                var that = this;
                var ksTime = Math.floor(this.ksTime);
                if (ksTime && !isNaN(ksTime) && ksTime > 0) {
                    clearInterval(this.timer);

                    var fenshu = ksTime;
                    var key = "stopTime";
                    var stopTime = new Date().getTime() + 60 * fenshu * 1000;
                    stopTime = new Date(Math.floor(stopTime));

                    var clock = () => {
                        if (new Date().getTime() > stopTime) {
                            that.submitPost(true);
                            return;
                        }
                        var today = new Date(), //当前时间
                            h = today.getHours(),
                            m = today.getMinutes(),
                            s = today.getSeconds();
                        var stopH = stopTime.getHours(),
                            stopM = stopTime.getMinutes(),
                            stopS = stopTime.getSeconds();
                        var shenyu = stopTime.getTime() - today.getTime(), //倒计时毫秒数
                            shengyuD = parseInt(shenyu / (60 * 60 * 24 * 1000)), //转换为天
                            D = parseInt(shenyu) - parseInt(shengyuD * 60 * 60 * 24 * 1000), //除去天的毫秒数
                            shengyuH = parseInt(D / (60 * 60 * 1000)), //除去天的毫秒数转换成小时
                            H = D - shengyuH * 60 * 60 * 1000, //除去天、小时的毫秒数
                            shengyuM = parseInt(H / (60 * 1000)), //除去天的毫秒数转换成分钟
                            M = H - shengyuM * 60 * 1000; //除去天、小时、分的毫秒数
                        var S = parseInt(
                            (shenyu -
                                shengyuD * 60 * 60 * 24 * 1000 -
                                shengyuH * 60 * 60 * 1000 -
                                shengyuM * 60 * 1000) /
                            1000
                        ); //除去天、小时、分的毫秒数转化为秒
                        that.ksTimeText =
                            "剩余时间：" + (shengyuH + "小时" + shengyuM + "分" + S + "秒");

                        // setTimeout("clock()",500);
                        //setTimeout(clock, 500);
                    };
                    this.timer = setInterval(clock, 1000);
                }
            },
        },
        created() {
            this.time = Math.floor(new Date().getTime() / 1000);
            this.updatePaperList();
            this.initKaoshiTime();
        },
    };
</script>

<style lang="scss" scoped>
    .success-daan {
        padding: 10px 0;
    }

    .el-dialog__body {
        .form-database-form {
            font-size: 30px;
            font-weight: 600;
            text-align: center;

            .deji {
                color: aqua;
            }

            .df {
                color: red;
            }

        }

    }

    .jieshi {
        padding: 10px;
        background: #f2f2f2;
    }

    .ksTime {
        padding: 8px;
        background: #740909;
        color: #ffffff;
    }
</style>