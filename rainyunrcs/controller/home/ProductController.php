<?php
namespace server\rainyunrcs\controller\home;

use app\event\controller\BaseController;
use server\rainyunrcs\model\ProductModel;

class ProductController extends BaseController
{

    public function getProductInfo()
    {
        $ProductModel = new ProductModel();
        $param = $this->request->param();
        $product = $ProductModel->getProductInfo($param['product_id']);
        return json($product);
    }
    public function getIpTypeMap()
    {
        $ProductModel = new ProductModel();
        $param = $this->request->param();
        $product = $ProductModel->getProductInfo($param['product_id']);
        if($product['code'] != 200){
            return json([
                'code' => 400,
                'msg' => '获取产品信息失败'
            ]);
        }
        $productInfo = $product['data'] ?? [];
        $region = $productInfo['region'] ?? '';
        $ipTypeMap = [
            "cn-wz1"=>[
                ""=>"100G 温州电信高防",
                "wz_cmip"=>"100G 温州移动高防",
            ],
            "cn-sx1"=>[
                ""=>"50G 绍兴电信普防",
                "sx_bgpip"=>"100G 绍兴BGP高防",
            ],
            "cn-nb1"=>[
                "ipv6"=>"宁波 IPv6",
                ""=>"100G 宁波电信普防",
                "nb_bgpip"=>"10G 宁波BGP三线普防",
                "nb_ddosip"=>"100G 宁波精品高防(封UDP)",
                "nb_cmip"=>"20G 宁波移动普防",
                "nb_cuip"=>"100G 宁波联通高防",
                "nb_cntcpip"=>"100G 宁波极品高防(封UDP+海外)",
                "nb_cmddosip"=>"400G 联通移动精品高防",
                "nb_ddosip200"=>"200G 宁波电信高防(需定制)",
                "nb_ddosip300"=>"300G 宁波电信高防(需定制)",
                "nb_ddosip400"=>"400G 宁波电信高防(需定制)"
            ],
            "cn-sz1"=>[
                ""=>"20G 深圳防御",
                "sz_txip"=>"腾讯多线BGP"
            ],
            "cn-xy1"=>[
                ""=>"200G 襄阳电信防御"
            ],
            "cn-sy1"=>[
                "ipv6"=>"十堰 IPv6",
                ""=>"200G 十堰电信防御",
                "sy_bgpip"=>"200G 十堰BGP普防"
            ],
            "cn-sq1"=>[
                ""=>"150G 京东云防御"
            ],
            "cn-cq1"=>[
                ""=>"20G 电信防御"
            ],
            "jp-tk1"=>[
                ""=>"普通IP (未附加防御)",
                "jp_ddosip"=>"300G+ 日本软银高防(封UDP)"
            ],
            "us-la2"=>[
                ""=>"普通IP (未附加防御)",
                "home_ip"=>"家庭IP(外贸专用，支持TikTok/GPT)",
                "us_ddosip"=>"300G+ 美国高防(+UDP拦截)"
            ],
            "us-la1"=>[
                ""=>"普通IP (未附加防御)"
            ],
            "cn-hk1"=>[
                ""=>"普通IP (未附加防御)",
                "hk_ddosip"=>"300G+ 香港高防(封UDP)"
            ]
        ];
        return json([
            'code' => 200,
            'data' => $ipTypeMap[$region] ?? []
        ]);
    }
    public function getZoneList()
    {
        $ProductModel = new ProductModel();
        $param = $this->request->param();
        $Zone = $ProductModel->getZones($param['product_id']);
        if($Zone['code'] != 200){
            return json([
                'code' => 400,
                'msg' => '获取网区列表失败'
            ]);
        }
        return json([
            'code' => 200,
            'data' => $Zone['data'] ?? []
        ]);
    }
    public function getOsTemplates()
    {
        $ProductModel = new ProductModel();
        $OsTemplates = $ProductModel->getOsTemplates();
        if($OsTemplates['code'] != 200){
            return json([
                'code' => 400,
                'msg' => '获取操作系统模板列表失败'
            ]);
        }
        return json([
            'code' => 200,
            'data' => $OsTemplates['data'] ?? []
        ]);
    }

}
