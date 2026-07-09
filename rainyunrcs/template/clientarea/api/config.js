// RainyunRCS 产品详情
function getCommonListDetail(id) {
  return Axios.get(`/rainyunrcs/host/${id}/configoption`);
}
function getDetail(id) {
  return getCommonListDetail(id);
}
// 通用详情（主机基本信息、备注、自定义字段等）
function getCommonDetail(id) {
  return Axios.get(`/host/${id}`);
}
// 修改产品备注
function changeNotes(params) {
  return Axios.put(`/host/${params.id}/notes`, params);
}
// 产品内页获取优惠码信息
function getPromoCode(id) {
  return Axios.get(`/promo_code/host/${id}/promo_code`);
}
// 获取自动续费状态
function renewStatus(params) {
  return Axios.get(`/host/${params.id}/renew/auto`, { params });
}
// 自动续费开关
function rennewAuto(params) {
  return Axios.put(`/host/${params.id}/renew/auto`, params);
}

/* 升降级 */
// 产品升降级页面
function upgradePage(host_id) {
  return Axios.get(`/rainyunrcs/host/${host_id}/upgrade`);
}
// 购买应用升降级页面
function upAppPage(host_id) {
  return Axios.get(`/zjmfapp/host/${host_id}/upgrade`);
}
// 购买应用配置升降级页面
function upgradeAppPage(host_id) {
  return Axios.get(`/zjmfapp/host/${host_id}/upgrade_config`);
}
// 产品配置升降级页面
function upgradeConfigPage(host_id) {
  return Axios.get(`/rainyunrcs/host/${host_id}/upgrade_config`);
}
// 产品升降级异步获取升降级价格
function upgradePrice(id, params) {
  return Axios.post(`/rainyunrcs/host/${id}/sync_upgrade_price`, params);
}
// 购买应用升降级异步获取升降级价格
function upAppPrice(id, params) {
  return Axios.post(`/zjmfapp/host/${id}/sync_upgrade_price`, params);
}
// 修改配置重新计算周期价格
function calculate(params) {
  return Axios.post(`/rainyunrcs/product/${params.id}/configoption/calculate`, params);
}
// 购物车场景重新计算周期价格
function buyCalculate(params) {
  return Axios.post(`/rainyunrcs/product/${params.id}/configoption/calculate`, params);
}
// 产品配置升降级异步获取升降级价格
function syncUpgradePrice(id, params) {
  return Axios.post(`/rainyunrcs/host/${id}/sync_upgrade_config_price`, params);
}
// 购买应用配置升降级异步获取升降级价格
function syncAppPrice(id, params) {
  return Axios.post(`/zjmfapp/host/${id}/sync_upgrade_config_price`, params);
}
// 产品升降级
function upgradeHost(id, params) {
  return Axios.post(`/rainyunrcs/host/${id}/upgrade`, params);
}
// 购买应用升降级
function upAppHost(id, params) {
  return Axios.post(`/zjmfapp/host/${id}/upgrade`, params);
}
// 产品配置升降级
function upgradeConfigHost(host_id, params) {
  return Axios.post(`/rainyunrcs/host/${host_id}/upgrade_config`, params);
}
// 购买应用配置升降级
function upgradeAppHost(id, params) {
  return Axios.post(`/zjmfapp/host/${id}/upgrade_config`, params);
}

// 产品合同是否逾期
function timeoutStatus(id) {
  return Axios.get(`/e_contract/host/${id}/timeout`);
}

// 前台产品内页图表页面
function chartList(params) {
  return Axios.post(`/rainyunrcs/host/${params.id}/configoption/chart`, params);
}

// 执行子模块方法
function provision(params) {
  return Axios.post(`/rainyunrcs/host/${params.id}/provision/${params.func}`, params);
}
// 前台产品内页自定义页面输出
function configArea(params) {
  return Axios.get(`/rainyunrcs/host/${params.id}/configoption/area`, {
    params,
  });
}

// 获取操作系统模板列表
function getOsTemplates(id) {
  return Axios.get(`/rainyunrcs/product/${id}/os_templates`);
}

// 应用优惠码
function applyPromoCode(params) {
  return Axios.post(`/promo_code/apply`, params);
}

// 通用接口
function getCountry() {
  return Axios.get(`/country`);
}
function account() {
  return Axios.get(`/account`);
}
function gatewayList() {
  return Axios.get(`/gateway`);
}
function pay(params) {
  return Axios.post(`/pay`, params);
}
function getPayStatus(id) {
  return Axios.get(`/pay/${id}/status`);
}
function creditPay(params) {
  return Axios.post(`/credit`, params);
}
function orderDetails(id) {
  return Axios.get(`/order/${id}`);
}
function calcPrice(params) {
  return Axios.post(`/product/${params.id}/config_option`, params);
}
function settle(params) {
  return Axios.post(`/product/settle`, params);
}
function addToCart(params) {
  return Axios.post(`/cart`, params);
}
function updateCart(params) {
  return Axios.put(`/cart/${params.position}`, params);
}
function getCart() {
  return Axios.get('/cart');
}

/* 退款 */
function getRefundInfo(id) {
  return Axios.get(`/refund/host/${id}/refund`);
}
function getRefund(host_id) {
  return Axios.get(`/refund?host_id=${host_id}`);
}
function submitRefund(params) {
  return Axios.post(`/refund`, params);
}
function cancelRefund(params) {
  return Axios.put(`/refund/${params.id}/cancel`, params);
}

// 获取等级商品折扣金额
function clientLevelAmount(params) {
  return Axios.get(`/client_level/product/${params.id}/amount`, { params });
}
