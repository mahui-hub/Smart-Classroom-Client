<template>
    <div class="kaoshijieguo-add" v-loading="loading">
        <el-card class="box-card">
            <div slot="header" class="clearfix updt">
                                    <el-page-header @back="$router.go(-1)" content="编辑评价结果">
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



                                <el-form-item label="单选题得分" prop="danxuantidefen" :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}]">
                                            <el-input placeholder="输入单选题得分" style="width:250px;" v-model="form.danxuantidefen" />                                    </el-form-item>

                                <el-form-item label="多选题得分" prop="duoxuantidefen" :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}]">
                                            <el-input placeholder="输入多选题得分" style="width:250px;" v-model="form.duoxuantidefen" />                                    </el-form-item>



                                <el-form-item label="总得分" prop="zongdefen" :rules="[{validator:rule.checkNumber, message:'输入一个有效数字'}]">
                                            <el-input placeholder="输入总得分" style="width:250px;" v-model="form.zongdefen" />                                    </el-form-item>

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
.kaoshijieguo-add{

}
</style>
<script>
    import api from '@/api'
    import rule from '@/utils/rule'
    import { extend } from '@/utils/extend'

    
    export default {
        name:'kaoshijieguo-add',
        data() {
            return {
                                rule,
                loading:false,
                form:{
                    tikubianhao:'',
                    tikumingcheng:'',
faburen:this.$store.state.user.session.username,kaoshibianhao:rule.getID(),
                    kaoshishichang:'',
                    danxuantidefen:'',
                    duoxuantidefen:'',
                    tiankongtidefen:'',
                    zongdefen:'',
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

                    this.$post(api.kaoshijieguo.update , form).then(res=>{
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
                this.$post(api.kaoshijieguo.edit , {
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
