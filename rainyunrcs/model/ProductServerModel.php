<?php
namespace server\rainyunrcs\model;

use think\Model;
use think\facade\Db;

/**
 * 通过商品ID获取对应接口配置的API Key
 */
class ProductServerModel extends Model
{
    /**
     * 通过商品ID获取对应接口配置的apikey(hash)
     * 
     * 查询逻辑：
     * 1. 查询idcsmart_product表，获取对应id的行
     * 2. 如果type为server，读取rel_id，查询idcsmart_server表对应id的行的hash
     * 3. 如果type为server_group，查询idcsmart_server表中server_group_id为对应rel_id的行的hash
     *
     * @param int $productId 商品ID
     * @return string|false 返回hash值(apikey)，失败返回false
     */
    public function getApiKeyByProductId($productId)
    {
        // 查询idcsmart_product表
        $product = Db::name('product')->where('id', $productId)->find();
        if (empty($product)) {
            return false;
        }

        $type = $product['type'] ?? '';
        $relId = $product['rel_id'] ?? 0;

        if (empty($type) || empty($relId)) {
            return false;
        }

        if ($type === 'server') {
            // 直接关联服务器
            $server = Db::name('server')->where('id', $relId)->find();
            if (!empty($server)) {
                return $server['hash'] ?? false;
            }
        } elseif ($type === 'server_group') {
            // 关联服务器组，取组下第一个启用的服务器
            $server = Db::name('server')
                ->where('server_group_id', $relId)
                ->where('status', 1)
                ->find();
            if (!empty($server)) {
                return $server['hash'] ?? false;
            }
        }

        return false;
    }
}
