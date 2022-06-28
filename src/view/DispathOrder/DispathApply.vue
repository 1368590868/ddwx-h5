<template>
  <div class="apply-container container">
    <div class="wrapper">
      <van-form
        class="form-scroll"
        validate-first
        @failed="onFailed"
        @submit="onSubmit"
      >
        <div class="form-warpper">
          <div class="form-block">
            <div class="block-label"><i class="font_family icon-icon-location-20"></i><span>出发地：</span></div>
            <van-field
              required
              v-model="formData.fromAddr"
              readonly
              right-icon="arrow-down"
              clickable
              name="fromAddr"
              label="省/市/区："
              placeholder="点击选择省市区"
              @click="showsFormArea=true"
            />
            <van-popup
              v-model="showsFormArea"
              position="bottom"
            >
              <van-cascader
                v-model="formData.fromAddrActive"
                title="请选择所在地区"
                :options="provinceOptions"
                :field-names="fieldNames"
                @close="showsFormArea = false"
                @change="onFromChange"
                @finish="onFromFinish"
              />
            </van-popup>
            <van-field
              required
              v-model="formData.fromAddrDetail"
              name="fromAddrDetail"
              label="详细地址："
              maxlength="50"
              placeholder="请输入详细地址"
              :rules="[{ required: true}]"
            />
            <div
              class="defatul-button"
              @click="handleDefaultClick('1')"
            >
              <i class="icon-default-address"></i>
              <span>常用出发地址</span>
            </div>
          </div>

          <div class="form-block">
            <div class="block-label"><i class="icon font_family icon-icon-destination-20"></i><span>目的地：</span></div>
            <van-field
              required
              v-model="formData.toAddr"
              readonly
              right-icon="arrow-down"
              clickable
              name="toAddr"
              label="省/市/区："
              placeholder="点击选择省市区"
              @click="showsTargetArea=true"
            />
            <van-popup
              v-model="showsTargetArea"
              position="bottom"
            >
              <van-cascader
                v-model="formData.targetAddrActive"
                title="请选择所在地区"
                :options="provinceOptions"
                :field-names="fieldNames"
                @close="showsTargetArea = false"
                @change="onTargetChange"
                @finish="onTargetFinish"
              />
            </van-popup>
            <van-field
              required
              v-model="formData.toAddrDetail"
              name="toAddrDetail"
              label="详细地址："
              maxlength="50"
              placeholder="请输入详细地址"
              :rules="[{ required: true}]"
            />
            <div
              class="defatul-button"
              @click="handleDefaultClick('2')"
            >
              <i class="icon-default-address"></i>
              <span>常用目的地址</span>
            </div>
          </div>
          <div class="form-block">
            <div class="block-label"><i class="icon font_family icon-icon-date-20"></i><span>出发时间：</span></div>
            <van-field
              required
              v-model="formData.usageDate"
              readonly
              clickable
              name="usageDate"
              label="出发日期："
              placeholder="请选择出发日期"
              @click="showsTimeArea = true"
            />
            <van-calendar
              v-model="showsTimeArea"
              :min-date="new Date()"
              @confirm="TimeAreaConfirm"
            ></van-calendar>

            <van-field
              required
              v-model="formData.usageTime"
              readonly
              right-icon="arrow-down"
              clickable
              name="usageTime"
              label="出发时间："
              @click="showsTimeDetail=true;selectMinTime()"
              placeholder="请选择出发时间"
              :rules="[{ required: true, message: '请选择出发时间' }]"
            />
            <van-popup
              v-model="showsTimeDetail"
              position="bottom"
            >
              <van-datetime-picker
                v-model="formData.usageTime"
                @change="selectMinTime"
                :min-hour="minHour"
                :min-minute="minMinute"
                type="time"
                @confirm="TimeDetailConfirm"
                @cancel="showsTimeDetail=false"
              ></van-datetime-picker>
            </van-popup>
          </div>
        </div>

        <div class="form-button">
          <van-button
            block
            type="info"
            native-type="submit"
          >下一步</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import { gcywVehicleRequestDispatchList } from '@/api/order';
import { commonAddressListAll, gcjcDivisionList } from "@/api/mine/commonAddress"
import eventBus from '@/utils/eventBus.js'
import keepPages from '@/view/mixins/keepPages'

