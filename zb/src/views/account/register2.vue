<style scoped lang="less">
.register-title {
  background-color: #e7f2ff;
  border-bottom: solid 3px #c8e1fe;
  line-height: 60px;
  padding: 0 20px;
  font-size: 20px;
  font-weight: bold;
  display: block;
}
.register-content {
  border: solid 2px #e7f2ff;
  border-top: 0;
  padding: 0 10%;

}
</style>
<template>
  <div>
    <div class="register-title">
      企业认证
    </div>
    <div class="register-content">
      <br><br><br>
      <register-step v-if="$store.registerModel&&$store.registerModel.id" :current="1" :items="[{index:1,title:'公司信息'},{index:2,title:'营业执照信息'},{index:3,title:'开户行信息'}]"></register-step>
      <register-step v-else :current="2" :items="[{index:1,title:'用户信息'},{index:2,title:'公司信息'},{index:3,title:'营业执照信息'},{index:4,title:'开户行信息'}]"></register-step>
      <br><br><br>
      <Form ref="formregister" :model="data" :rules="rules" :label-width="240">
        <FormItem label="企业名称：" prop="name">
            <Input v-model="data.name" placeholder="请输入用户名" style="width: 300px;"></Input>&nbsp;&nbsp;（不超过100个英文字符或50个汉字）
        </FormItem>
        <FormItem label="企业性质：" prop="nature">
          <Select v-model="data.nature" style="width:300px">
              <Option v-for="item in natureList" :value="item.key" :key="item.key">{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="企业所在地区：" prop="county">
          <Select v-model="data.province" style="width:98px">
              <Option v-for="item in provinceList" :value="item.key" :key="item.key">{{item.value}}</Option>
          </Select>
          <Select v-model="data.city" style="width:98px">
              <Option v-for="item in cityList" :value="item.key" :key="item.key">{{item.value}}</Option>
          </Select>
          <Select v-model="data.county" style="width:98px">
              <Option v-for="item in countyList" :value="item.key" :key="item.key">{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="详细地址：" prop="detail">
            <Input v-model="data.detail" placeholder="请输入详细地址" style="width: 300px;"></Input>&nbsp;&nbsp;（不超过100个英文字符或50个汉字）
        </FormItem>
        <FormItem label="邮政编码：" prop="zipCode">
            <Input v-model="data.zipCode" placeholder="请输入邮政编码" style="width: 300px;"></Input>&nbsp;&nbsp;（6位数字）
        </FormItem>
        <FormItem label="联系人姓名：" prop="adminName">
            <Input v-model="data.adminName" placeholder="请输入联系人姓名" style="width: 300px;"></Input>&nbsp;&nbsp;（不超过100个字符或50个汉字）
        </FormItem>
        <FormItem label="联系人电话：" prop="adminPhone">
            <Input v-model="data.adminPhone" placeholder="请输入联系人电话" style="width: 300px;"></Input>&nbsp;&nbsp;（座机或手机号）
        </FormItem>
        <FormItem label="经营范围：" prop="businessScope">
            <Input v-model="data.businessScope" placeholder="请输入经营范围" style="width: 300px;"></Input>&nbsp;&nbsp;（不超过280个英文字符或140个汉字）
        </FormItem>
        <FormItem>
          <br>
            <Button type="primary" @click="next()">&nbsp;&nbsp;&nbsp;&nbsp;下一步&nbsp;&nbsp;&nbsp;&nbsp;</Button>
            <Button v-if="!($store.registerModel&&$store.registerModel.id)" type="primary" @click="pre()">&nbsp;&nbsp;&nbsp;&nbsp;上一步&nbsp;&nbsp;&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
      <br>
    </div>
  </div>
</template>
<script>
import RegisterStep from '../../components/register-step';

export default {
  components:{
    RegisterStep
  },
  data() {
    return {
      current: 2,

      natureList: [{key:"-1", value: "请选择"}],
      provinceList: [{key:-1, value: "请选择"}],
      cityList: [{key:-1, value: "请选择"}],
      countyList: [{key:-1, value: "请选择"}],
      
      provinceListLoadedOnce: true,
      cityListLoadedOnce: true,
      countyListLoadedOnce: true,
      data: {
        name: "",
        nature: "-1",
        province: -1,
        city: -1,
        county: -1,
        detail: "",
        zipCode: "",
        adminName: "",
        adminPhone: "",
        businessScope: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
          { type: "method", validator: function(rule, value, callback, source, options){
            if(value.replace(/[^\x00-\xff]/g, "aa").length > 100){
              callback(["error"]);
              return;
            }
            callback([]);
          }, message: "企业名称长度过长", trigger: "blur" },
          {
            type: "method",
            validator: (rule, value, callback, source, options) => {
              // 为了规避企业重新认证时公司名称重复问题
              if (this.$store.oldNameStorage && value == this.$store.oldNameStorage) {
                callback();
                return;
              }
              this.$service.post("/PlantOpenTender/companyService/IfCompanyNameExsit",{ Name: value }).then(res=>{
                if(res.result){
                  callback(new Error(""));
                }
                else{
                  callback();
                }
              });
            },
            message: "企业名称重复",
            trigger: "blur"
          }
        ],
        nature: [{ required: true, type: "method", validator: (rule, value, callback, source, options)=>{
            if(value==-1){
              callback(["error"]);
              return;
            }
            callback([]);
          }, message: "请选择企业性质", trigger: "change" }],
        county: [{ required: true, type: "number", min: 1, message: "请选择企业所在区域", trigger: "change" },],
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { type: "method", validator: (rule, value, callback, source, options)=>{
            if(value.replace(/[^\x00-\xff]/g, "aa").length > 100){
              callback(["error"]);
              return;
            }
            callback([]);
          }, message: "详细地址长度过长", trigger: "blur" },
        ],
        zipCode: [
          { required: true, message: "请输入邮政编码", trigger: "blur" },
          { type: "pattern", pattern: /^\d{6}$/, message: "邮政编码格式不正确", trigger: "blur" },],
        adminName: [
          { required: true, message: "企业法人姓名不能为空", trigger: "blur" },
          { type: "method", validator: (rule, value, callback, source, options)=>{
            if(value.replace(/[^\x00-\xff]/g, "aa").length > 100){
              callback(["error"]);
              return;
            }
            callback([]);
          }, message: "企业法人姓名长度过长", trigger: "blur" },
        ],
        adminPhone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          { type: "pattern", pattern: /^\d{11,12}$/, message: "联系方式格式不正确", trigger: "blur" },],
        businessScope: [
          { required: true, message: "经营范围不能为空", trigger: "blur" },
          { type: "method", validator: (rule, value, callback, source, options)=>{
            if(value.replace(/[^\x00-\xff]/g, "aa").length > 280){
              callback(["error"]);
              return;
            }
            callback([]);
          }, message: "经营范围长度过长", trigger: "blur" },],
      },
    };
  },
  methods: {
    next() {
      
      this.$refs["formregister"].validate(valid => {

        if (valid) {
          
          this.$store.registerModel.name = this.data.name;
          this.$store.registerModel.nature = this.data.nature;
          this.$store.registerModel.province = this.data.province;
          this.$store.registerModel.city = this.data.city;
          this.$store.registerModel.county = this.data.county;
          this.$store.registerModel.detail = this.data.detail;
          this.$store.registerModel.zipCode = this.data.zipCode;
          this.$store.registerModel.adminName = this.data.adminName;
          this.$store.registerModel.adminPhone = this.data.adminPhone;
          this.$store.registerModel.businessScope = this.data.businessScope;
          
          window.sessionStorage.setItem("registerModel", JSON.stringify(this.$store.registerModel));
          this.$router.push("/account/register3");
          
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    },
    pre(){
      
      this.$router.push("/account/register1");
    },
    loadData(){

      this.data.name = this.$store.registerModel.name ; 
      this.data.nature = this.$store.registerModel.nature + "" ; 
      this.data.province = this.$store.registerModel.province;
      this.data.city = this.$store.registerModel.city ;
      this.data.county = this.$store.registerModel.county ;
      this.data.detail = this.$store.registerModel.detail ;
      this.data.zipCode = this.$store.registerModel.zipCode ; 
      this.data.adminName = this.$store.registerModel.adminName ; 
      this.data.adminPhone = this.$store.registerModel.adminPhone ; 
      this.data.businessScope = this.$store.registerModel.businessScope ; 
      
    },
  },

  computed:{
    province(){
      return this.data.province;
    },
    city(){
      return this.data.city;
    },
    county(){
      return this.data.county;
    },
  },
  watch:{
    province(value){
      this.$service.post("/PlantOpenTender/areaBidService/GetAllCitybyProvince", {provinceId:value}).then(res=>{
        
        this.cityList = res.result;
        this.cityList.splice(0,0,{key:-1, value: "请选择"});
        this.data.city = this.cityListLoadedOnce ? this.data.city : -1;
        this.cityListLoadedOnce = false;
      });
    },
    city(value){
      this.$service.post("/PlantOpenTender/areaBidService/GetAllCountrybyCity", {CityId: value}).then(res=>{
        
        this.countyList = res.result;
        this.countyList.splice(0,0,{key:-1, value: "请选择"});
        this.data.county = this.countyListLoadedOnce ? this.data.county : -1;
        this.countyListLoadedOnce = false;
      });
    },
  },
  mounted(){

    this.$service.post("/PlantOpenTender/dictionaryService/GetOptions", {type: 1, code: encodeURIComponent("企业性质")}).then(res=>{
      
      this.natureList = res.result;
      this.natureList.splice(0,0,{key:"-1", value: "请选择"});
    });

    this.$service.post("/PlantOpenTender/areaBidService/GetAllProvince", {}).then(res=>{
      
      this.provinceList = res.result;
      this.provinceList.splice(0,0,{key:-1, value: "请选择"});
      this.data.province = this.provinceListLoadedOnce ? this.data.province : -1;
        this.provinceListLoadedOnce = false;
    });
    
    if(this.$route.query.id){
      this.$service.post("/PlantOpenTender/companyService/GetCompanyById",{ id:this.$route.query.id }).then(res=>{
          
          this.$store.registerModel = res.result;
          this.$store.oldNameStorage = res.result.name;//为了规避企业重新认证时公司名称重复问题
          this.loadData();
      });
      
      return;
    }

    this.$store.registerModel = JSON.parse(window.sessionStorage.getItem("registerModel"));

    this.loadData();

  },
};
</script>
