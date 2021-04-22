<template>
    <div class="jieguo-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix updt">
                                    <el-page-header @back="$router.go(-1)" content="编辑结果">
                    </el-page-header>
                            </div>
            <div class="form-database-form">
                

            <el-form :model="form" ref="formModel" label-width="130px" status-icon validate-on-rule-change>
                                <el-form-item v-if="isRead" label="题库编号" prop="tikubianhao">
                                            {{  form.tikubianhao  }}                                    </el-form-item>

                                <el-form-item v-if="isRead" label="题库名称" prop="tikumingcheng">
                                            {{  form.tikumingcheng  }}                                    </el-form-item>

                                <el-form-item v-if="isRead" label="发布人" prop="faburen">
                                            {{  form.faburen  }}                                    </el-form-item>

                                <el-form-item label="评价编号" prop="kaoshibianhao" :rules="[{required:true, message:'请填写评价编号'}]">
                                            <el-input placeholder="输入评价编号" style="width:250px;" v-model="form.kaoshibianhao" />                                    </el-form-item>

                                <el-form-item label="试题题目" prop="shititimu" required :rules="[{required:true, message:'请填写试题题目'}]">
                                            <el-input placeholder="输入试题题目" style="width:450px;" v-model="form.shititimu" />                                    </el-form-item>

                                <el-form-item label="类型" prop="leixing">
                                            <el-input placeholder="输入类型" style="width:250px;" v-model="form.leixing" />                                    </el-form-item>

                                <el-form-item label="答案" prop="daan">
                                            <el-input type="textarea" v-model="form.daan"></el-input>                                    </el-form-item>

                                <el-form-item label="得分" prop="defen" :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}]">
                                            <el-input placeholder="输入得分" style="width:250px;" v-model="form.defen" />                                    </el-form-item>

                                <el-form-item label="评价人" prop="kaoshiren">
                                            <el-input v-model="form.kaoshiren" readonly style="width: 250px;"></el-input>                                    </el-form-item>

                                <el-form-item v-if="btnText">
                    <el-button type="primary" @click="submit">{{ btnText }}</el-button>
                </el-form-item>
            </el-form>

            </div>
        </el-card>
    </div>
</template>
<style type="text/scss" scoped lang="scss">
.jieguo-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import { extend } from '@/utils/extend'

    
    export default {
        name:'jieguo-add',
        data() {
            return {
                                rule,
                loading:false,
                form:{
                    tikubianhao:'',
                    tikumingcheng:'',
faburen:this.$store.state.user.session.username,kaoshibianhao:rule.getID(),
                    shititimu:'',
                    leixing:'',
                    daan:'',
                    defen:'',
kaoshiren:this.$store.state.user.session.username,
            tikuid:0,
                        
                },

            
            }
        },
                watch: {
                        id: {
                handler() {
                    this.loadInfo();
                }
            }
                    },
        props: {
            isRead:{
                type:Boolean,
                default:true
            },
            btnText:{
                type:String,
                default:'提交'
            },
                        id: {
                type: [String, Number],
                required: true
            },
                    },

        computed: {},
        methods: {
            submit(){
                this.$refs.formModel.validate().then(res=>{
                    if(this.loading)return;
                    this.loading = true;
                    var form = this.form;

                    this.$post(api.jieguo.update , form).then(res=>{
                        this.loading = false;
                        if(res.code == api.code.OK){
                            this.$message.success('添加成功');
                            this.$emit('success' , res.data);
                            this.$refs.formModel.resetFields();
                                                        this.$router.go(-1);
                                                    }else{
                            this.$message.error(res.msg);
                        }
                    }).catch(err=>{
                        this.loading = false;
                        this.$message.error(err.message);
                    })

                }).catch(err=>{
                    console.log(err.message);
                })

            },
            loadInfo(){

                                // 更新数据,获取数据
                this.loading = true;
                var form = this.form;
                this.$post(api.jieguo.edit , {
                    id:this.id
                }).then(res=>{
                    this.loading = false;
                    if(res.code == api.code.OK){
                        extend(this , res.data);
                        this.form = res.data.mmm;

                    }else{
                        this.$message.error(res.msg);
                        this.$router.go(-1);
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                    this.$router.go(-1);
                });
                            },
                    },
        created() {
            this.loadInfo();
                    },
        mounted() {
                    },
        destroyed() {
                    }
    }
</script>