export default {
  name: 'DispathApply',
  computed: mapGetters('DispathOrder', ['CarOneHist']),
  mixins: [keepPages],
  data() {
    let nowDate = new Date();
    return {
      id: '',
      minMinute: 0,   // 最小时间
      minHour: 0,
      formData: {
        fromAddrActive: '',  // 
        targetAddrActive: '',// 

        fromAddrDetail: '',      // 出发地详细地址 ,
        toAddrDetail: '',    // 目的地详细地址
        usageTime: parseTime(nowDate, '{h}:{i}'), // 发出时间 {h}:{i}

        fromAddr: '',      // (string, optional): 出发地 ,
        toAddr: '',    // (string, optional): 目的地
        usageDate: parseTime(nowDate, '{y}-{m}-{d}'), // (string, optional): 出发时刻 ,

        fromProvinceId: "",//出发地省份ID
        fromCityId: "",  //出发地城市id
        fromAreaId: "",  //出发地区县id

        targetProvinceId: "",//目的地省份ID
        targetCityId: "",  //目的地城市id
        targetAreaId: "",  //目的地区县id
      },
      showsFormArea: false,  // 打开出发地弹窗
      showsTargetArea: false,  // 打开目的地弹窗
      showsTimeArea: false, // 打开出发日期
      showsTimeDetail: false, // 打开出发时间

      //省级数据
      provinceOptions: [],
      //市级数据
      cityOptions: [],
      //区级数据
      areaOptions: [],
      //定义字段省市区取值字段名称
      fieldNames: {
        text: 'divisionName',
        value: 'divisionId',
        children: 'children',
      },
    }
  },
  created() {
    let id = this.$route.params.id;
    this.getProvinceOptions(0);
    this.getDefaultAddress();
    if (id != '0') {
      this.orderGetOrderDetail(id);
    }
  },

  activated() {
    // 选择常用地址回调
    eventBus.$off('defaultAddress');
    eventBus.$on('defaultAddress', function(item) {
      this.setFromAndTargetAddress(item);
    }.bind(this));
  },
  methods: {
    //获取出发地和目的地默认地址
    async getDefaultAddress() {
      await commonAddressListAll({ defualtTag: "1" }).then(({ data }) => {
        data.forEach((item) => {
          this.setFromAndTargetAddress(item);
        })
      }).catch((err) => {

      })
    },
    //获取省级数据
    async getProvinceOptions(pid) {
      await gcjcDivisionList({ pid }).then(({ data }) => {
        this.provinceOptions = data.list;
      }).catch((err) => {

      })
    },
    //获取市级数据
    async getCityOptions(pid, type) {
      await gcjcDivisionList({ pid }).then(({ data }) => {
        this.cityOptions = data.list;
        this.provinceOptions.forEach((item) => {
          if (type === 'from') {
            if (item.divisionId === this.formData.fromProvinceId) {
              this.$set(item, 'children', this.cityOptions);
            }
          } else {
            if (item.divisionId === this.formData.targetProvinceId) {
              this.$set(item, 'children', this.cityOptions);
            }
          }
        })
      }).catch((err) => {

      })
    },
    //获取区级数据
    async getAreaOptions(pid, type) {
      await gcjcDivisionList({ pid }).then(({ data }) => {
        this.areaOptions = data.list;
        let province = this.provinceOptions.find((item) => {
          if (type === 'from') {
            return item.divisionId === this.formData.fromProvinceId;
          } else {
            return item.divisionId === this.formData.targetProvinceId;
          }
        })
        province.children.forEach((item) => {
          if (type === 'from') {
            if (item.divisionId === this.formData.fromCityId) {
              this.$set(item, 'children', this.areaOptions);
            }
          } else {
            if (item.divisionId === this.formData.targetCityId) {
              this.$set(item, 'children', this.areaOptions);
            }
          }
        })
      }).catch((err) => {

      })
    },
    selectMinTime() {
      let hour = this.formData.usageTime.split(':')[0];
      let nowDate = new Date(),
        nowHour = nowDate.getHours();
      if (new Date(this.formData.usageDate).getTime() > nowDate.getTime()) {
        this.minMinute = 0;
        this.minHour = 0;
        return 0;
      }
      this.minHour = nowDate.getHours();
      this.minMinute = (hour == nowHour) ? nowDate.getMinutes() : 0;
    },
    onFailed(errInfo) {
    },

    TimeAreaConfirm(value) {   // 出发日期
      this.formData.usageDate = parseTime(value, '{y}-{m}-{d}');
      this.showsTimeArea = false;
      this.selectMinTime();
      this.formData.usageTime = "";    // 重新选择日期
    },
    TimeDetailConfirm(value) { // 出发时间 {h}:{i}
      this.formData.usageTime = value;  // 10:10
      this.showsTimeDetail = false;
    },
    onSubmit() {
      // let id = this.$route.params.id;
      this.$store.dispatch('DispathOrder/setOneDataAction', this.formData).then(() => {   // 存储开始订单的数据，以防止回退
        const params = this.$route.params;
        this.$router.push({ name: 'DispathPerfect', params })
        // if (id != '0') {
        //   this.$router.push({ name: 'DispathPerfect', params: { id, type: '2' } });  // 待派车复制订单
        // } else {
        //   this.$router.push({ name: 'DispathPerfect', params: { id: '0', type: '0' } });  // 新增
        // }
      });
    },
    // 复制订单操作！
    orderGetOrderDetail(id) {
      gcywVehicleRequestDispatchList({ id }).then(({ data }) => {
        let obj = data?.list[0] || {};

        this.formData.fromAddrActive = obj?.fromAreaId.split(',')[2] || '';
        this.formData.targetAddrActive = obj?.toAreaIdd.split(',')[2] || '';

        this.formData.fromAddrDetail = obj.fromAddr.split(' ')[1] || '';
        this.formData.toAddrDetail = obj.toAddr.split(' ')[1] || '';
        this.formData.usageDate = parseTime(Date.now(), '{y}-{m}-{d}');

        this.formData.fromAddr = obj.fromAddr.split(' ')[0] || '';
        this.formData.toAddr = obj.toAddr.split(' ')[0] || '';
        this.formData.usageTime = parseTime(Date.now() + 1000 * 60 * 60, '{h}:{i}');

        this.formData.fromProvinceId = obj.fromAreaId.split(',')[0] || '';
        this.formData.fromCityId = obj.fromAreaId.split(',')[1] || '';
        this.formData.fromAreaId = obj.fromAreaId.split(',')[2] || '';

        this.formData.targetProvinceId = obj.toAreaIdd.split(',')[0] || '';
        this.formData.targetCityId = obj.toAreaIdd.split(',')[1] || '';
        this.formData.targetAreaId = obj.toAreaIdd.split(',')[2] || '';
        this.$store.dispatch('DispathOrder/setCopyDataAction', obj);
      });
    },//出发地省市区选择监听
    onFromChange({ value, selectedOptions, tabIndex }) {
      if (tabIndex === 0) {
        this.getCityOptions(value, 'from');
        this.formData.fromProvinceId = value;
      } else if (tabIndex === 1) {
        this.getAreaOptions(value, 'from');
        this.formData.fromCityId = value;
      } else if (tabIndex === 2) {
        this.formData.fromAreaId = value;
      }
    },
    // 出发地全部选项选择完毕后
    onFromFinish({ value, selectedOptions, tabIndex }) {
      if (tabIndex === 2) {
        this.showsFormArea = false;
        this.formData.fromAddr = selectedOptions.map((option) => option.divisionName).join('/');
      }
    },
    //目的地省市区选择监听
    onTargetChange({ value, selectedOptions, tabIndex }) {
      if (tabIndex === 0) {
        this.getCityOptions(value, 'target');
        this.formData.targetProvinceId = value;
      } else if (tabIndex === 1) {
        this.getAreaOptions(value, 'target');
        this.formData.targetCityId = value;
      } else if (tabIndex === 2) {
        this.formData.targetAreaId = value;
      }
    },
    //目的地全部选项选择完毕后
    onTargetFinish({ value, selectedOptions, tabIndex }) {
      if (tabIndex === 2) {
        this.showsTargetArea = false;
        this.formData.toAddr = selectedOptions.map((option) => option.divisionName).join('/');
      }
    },
    //出发地和目的地地址设置
    setFromAndTargetAddress(item) {
      console.log("🚀 ~ file: DispathApply.vue ~ line 397 ~ setFromAndTargetAddress ~ item", item)
      if (item.addressType === "1") {
        this.formData.fromAddr = item.areaLongName;
        this.formData.fromAddrDetail = item.address;
        this.formData.fromAddrActive = item.areaId
        this.formData.fromProvinceId = item.provinceId;
        this.formData.fromCityId = item.cityId;
        this.formData.fromAreaId = item.areaId
      } else if (item.addressType === "2") {
        this.formData.toAddr = item.areaLongName;
        this.formData.toAddrDetail = item.address;
        this.formData.targetAddrActive = item.areaId
        this.formData.targetProvinceId = item.provinceId;
        this.formData.targetCityId = item.cityId;
        this.formData.targetAreaId = item.areaId
      }
    },
    //常用地址点击
    handleDefaultClick(addressType) {
      this.$router.push({
        name: 'DefaultAddress',
        params: {
          addressType
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.defatul-button {
  font-size: 14px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  margin: 10px 20px 10px 20px;
  line-height: 30px;
  border: 0.5px solid #cccccc;
  border-radius: 50px;
}
</style>