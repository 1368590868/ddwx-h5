<template>
  <div class="apply-container container">
    <!-- <div class="wrapper"> -->
    <van-form
      class="form-scroll"
      validate-first
      @failed="onFailed"
      @submit="onSubmit"
    >
      <ul class="info-box">
        <li class="info-label">
          <i class="font_family icon-icon-location-20"></i>
          <span>出发地：</span><span class="info-address">{{CarOneData.fromAddr}}</span>
        </li>
        <li class="info-label">
          <i class="icon font_family icon-icon-destination-20"></i>
          <span>目的地：</span><span class="info-address">{{CarOneData.toAddr}}</span>
        </li>
        <li class="info-label">
          <i class="icon font_family icon-icon-date-20"></i>
          <span>时间：<i></i></span><span>{{CarOneData.usageDate}}{{CarOneData.usageTime}}</span>
        </li>
      </ul>
      <div class="form-warpper">
        <van-field
          required
          label="用车单位"
          v-model="formData.unitName"
          readonly
          clickable
          name="unit-picker"
          right-icon="arrow"
          :rules="[{ required: true }]"
          placeholder="点击选择单位"
          @click="showUnitPicker=true"
        ></van-field>
        <van-field
          required
          label="用车部门"
          v-model="formData.deptName"
          readonly
          clickable
          name="dept-picker"
          right-icon="arrow"
          :rules="[{ required: true }]"
          placeholder="点击选择部门"
          @click="showDeptPicker=true"
        ></van-field>
        <van-field
          label="用车事由："
          required
          center
          v-model="formData.reasonName"
          name="reasonName"
          readonly
          right-icon="arrow-down"
          clickable
          :rules="[{ required: true }]"
          placeholder="点击选择用车事由"
          @click="reasonNameShowPicker=true"
        />
        <van-popup
          v-model="reasonNameShowPicker"
          position="bottom"
        >
          <van-picker
            show-toolbar
            value-key="name"
            :default-index="reasonActiveIndex"
            name="reasonCode"
            :columns="dictData['reasonNameDict']"
            @confirm="reasonConfirm"
            @cancel="reasonNameShowPicker=false"
          />
        </van-popup>

        <van-field
          label="用车需求："
          required
          center
          v-model="formData.demandName"
          name="demandName"
          readonly
          right-icon="arrow-down"
          clickable
          :rules="[{ required: true }]"
          placeholder="点击选择用车需求"
          @click="demandNameShowPicker=true"
        />
        <van-popup
          v-model="demandNameShowPicker"
          position="bottom"
        >
          <van-picker
            show-toolbar
            value-key="name"
            :default-index="demandNameActiveIndex"
            :columns="dictData['demandNameDict']"
            @confirm="demandNameConfirm"
            @cancel="demandNameShowPicker=false"
          />
        </van-popup>

        <van-field
          label="用车时长："
          required
          center
          v-model="formData.timeLength"
          name="timeLength"
          type="digit"
          placeholder="请输入用车时长"
          :rules="[{ required: true}]"
        >
          <template #extra><span>小时</span></template>
        </van-field>

        <van-field
          label="是否长途："
          required
          center
          name="radio"
        >
          <template #input>
            <van-radio-group
              v-model="formData.longDistanceTag"
              direction="horizontal"
            >
              <van-radio :name="1">是</van-radio>
              <van-radio :name="0">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          label="乘车人："
          required
          center
          v-model="formData.userName"
          name="userName"
          placeholder="请输入乘车人"
          :rules="[{ required: true }]"
        />
        <van-field
          label="联系电话："
          required
          center
          v-model="formData.phone"
          name="phone"
          type="tel"
          placeholder="请输入联系电话"
          :rules="[{ required: true }, {pattern, message: '联系电话输入错误!'}]"
        />
        <van-field
          label="期望车型："
          required
          center
          v-model="formData.hopeBrandName"
          name="hopeBrand"
          readonly
          right-icon="arrow-down"
          clickable
          :rules="[{ required: true}]"
          placeholder="点击选择期望车型"
          @click="hopeBrandPicker=true"
        />
        <van-popup
          v-model="hopeBrandPicker"
          position="bottom"
        >
          <van-picker
            show-toolbar
            value-key="name"
            :default-index="sHopeCartyActiveIndex"
            :columns="dictData['hopeBrandDict']"
            @confirm="sHopeCartyConfirm"
            @cancel="hopeBrandPicker=false"
          />
        </van-popup>

        <van-field
          label="乘坐人数："
          required
          center
          v-model="formData.usagePersons"
          name="usagePersons"
          type="digit"
          placeholder="请输入乘坐人数"
          :rules="[{ required: true}]"
        >
          <template #extra><span>人</span></template>
        </van-field>
        <van-field
          class="form-textarea"
          v-model="formData.remark"
          name="remark"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入备注"
          show-word-limit
        />
      </div>
      <div class="button-box">
        <van-button
          block
          type="default"
          @click="returnArtificials"
        >上一步</van-button>
        <van-button
          block
          type="info"
          native-type="submit"
        >选择车辆</van-button>
      </div>
    </van-form>
    <van-popup
      v-model="showUnitPicker"
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="unitData"
        @cancel="showUnitPicker=false"
        value-key="unitName"
        @confirm="onUnitConfirm"
      >
      </van-picker>
    </van-popup>
    <van-popup
      v-model="showDeptPicker"
      position="bottom"
    >
      <van-cascader
        v-model="cascaderValue"
        title="请选部门"
        :field-names="fieldNames"
        :options="deptData"
        @close="showDeptPicker = false"
        @finish="onDeptConfirm"
      />
      <!-- <van-picker
        show-toolbar
        :columns="deptData"
        @cancel="showDeptPicker=false"
        value-key="deptName"
        @confirm="onDeptConfirm"
      >
      </van-picker> -->
    </van-popup>
    <!-- </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAvailableUnit, getDispatchDept } from '@/api/dispatch'
