<?php
namespace server\rainyunrcs\model;

use think\Model;

class ProductConfigModel extends Model
{
    protected $name = 'rainyun_rcs_product_config';
    
    // 设置字段类型
    protected $type = [
        'pid' => 'integer',
        'product_id' => 'integer',
        'price_rate' => 'float',
    ];

    /**
     * 时间 2024-01-01
     * @title 获取产品配置
     * @param array $param
     * @return array
     */
    public function getConfig($param)
    {
        $productId = intval($param['product_id']);
        $config = $this->where('product_id', $productId)->find();
        
        if (empty($config)){
            return [
                'status' => 200,
                'msg' => lang_plugins('success_message'),
                'data' => [
                    'product_id' => $productId,
                    'pid' => '',
                    'price_rate' => '',
                ]
            ];
        }

        return [
            'status' => 200,
            'msg' => lang_plugins('success_message'),
            'data' => $config->toArray()
        ];
    }

    /**
     * 时间 2024-01-01
     * @title 获取价格倍率
     * @param int $productId
     * @return float
     */
    public function getPriceRate($productId)
    {
        $rate = $this->where('product_id', $productId)->value('price_rate');
        return $rate !== null ? (float)$rate : 0;
    }

    /**
     * 时间 2024-01-01
     * @title 保存产品配置
     * @param array $param
     * @return array
     */
    public function saveConfig($param)
    {
        $productId = intval($param['product_id']);
        $config = $this->where('product_id', $productId)->find();
        
        $data = [
            'pid' => intval($param['pid']),
            'product_id' => $productId,
            'price_rate' => floatval($param['price_rate']),
        ];

        try {
            if (empty($config)){
                // 新增
                $this->create($data);
            } else {
                // 更新
                $this->where('product_id', $productId)->update($data);
            }

            // 保存成功后，重新计算商品最低价格并更新 product 表
            try {
                $ModuleLogic = new \app\common\logic\ModuleLogic();
                $priceCycle = $ModuleLogic->getPriceCycle($productId);
                $ProductModel = new \app\common\model\ProductModel();
                $ProductModel->setPriceCycle($priceCycle['product'], $priceCycle['price'], $priceCycle['cycle']);
            } catch (\Exception $e) {
                // 价格更新失败不影响配置保存
            }

            return [
                'status' => 200,
                'msg' => lang_plugins('save_success')
            ];
        } catch (\Exception $e) {
            return [
                'status' => 400,
                'msg' => lang_plugins('save_failed') . ': ' . $e->getMessage()
            ];
        }
    }
}