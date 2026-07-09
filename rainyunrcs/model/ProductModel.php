<?php
namespace server\rainyunrcs\model;

use think\Model;
use server\rainyunrcs\Rainyunrcs;
use think\facade\Cache;

class ProductModel extends Model
{
    protected $name = 'rainyun_rcs_product_config';

    protected $type = [
        'pid' => 'integer',
        'product_id' => 'integer',
        'price_rate' => 'float',
    ];
    public function getRcsPid($productId)
    {
        return $this->where('product_id', $productId)->value('pid') ?? false;
    }
    public function getPlanList(){
        $cacheData = Cache::get('rainyun_rcs_plan_list');
        if ($cacheData) {
            return $cacheData;
        }

        $rainyunrcs = new Rainyunrcs();
        $header = ["Content-Type: application/json; charset=utf-8"];
        $result = $rainyunrcs->Curl("https://api.v2.rainyun.com/product/rcs/plans", ["is_rgpu"=>"false"], 30, 'GET', $header);
        if(isset($result['code']) && $result['code'] == 200){
            $data = ['code' => 200, 'data' => $result['data']];
            Cache::set('rainyun_rcs_plan_list', $data, 60);
            return $data;
        }else{
            return ['code' => 400, 'msg' => '获取套餐列表失败'];
        }
    }
    public function getProductInfo($productId)
    {
        $cacheKey = 'rainyun_rcs_product_info_' . $productId;
        $cacheData = Cache::get($cacheKey);
        if ($cacheData) {
            return $cacheData;
        }

        $productList = $this->getPlanList();
        if($productList['code'] != 200){
            return $productList;
        }
        $rcsPid = $this->getRcsPid($productId);
        foreach ($productList['data'] as $product){
            if($product['id'] == $rcsPid){
                $product['id'] = $productId; 
                $data = [
                    'code' => 200,
                    'data' => $product,
                ];
                Cache::set($cacheKey, $data, 30);
                return $data;
                break;
            }
        }
        return [
            'code' => 404,
            'msg' => '产品未找到'
        ];
    }
    public function getZones($productId) {
        $product = $this->getProductInfo($productId);
        if($product['code'] != 200){
            return [
                'code' => 400,
                'msg' => '获取产品信息失败'
            ];
        }
        $productInfo = $product['data'] ?? [];
        $region = $productInfo['region'] ?? '';
        $machine = $productInfo['machine'] ?? '';
        if($productInfo && $region && $machine){
            $rainyunrcs = new Rainyunrcs();
            $header = ["Content-Type: application/json; charset=utf-8"];
            $result = $rainyunrcs->Curl("https://api.v2.rainyun.com/product/zones", ["product"=>"rcs","region"=>$region,"machine"=>$machine], 30, 'GET', $header);
            if(isset($result['code']) && $result['code'] == 200){
                return $result;
            }else{
                return [
                    'code' => 400,
                    'msg' => '获取网区列表失败'
                ];
            }
        }else{
            return [
                'code' => 400,
                'msg' => '获取产品信息错误'
            ];
        }
    }
    public function getOsTemplates() {
        $rainyunrcs = new Rainyunrcs();
        $header = ["Content-Type: application/json; charset=utf-8"];
        $result = $rainyunrcs->Curl("https://api.v2.rainyun.com/product/rcs/os-templates", [], 30, 'GET', $header);
        if(isset($result['code']) && $result['code'] == 200){
            return $result;
        }else{
            return [
                'code' => 400,
                'msg' => '获取操作系统模板列表失败'
            ];
        }
    }
}