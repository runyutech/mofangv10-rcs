const template = document.getElementsByClassName("product_config")[0];
Vue.prototype.lang = Object.assign(window.lang, window.module_lang);
new Vue({
  components: {
    comConfig,
  },
  data() {
    return {
      id: "",
      submitLoading: false,
      formData: {
        pid: "",
        price_rate: "100",
      },
      formRules: {
        pid: [
          { required: true, message: lang.pid_tip, type: "error" },
          {
            pattern: /^\d+$/,
            message: lang.verify_int,
            type: "warning",
          },
          {
            validator: (val) => val >= 1 && val <= 999999,
            message: lang.verify_int_range,
            type: "warning",
          },
        ],
        price_rate: [
          { required: true, message: lang.price_rate_tip, type: "error" },
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: lang.verify_decimal,
            type: "warning",
          },
          {
            validator: (val) => val >= 0 && val <= 1000,
            message: lang.price_rate_range,
            type: "warning",
          },
        ],
      },
    };
  },
  created() {
    this.id = location.href.split("?")[1].split("=")[1];
    // 可在此处加载已有配置
    this.getConfig();
  },
  methods: {
    async getConfig() {
      try {
        const res = await getProductConfig(this.id);
        if (res.data.status === 200) {
          this.formData.pid = res.data.data.pid || "";
          this.formData.price_rate = res.data.data.price_rate || "100";
        }
      } catch (error) {
        console.log(error);
      }
    },
    async submitForm({ validateResult, firstError }) {
      if (validateResult === true) {
        try {
          const params = {
            pid: parseInt(this.formData.pid),
            product_id: parseInt(this.id),
            price_rate: parseFloat(this.formData.price_rate),
          };
          this.submitLoading = true;
          const res = await saveProductConfig(params);
          this.$message.success(res.data.msg || lang.save_success);
          this.submitLoading = false;
        } catch (error) {
          this.submitLoading = false;
          this.$message.error(error.data.msg || lang.save_failed);
        }
      } else {
        console.log("Errors: ", validateResult);
        this.$message.warning(firstError);
      }
    },
  },
}).$mount(template);