(function () {
  const module_lang = {
    "zh-cn": {
      product_id: "产品ID",
      product_id_tip: "请输入有效的产品ID",
      price_rate: "价格倍率",
      price_rate_tip: "0-1000，支持两位小数",
      verify_int: "请输入正确的产品ID",
      verify_int_range: "产品ID范围为1-999999",
      verify_decimal: "请输入正确的价格倍率",
      price_rate_range: "价格倍率范围为0-1000",
      save_success: "保存成功",
      save_failed: "保存失败",
    },
    "zh-hk": {

    },
    "en-us": {

    },
  };
  const DEFAULT_LANG = localStorage.getItem("backLang") || "zh-cn";
  window.module_lang = module_lang[DEFAULT_LANG];
})();
