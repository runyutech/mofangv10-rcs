const base = "rainyunrcs";

function getProductConfig(product_id) {
  return Axios.get(`/${base}/product_config/${product_id}`);
}

function saveProductConfig(params) {
  return Axios.post(`/${base}/product_config`, params);
}