import keepPages from '@/view/mixins/keepPages'
import getDict from "@/view/mixins/getDict"
export default {
  name: 'DispathPerfect',
  computed: {
    ...mapGetters(['userInfo']),
    ...mapGetters('DispathOrder', ['CarOneData', 'CarCopData', 'CarPerfect'])
    // CarOneData 开始页面的数据，CarCopData: 复制订单时开始页面的详情数据
  },
  mixins: [keepPages, getDict],
  data() {

    return {
      pattern: /^1[3456789]\d{9}$/,

      reasonNameShowPicker: false,   // 用车事由弹窗
      demandNameShowPicker: false,    // 用车需求弹窗
      hopeBrandPicker: false,    // 期望车型弹窗

      reasonActiveIndex: 0,      // 用车事由默认
      demandNameActiveIndex: 2,       // 用车需求默认
      sHopeCartyActiveIndex: 0,   // 期望车型默认
      unitData: [],//用车单位
      deptData: [],//用车部门
      formData: {
        reasonName: '',    // no
        reasonCode: '',    // (number, optional): 用车事由编号 ,  
        demandName: '',     // no
        demandCode: '',     // (number, optional): 用车需求编号 ,
        hopeBrandName: '',   // no,
        hopeBrand: '',   // (string)          : 期望车型编号 ,
        longDistanceTag: 0,  // (string, optional): 是否长途 Y是；N否 ,
        userName: '',     // (string, optional): 乘车人 ,  // 登录
        phone: '',         // (string, optional): 联系电话 ,// 登录
        usagePersons: 1,     // (integer, optional): 乘坐人数 ,
        timeLength: 2,     // (number, optional): 预计时长 ,
        remark: '',        // (string, optional): 备注 ,
        unitName: '',
        unitCode: '',
        deptId: '',
        deptName: '',
        deptCode: ''
      },
      showUnitPicker: false,
      showDeptPicker: false,
      cascaderValue: '',

      fieldNames: {
        text: 'deptName',
        value: 'id',
        children: 'children',
      },
      // 字典编号
      dictIds: {
        // 用车事由
        reasonNameDict: '1016',
        // 用车需求
        demandNameDict: '10018',
        // 期望车型I
        hopeBrandDict: '101801'
      },
      dictData: {
        reasonNameDict: [],
        demandNameDict: [],
        hopeBrandDict: [],
      },
    }
  },
  methods: {

    // 获取当前页面的通用字典下拉数据
    async handleSystemCardDict(dict = {}) {
      for (const item in dict) {
        const res = await this.getCommonDictList(dict[item]) || [];
        this.dictData[item] = res
      }
    },
    returnArtificials() {   // 返回上一步
      let id = this.$route.params.id;
      this.$router.push({
        name: 'DispathApply',
        params: { id }
      });
    },
    onFailed() { },
    reasonConfirm(values) {
      this.formData.reasonCode = values.code;
      this.formData.reasonName = values.name;
      this.reasonNameShowPicker = false;
    },
    demandNameConfirm(values) {
      this.formData.demandCode = values.code;
      this.formData.demandName = values.name;
      this.demandNameShowPicker = false;
    },
    sHopeCartyConfirm(values) {    // 期望车型
      this.formData.hopeBrand = values.code;
      this.formData.hopeBrandName = values.name;
      this.hopeBrandPicker = false;
    },

    onSubmit(values) {
      const setPerfectActionData = {
        ...this.formData,
        ...this.CarOneData
      }
      const fromAreaIdArr = setPerfectActionData?.fromAreaId?.split(',') || [];
      const cityId = fromAreaIdArr[1] || '';
      this.$store.dispatch('DispathOrder/setPerfectAction', setPerfectActionData).then(() => {
        const {
          unitCode,
          deptId,
          // reassignUnitCode,
          usageDate,
        } = this.formData;
        let type = this.$route.params.type;
        const routeParams = this.$route.params || {};
        if (type == 2) {
          this.$router.push({
            name: 'DispatchVehicle',
            params: routeParams,
            query: {
              ...this.$route.query,
              reqAssignmentsIndex: 0,
            }
          })
          return
        }
        this.$router.push({
          name: 'DispatchVehicle',
          params: routeParams,
          query: {
            reqAssignmentsIndex: 0,
            unitCode,
            deptId,
            reassignUnitCode: '',
            usageDate,
            assignUnitCode: unitCode,
            cityId,
          },
        })

      });
    },

    computedFormData(formData) {
      this.formData.unitName = formData.unitName
      this.formData.deptName = formData.deptName
      this.formData.unitCode = formData.unitCode

      //用车事由回显
      this.reasonActiveIndex = this.dictData.reasonNameDict.findIndex((item) => {
          return item.code === formData.reasonCode;
      });
      let objReason =  this.dictData.reasonNameDict.find((item) => {
          return item.code === formData.reasonCode;
      });
      this.formData.reasonName = objReason.name;
      this.formData.reasonCode = formData.reasonCode; 

      //用车需求回显
      this.demandNameActiveIndex = this.dictData.demandNameDict.findIndex((item) => {
          return item.code === formData.demandCode;
      });
      let objDemand =  this.dictData.demandNameDict.find((item) => {
          return item.code === formData.demandCode;
      });
      this.formData.demandName = objDemand.name;
      this.formData.demandCode = formData.demandCode; 

      //期望车型回显
      this.sHopeCartyActiveIndex = this.dictData.hopeBrandDict.findIndex((item) => {
          return item.code === formData.hopeBrand;
      });
      let objHope =  this.dictData.hopeBrandDict.find((item) => {
          return item.code === formData.hopeBrand;
      });
      this.formData.hopeBrandName = objHope.name;
      this.formData.hopeBrand = formData.hopeBrand; 

      this.formData.longDistanceTag = formData.longDistanceTag;  // (string, optional): 是否长途 Y是；N否 ,
      this.formData.userName = formData.userName;     // (string, optional): 乘车人 ,  // 登录
      this.formData.phone = formData.phone;         // (string, optional): 联系电话 ,// 登录
      this.formData.usagePersons = formData.usagePersons;     // (integer, optional): 乘坐人数 ,
      this.formData.timeLength = formData.timeLength; // 2,     // (number, optional): 预计时长 ,
      this.formData.remark = formData.remark;    // '',        // (string, optional): 备注 ,
    },
    // 获取单位
    getAvailableUnitList() {
      getAvailableUnit().then(({ data }) => {
        this.unitData = data
      })
    },
    // 获取部门
    getDeptByUnitList(params) {
      getDispatchDept(params).then(({ data }) => {
        this.deptData = this.dealTreeListEmptyChildren(data);
      })
    },
    // 选中单位之后 根据单位的code获取 部门
    onUnitConfirm(value) {
      this.formData.unitName = value.unitName
      this.formData.unitCode = value.unitCode
      this.getDeptByUnitList({ unitCode: value.unitCode })
      this.formData.deptId = ""
      this.formData.deptName = ""
      this.showUnitPicker = false
    },
    // 去除空数组
    dealTreeListEmptyChildren(arr = []) {
      arr.forEach(item => {
        if (!item?.children?.length) {
          delete item.children;
        } else {
          this.dealTreeListEmptyChildren(item.children)
        }
      });
      return arr;
    },
    // 选中单位之后 根据单位的code获取 部门
    onDeptConfirm({ value, selectedOptions }) {
      this.formData.deptId = value
      this.formData.deptCode = selectedOptions?.at(-1)?.deptCode || '',
        this.showDeptPicker = false
      this.assigneeShow = false;
      this.formData.deptName = selectedOptions.map((option) => option.deptName).join('/');
    },
    // 根据部门 和 单位变化 获取

  },

  async created() {
    this.getAvailableUnitList();
    const userInfo = this.userInfo;
    this.formData.userName = userInfo.name;
    this.formData.phone = userInfo.phone;


    await this.handleSystemCardDict(this.dictIds);

    let id = this.$route.params.id;
    if (!Object.keys(this.CarOneData).length) {
      this.$notify({
        type: 'warning',
        message: '请先填写用车申请基本信息!',
        onClose: () => {
          this.$router.push({ name: 'DispathApply', params: { id } });
        }
      });
    }
    if (id != '0') {
      let CarCopData = this.CarCopData;
      this.computedFormData(CarCopData);
      this.getDeptByUnitList({ unitCode: CarCopData.unitCode })
    } else {
      let CarPerfect = this.CarPerfect;
      this.formData = CarPerfect;
      this.getDeptByUnitList({ unitCode: this.formData.unitCode })
    }
  }
}
</script>