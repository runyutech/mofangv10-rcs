<?php
namespace server\rainyunrcs\controller\admin;

use app\event\controller\BaseController;
use server\rainyunrcs\model\ProductConfigModel;
use server\rainyunrcs\validate\ProductConfigValidate;

class ProductConfigController extends BaseController
{
    public $validate;
    
    # 初始验证
    public function initialize()
    {
        parent::initialize();

        $this->validate = new ProductConfigValidate();

        $param = $this->request->param();
    }


    public function getConfig()
    {
        $param = $this->request->param();

        $ProductConfigModel = new ProductConfigModel();

        $result = $ProductConfigModel->getConfig($param);

        return json($result);
    }

    public function saveConfig()
    {
        $param = $this->request->param();

        // 参数验证
        if (!$this->validate->scene('save')->check($param)){
            return json(['status' => 400 , 'msg' => lang_plugins($this->validate->getError())]);
        }

        $ProductConfigModel = new ProductConfigModel();

        $result = $ProductConfigModel->saveConfig($param);

        return json($result);
    }
}