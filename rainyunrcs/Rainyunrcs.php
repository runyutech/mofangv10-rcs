<?php
namespace server\rainyunrcs;

use app\admin\model\PluginModel;
use think\facade\Db;
use think\facade\Cache;
use app\common\logic\ModuleLogic;

class Rainyunrcs
{
    public function metaData() {
        return ['display_name' => '云服务器', 'version' => '0.0.1'];
    }
    public function afterCreateFirstServer() {
        $sql = [
            "CREATE TABLE IF NOT EXISTS `idcsmart_rainyun_rcs_product_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '本地产品ID',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '雨云产品ID',
  `price_rate` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格倍率',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_pid` (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品配置表';"
        ];
        foreach($sql as $v){
            Db::execute($v);
        }
    }
    public function afterDeleteLastServer() {
        $sql = [
            "DROP TABLE IF EXISTS `idcsmart_rainyun_rcs_product_config`;"
        ];
        foreach($sql as $v){
            Db::execute($v);
        }
    }
    public function testConnect($param) {
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $param["server"]["hash"]];
        $url = $param["server"]["url"] . "/user/";
        $res = $this->Curl($url, null, 10, "GET", $header);
        if (isset($res["code"]) && $res["code"] == 200) {
            return ['status' => 200, 'msg' => '连接成功'];
        } else {
            return ['status' => 400, 'msg' => '连接失败'];
        }
    }
    public function clientProductConfigOption($param) {
        return ['template' => 'template/cart/goods.html', 'vars' => []];
    }
    public function hostList($params)
    {
        return ['template' => 'template/clientarea/product_list.html', 'vars' => []];
    }
    public function clientArea($params)
    {
        return ['template' => 'template/clientarea/product_detail.html', 'vars' => []];
    }
    public function serverConfigOption($params)
    {
        return ['template' => 'template/admin/config.html', 'vars' => []];
    }
    
    public function createAccount($param) {
        $hostId = $param['host']['id'];
        $productId = $param['host']['product_id'];
        $hostName = $param['host']['name'];

        // 1. 检查是否已开通 - 通过 self_defined_field_value 查找 rcsid
        $rcsid = $this->getRcsid($productId, $hostId);
        if (!empty($rcsid)) {
            return ['status' => 400, 'msg' => '已开通，不能重复开通'];
        }

        // 2. 获取订购时的配置参数
        $configOptions = json_decode($param['host']['base_config_options'] ?? '{}', true);
        if (empty($configOptions)) {
            return ['status' => 400, 'msg' => '产品配置参数错误'];
        }

        // 3. 获取 plan_id（雨云产品ID）
        $ProductModel = new \server\rainyunrcs\model\ProductModel();
        $planId = $ProductModel->getRcsPid($productId);
        if (empty($planId)) {
            return ['status' => 400, 'msg' => '产品配置不存在，请先在后台配置雨云产品ID'];
        }

        // 4. 确定购买周期（月数）
        $duration = intval($configOptions['duration'] ?? 1);
        if ($duration < 1) $duration = 1;

        // 5. 是否试用
        $try = $configOptions['try'] ?? false;

        $ipType = $configOptions['ip_type'] ?? '';

        if($try){
            $ipCount = 1;
        }else{
            $ipCount = intval($configOptions['ip_count'] ?? 1);
        }

        // 7. 磁盘参数
        $diskType = $configOptions['disk_type'] ?? '';
        $addDiskSize = intval($configOptions['add_disk_size'] ?? 0);

        // 8. 操作系统
        $osId = intval($configOptions['os_id'] ?? 0);
        if (empty($osId)) {
            return ['status' => 400, 'msg' => '未选择操作系统'];
        }


        $apiUrl = 'https://api.v2.rainyun.com';
        $apiKey = $param['server']['hash'];
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $postData = [
            'add_disk_size'     => $addDiskSize,
            'app_vars'           => [],
            'disk_type'        => $diskType,
            'duration'         => $duration,
            'node_uuid'          => '',
            'os_id'            => $osId,
            'plan_id'          => intval($planId),
            'try'              => $try,
            'with_coupon_id'   => 0,
            'with_eip_flags'   => $ipType,
            'with_eip_num'     => $ipCount,
            'zone'             => $configOptions['zone'] ?? ''
        ];

        // 12. 调用雨云API开通
        $res = $this->Curl($apiUrl . '/product/rcs/', json_encode($postData), 30, 'POST', $header);
        // $res = ["code"=>200,"data"=>["ID"=>363513,"DefaultPass"=>"password123"]]; 

        if (!isset($res['code']) || $res['code'] != 200) {
            return ['status' => 400, 'msg' => '开通失败，原因：' . ($res['message'] ?? '未知错误')];
        }

        $serverId = $res['data']['ID'] ?? 0;
        $sysPwd = $res['data']['DefaultPass'] ?? '';

        if (empty($serverId)) {
            return ['status' => 400, 'msg' => '开通失败，未获取到服务器ID'];
        }

        // 13. 保存 rcsid 到 self_defined_field_value
        $this->saveRcsid($productId, $hostId, $serverId);

        // 14. 获取服务器详情
        $detail = $this->Curl($apiUrl . '/product/rcs/' . $serverId, [], 10, 'GET', $header);
        $dataDetail = $detail['data']['Data'] ?? [];

        $osInfo = $dataDetail['OsInfo'] ?? [];
        $username = ($osInfo['os_type'] ?? '') === 'windows' ? 'administrator' : 'root';
        $iconMap = [
            'windows'   => 'Windows',
            'centos'    => 'CentOS',
            'ubuntu'    => 'Ubuntu',
            'debian'    => 'Debian',
            'esxi'      => 'ESXi',
            'xenserver' => 'XenServer',
            'freebsd'   => 'FreeBSD',
            'fedora'    => 'Fedora',
            'archlinux' => 'ArchLinux',
            'rocky'     => 'Rocky',
            'almalinux' => 'AlmaLinux',
            'openeuler' => 'OpenEuler',
            'redhat'    => 'RedHat',
        ];
        $imageIcon = $iconMap[strtolower($osInfo['icon'] ?? '')] ?? '其他';
        $osName = $osInfo['chinese_name'] ?? '';

        // 16. 设置标签
        $this->Curl($apiUrl . '/product/rcs/' . $serverId . '/tag', json_encode(['tag_name' => $hostName]), 30, 'PATCH', $header);

        // 17. 处理IP信息
        $dedicatedip = '';
        $ipList = [];
        $port = 0;

        if (($dataDetail['MainIPv4'] ?? '') === '-') {
            // NAT 模式
            $dedicatedip = $dataDetail['NatPublicIP'] ?? '';
            $natList = $detail['data']['NatList'] ?? [];
            foreach (array_reverse($natList) as $nat) {
                if (($nat['PortIn'] ?? 0) == 22) {
                    $port = $nat['PortOut'] ?? 0;
                }
            }
        } else {
            // 独立IP模式
            $dedicatedip = $dataDetail['MainIPv4'] ?? '';
            $eipList = $detail['data']['EIPList'] ?? [];
            foreach ($eipList as $eip) {
                $ipAddr = $eip['IP'] ?? '';
                if ($ipAddr && $ipAddr !== $dedicatedip) {
                    $ipList[] = $ipAddr;
                }
            }
        }

        // 18. 保存IP信息到 host_ip 表
        $HostIpModel = new \app\common\model\HostIpModel();
        $HostIpModel->hostIpSave([
            'host_id'      => $hostId,
            'dedicate_ip'  => $dedicatedip,
            'assign_ip'    => implode(',', $ipList),
            'write_log'    => false,
        ]);

        // 19. 保存附加信息到 host_addition 表
        $HostAdditionModel = new \app\common\model\HostAdditionModel();
        $HostAdditionModel->hostAdditionSave($hostId, [
            'username'    => $username,
            'password'    => $sysPwd,
            'port'        => $port,
            'power_status' => 'on',
            'image_icon'  => $imageIcon,
            'image_name'  => $osName,
        ]);

        // 20. 更新 host 表状态和到期时间
        $updateHost = [
            'status'   => 'Active',
            'due_time' => $dataDetail['ExpDate'] ?? 0,
        ];
        \think\facade\Db::name('host')->where('id', $hostId)->update($updateHost);

        return ['status' => 200, 'msg' => '开通成功'];
    }

    public function getRcsid($productId, $hostId)
    {
        $fieldId = \think\facade\Db::name('self_defined_field')
            ->where('type', 'product')
            ->where('relid', $productId)
            ->where('field_name', 'rcsid')
            ->value('id');

        if (empty($fieldId)) {
            $fieldId = \think\facade\Db::name('self_defined_field')->insertGetId([
                'type'                    => 'product',
                'relid'                   => $productId,
                'field_name'              => 'rcsid',
                'field_type'              => 'text',
                'description'             => '雨云-云服务器ID',
                'show_admin_host_detail'  => 1,
                'show_order_page'         => 0,
                'show_order_detail'       => 0,
                'show_client_host_detail' => 0,
                'show_client_host_list'   => 0,
                'show_admin_host_list'    => 1,
                'is_required'             => 0,
                'explain_content'         => '',
                'create_time'             => time(),
            ]);
        }

        return \think\facade\Db::name('self_defined_field_value')
            ->where('self_defined_field_id', $fieldId)
            ->where('relid', $hostId)
            ->value('value') ?: '';
    }

    private function saveRcsid($productId, $hostId, $serverId)
    {
        // 查找或创建 rcsid 自定义字段
        $fieldId = \think\facade\Db::name('self_defined_field')
            ->where('type', 'product')
            ->where('relid', $productId)
            ->where('field_name', 'rcsid')
            ->value('id');

        if (empty($fieldId)) {
            $fieldId = \think\facade\Db::name('self_defined_field')->insertGetId([
                'type'                    => 'product',
                'relid'                   => $productId,
                'field_name'              => 'rcsid',
                'field_type'              => 'text',
                'description'             => '雨云-云服务器ID',
                'show_admin_host_detail'  => 1,
                'show_order_page'         => 0,
                'show_order_detail'       => 0,
                'show_client_host_detail' => 0,
                'show_client_host_list'   => 0,
                'show_admin_host_list'    => 1,
                'is_required'             => 0,
                'explain_content'         => '',
                'create_time'             => time(),
            ]);
        }

        // 插入或更新值
        $exist = \think\facade\Db::name('self_defined_field_value')
            ->where('self_defined_field_id', $fieldId)
            ->where('relid', $hostId)
            ->find();

        if (empty($exist)) {
            \think\facade\Db::name('self_defined_field_value')->insert([
                'self_defined_field_id' => $fieldId,
                'relid'                 => $hostId,
                'value'                 => $serverId,
                'create_time'           => time(),
            ]);
        } else {
            \think\facade\Db::name('self_defined_field_value')
                ->where('id', $exist['id'])
                ->update(['value' => $serverId, 'update_time' => time()]);
        }
    }

    public function status($hostId, $productId)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];
        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid, [], 10, 'GET', $header);

        if (!isset($result['code']) || $result['code'] != 200) {
            return ['status' => 400, 'msg' => '获取状态失败: ' . ($result['message'] ?? '未知错误')];
        }

        $dataDetail = $result['data']['Data'] ?? [];
        $status = $dataDetail['Status'] ?? 'unknown';

        // 转换为前端可识别的状态
        $powerStatus = 'off';
        $des = '已关机';
        if ($status === 'running') {
            $powerStatus = 'on';
            $des = '运行中';
        } elseif ($status === 'stopped' || $status === 'stop') {
            $powerStatus = 'off';
            $des = '已关机';
        } elseif ($status === 'suspended') {
            $powerStatus = 'off';
            $des = '已暂停';
        }

        return [
            'status' => 200,
            'data'   => [
                'data' => [
                    'status' => $powerStatus,
                    'des'    => $des,
                ],
            ],
        ];
    }

    public function on($hostId, $productId)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        // 先检查状态
        $statusResult = $this->status($hostId, $productId);
        if ($statusResult['status'] == 200 && $statusResult['data']['data']['status'] == 'on') {
            return ['status' => 400, 'msg' => '开机失败，当前已经是开机状态'];
        }

        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/start", json_encode(['id' => $rcsid]), 30, 'POST', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            $this->syncPowerStatus($hostId, 'on');
            return ['status' => 200, 'msg' => '开机成功'];
        } else {
            $errorMsg = $result['message'] ?? '未知错误';
            if (strpos($errorMsg, '此产品已过期') !== false) {
                return ['status' => 400, 'msg' => '开机失败，请联系工单处理'];
            }
            return ['status' => 400, 'msg' => '开机失败，原因：' . $errorMsg];
        }
    }

    public function off($hostId, $productId)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/stop", json_encode(['id' => $rcsid]), 30, 'POST', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            $this->syncPowerStatus($hostId, 'off');
            return ['status' => 200, 'msg' => '关机成功'];
        } else {
            return ['status' => 400, 'msg' => '关机失败，原因：' . ($result['message'] ?? '未知错误')];
        }
    }

    public function reboot($hostId, $productId)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/reboot", json_encode(['id' => $rcsid]), 30, 'POST', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            return ['status' => 200, 'msg' => '重启成功'];
        } else {
            return ['status' => 400, 'msg' => '重启失败，原因：' . ($result['message'] ?? '未知错误')];
        }
    }

    public function reinstall($hostId, $productId, $params)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $osId = intval($params['os_id'] ?? $params['option_id'] ?? 0);
        $subId = intval($params['sub_id'] ?? 0);
        $osName = $params['os_name'] ?? '';

        if (empty($osId) && empty($subId)) {
            return ['status' => 400, 'msg' => '请选择操作系统'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $func = $params['func'] ?? 'reinstall';
        if ($func === 'changeos') {
            $resetOsd = !empty($params['reset_osd']);
            $postData = [
                'os_id'      => $osId ?: $subId,
                'reset_osd'  => $resetOsd,
                'app_vars'   => [],
            ];
            $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/changeos", json_encode($postData), 120, 'POST', $header);
        } else {
            $postData = [
                'image_id' => $osId ?: $subId,
            ];
            $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/reinstall", json_encode($postData), 120, 'POST', $header);
        }

        if (isset($result['code']) && $result['code'] == 200) {
            return ['status' => 200, 'msg' => '重装系统任务已提交'];
        } else {
            return ['status' => 400, 'msg' => $result['message'] ?? '未知错误'];
        }
    }

    public function crackPass($hostId, $productId, $params)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $password = $params['password'] ?? '';

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $postData = [
            'password' => $password,
        ];

        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/reset-password", json_encode($postData), 30, 'POST', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            if (empty($password)) {
                $detail = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid, [], 10, 'GET', $header);
                if (isset($detail['code']) && $detail['code'] == 200) {
                    $password = $detail['data']['Data']['DefaultPass'] ?? '';
                }
            }
            if (!empty($password)) {
                \app\common\model\HostAdditionModel::where('host_id', $hostId)->update([
                    'password' => $password,
                ]);
            }
            return ['status' => 200, 'msg' => '重置密码成功'];
        } else {
            return ['status' => 400, 'msg' => '重置密码失败，原因：' . ($result['message'] ?? '未知错误')];
        }
    }

    public function vnc($hostId, $productId, $consoleType = 'xtermjs')
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $url = "https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/vnc?console_type=" . $consoleType;
        $result = $this->Curl($url, [], 30, 'GET', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            return [
                'status' => 200,
                'data'   => $result['data'],
            ];
        } else {
            return ['status' => 400, 'msg' => '获取VNC地址失败'];
        }
    }

    private function syncPowerStatus($hostId, $status)
    {
        try {
            \app\common\model\HostAdditionModel::where('host_id', $hostId)->update([
                'power_status' => $status,
            ]);
        } catch (\Exception $e) {
            // 忽略错误
        }
    }

    public function getChartData($hostId, $productId, $params)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $now = time();
        $start = intval($params['chart']['start'] ?? ($now - 86400));
        $chartType = $params['chart']['type'] ?? '';
        $maxMem = 1;

        $monitorUrl = "https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/monitor?start_date=" . $start . "&end_date=" . $now;
        $result = $this->Curl($monitorUrl, [], 30, 'GET', $header);

        $rawData = [];
        $columns = [];
        $maxMem = 1;

        if (isset($result['code']) && $result['code'] == 200 && isset($result['data']['Values'])) {
            $columns = $result['data']['Columns'] ?? [];
            $rawData = $result['data']['Values'] ?? [];

            $detail = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid, [], 10, 'GET', $header);
            if (isset($detail['code']) && $detail['code'] == 200) {
                $maxMem = $detail['data']['Data']['UsageData']['MaxMem'] ?? 1;
            }
        }

        $allSeries = [];
        $allLabels = [];

        if (!empty($rawData)) {
            $timeData = [];
            $timeIndex = array_search('time', $columns);
            $cpuIndex = array_search('cpu', $columns);
            $freememIndex = array_search('freemem', $columns);
            $netoutIndex = array_search('netout', $columns);
            $netinIndex = array_search('netin', $columns);

            foreach ($rawData as $row) {
                $ts = $row[$timeIndex] ?? 0;
                if (empty($ts)) continue;
                $timeLabel = date('H:i', $ts);
                $timeData[] = [
                    'time'    => $timeLabel,
                    'cpu'     => isset($row[$cpuIndex]) ? round(floatval($row[$cpuIndex]), 1) : 0,
                    'memory'  => $maxMem > 0 ? round((1 - (floatval($row[$freememIndex] ?? 0) / $maxMem)) * 100, 1) : 0,
                    'net_in'  => isset($row[$netinIndex]) ? round(floatval($row[$netinIndex]) / 1024, 2) : 0,
                    'net_out' => isset($row[$netoutIndex]) ? round(floatval($row[$netoutIndex]) / 1024, 2) : 0,
                ];
            }

            if (!empty($timeData)) {
                $allSeries['cpu'] = array_map(function($d) { return ['time' => $d['time'], 'value' => $d['cpu']]; }, $timeData);
                $allSeries['memory'] = array_map(function($d) { return ['time' => $d['time'], 'value' => $d['memory']]; }, $timeData);
                $allSeries['net_in'] = array_map(function($d) { return ['time' => $d['time'], 'value' => $d['net_in']]; }, $timeData);
                $allSeries['net_out'] = array_map(function($d) { return ['time' => $d['time'], 'value' => $d['net_out']]; }, $timeData);
                $allLabels = ['CPU使用率', '内存使用率', '网络入流量(KB)', '网络出流量(KB)'];
            }
        }

        if (empty($allSeries)) {
            $empty = [['time' => date('H:i'), 'value' => 0]];
            return [
                'status' => 200,
                'data'   => [
                    'list'  => [$empty, $empty, $empty, $empty],
                    'label' => ['CPU使用率', '内存使用率', '网络入流量(KB)', '网络出流量(KB)'],
                ],
            ];
        }

        $typeMap = [
            'cpu'     => 'cpu',
            'memory'  => 'memory',
            'net_in'  => 'net_in',
            'net_out' => 'net_out',
        ];

        if (!empty($chartType) && isset($typeMap[$chartType])) {
            $key = $typeMap[$chartType];
            $labelMap = [
                'cpu'     => 'CPU使用率',
                'memory'  => '内存使用率',
                'net_in'  => '网络入流量(KB)',
                'net_out' => '网络出流量(KB)',
            ];
            return [
                'status' => 200,
                'data'   => [
                    'list'  => [$allSeries[$key]],
                    'label' => [$labelMap[$key]],
                ],
            ];
        }

        return [
            'status' => 200,
            'data'   => [
                'list'  => [$allSeries['cpu'], $allSeries['memory'], $allSeries['net_in'], $allSeries['net_out']],
                'label' => ['CPU使用率', '内存使用率', '网络入流量(KB)', '网络出流量(KB)'],
            ],
        ];
    }

    public function cartCalculatePrice($param) {
        $product = $param['product'] ?? [];
        $configOptions = $param['custom'] ?? [];
        $qty = $param['qty'] ?? 1;

        $productId = $product['id'] ?? 0;
        if (empty($productId)) {
            return ['status' => 400, 'msg' => '商品不存在'];
        }

        $ProductModel = new \server\rainyunrcs\model\ProductModel();
        $planId = $ProductModel->getRcsPid($productId);
        if (!$planId) {
            return ['status' => 400, 'msg' => '产品配置不存在'];
        }

        $header = ["Content-Type: application/json; charset=utf-8"];
        $duration = intval($configOptions['duration'] ?? 1);
        if ($duration < 1) $duration = 1;
        $ipType = $configOptions['ip_type'] ?? '';
        $ipCount = intval($configOptions['ip_count'] ?? 1);
        $diskType = $configOptions['disk_type'] ?? '';
        $addDiskSize = intval($configOptions['add_disk_size'] ?? 0);
        if($configOptions["try"]) {
            $duration = 0; 
            $apiParams = [
                'scene' => 'try',
                'plan_id' => $planId,
            ];
        }else{
            $apiParams = [
                'ignore_agent' => 'false',
                'scene' => 'create',
                'plan_id' => $planId,
                'duration' => $duration,
                'with_eip_num' => $ipCount ?? 0,
                'with_eip_flags' => $ipType,
                'with_coupon_id' => 0,
                'add_disk_size' => $addDiskSize,
                'disk_type' => $diskType,
            ];
        }

        $cacheKey = 'rainyun_rcs_price_' . md5(json_encode($apiParams));
        $cachedResult = Cache::get($cacheKey);
        if ($cachedResult !== null) {
            $result = $cachedResult;
        } else {
            $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/price", $apiParams, 30, 'GET', $header);
            if (isset($result['code']) && $result['code'] == 200) {
                Cache::set($cacheKey, $result, 3600);
            }
        }

        if (!isset($result['code']) || $result['code'] != 200) {
            return ['status' => 400, 'msg' => $result['msg'] ?? '获取价格失败'];
        }

        $priceRate = (new \server\rainyunrcs\model\ProductConfigModel())->getPriceRate($productId);
        if ($priceRate <= 0) $priceRate = 100;
        $priceMultiplier = $priceRate / 100;

        $priceData = $result['data'] ?? [];
        $unitPrice = floatval($priceData['price'] ?? 0) * $priceMultiplier;
        $detail = $priceData['detail'] ?? [];

        $price = $unitPrice * $qty;

        $cycleNames = [0 => '试用',1 => '月', 3 => '季', 6 => '半年', 12 => '年'];
        $billingCycle = $cycleNames[$duration] ?? $duration . '个月';
        
        $productInfo = $ProductModel->getProductInfo($productId);

        $createPrice = ($detail["per_scene"]["create"] ?? 0) * $priceMultiplier;
        $eipPrice = ($detail['per_scene']['create_eip'] ?? 0) * $priceMultiplier;

        $preview = [];
        $preview[] = ['name' => '配置', 'value' => $productInfo['data']['chinese'] ?? 'plan_id:' . $planId, 'price' => $createPrice . '/月'];
        if (isset($detail['per_scene']['create_eip'])) {
            $ipName = !empty($ipType) ? '特殊独立IP' : '独立IP';
            $ipValue = !empty($ipType) ? $ipType . ' x' . $ipCount : '默认IP x' . $ipCount;
            $preview[] = ['name' => $ipName, 'value' => $ipValue, 'price' => $eipPrice . '/月'];
        }

        return [
            'status' => 200,
            'msg' => '计算成功',
            'data' => [
                'price'                          => $price,
                'renew_price'                    => $price,
                'billing_cycle'                  => $billingCycle,
                'duration'                       => $duration * 31 * 24 * 3600,
                'description'                    => $productInfo['data']['chinese'] ?? '',
                'base_price'                     => $createPrice,
                'preview'                        => $preview,
            ]
        ];
    }

    public function durationPrice($param) {
        $host = $param['host'] ?? [];
        $productId = $host['product_id'] ?? 0;
        $hostId = $host['id'] ?? 0;

        if (empty($productId) || empty($hostId)) {
            return ['status' => 400, 'msg' => '参数错误'];
        }

        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $server = $param['server'] ?? [];
        $apiKey = $server['hash'] ?? '';
        $apiUrl = $server['url'] ?? 'https://api.v2.rainyun.com';

        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $cycleNames = [1 => '月', 3 => '季', 6 => '半年', 12 => '年'];
        $durations = [1, 3, 6, 12];

        $data = [];
        foreach ($durations as $duration) {
            $apiParams = [
                'scene'           => 'renew',
                'product_id'      => intval($rcsid),
                'duration'        => $duration,
                'with_coupon_id'  => 0,
            ];

            $result = $this->Curl($apiUrl . '/product/rcs/price', $apiParams, 30, 'GET', $header);

            if (isset($result['code']) && $result['code'] == 200) {
                $priceData = $result['data'] ?? [];
                $price = floatval($priceData['price'] ?? 0);
            } else {
                $price = 0;
            }

            $data[] = [
                'duration'      => $duration * 31 * 24 * 3600,
                'billing_cycle' => $cycleNames[$duration],
                'price'         => $price,
            ];
        }

        return ['status' => 200, 'msg' => '请求成功', 'data' => $data];
    }
    public function getPriceCycle($params)
    {
        $productId = $params['product']['id'] ?? 0;
        if (empty($productId)) {
            return ['price' => 0, 'cycle' => '月'];
        }

        $ProductModel = new \server\rainyunrcs\model\ProductModel();
        $productInfo = $ProductModel->getProductInfo($productId);

        if (!isset($productInfo['code']) || $productInfo['code'] != 200) {
            return ['price' => 0, 'cycle' => '月'];
        }

        $price = $productInfo['data']['price'] ?? 0;

        $priceRate = (new \server\rainyunrcs\model\ProductConfigModel())->getPriceRate($productId);
        if ($priceRate > 0 && $priceRate != 100) {
            $price = $price * ($priceRate / 100);
        }

        return ['price' => (float)$price, 'cycle' => '月'];
    }

    public function renew($param)
    {
        $hostId = $param['host']['id'] ?? 0;
        $productId = $param['host']['product_id'] ?? 0;

        if (empty($hostId) || empty($productId)) {
            return ['status' => 400, 'msg' => '参数错误'];
        }

        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $billingCycleName = $param['host']['billing_cycle_name'] ?? '';
        $cycleMap = [
            '月'   => 1,
            '季'   => 3,
            '半年'  => 6,
            '年'   => 12,
        ];
        $duration = $cycleMap[$billingCycleName] ?? 1;
        if ($duration < 1) $duration = 1;

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        if (empty($apiKey)) {
            return ['status' => 400, 'msg' => '获取API Key失败'];
        }

        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $postData = json_encode([
            'duration'        => $duration,
            'with_coupon_id'  => 0,
        ]);
        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/renew", $postData, 30, 'POST', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            $detail = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid, [], 10, 'GET', $header);
            $expDate = 0;
            if (isset($detail['code']) && $detail['code'] == 200) {
                $expDate = $detail['data']['Data']['ExpDate'] ?? 0;
            }

            if ($expDate > 0) {
                \think\facade\Db::name('host')->where('id', $hostId)->update([
                    'due_time' => $expDate,
                ]);
            }

            return ['status' => 200, 'msg' => '续费成功'];
        } else {
            $errorMsg = $result['message'] ?? '未知错误';
            if (strpos($errorMsg, '此产品已过期') !== false) {
                return ['status' => 400, 'msg' => '续费失败，请联系工单处理'];
            }
            return ['status' => 400, 'msg' => '续费失败，原因：' . $errorMsg];
        }
    }
    
    public function Curl($url = "", $data = [], $timeout = 30, $request = "POST", $header = []) {
        $curl = curl_init();
        if ($request == "GET") {
            $s = "";
            if (!empty($data)) {
                foreach ($data as $k => $v) {
                    $s .= $k . "=" . urlencode($v) . "&";
                }
            }
            if ($s) {
                $s = "?" . trim($s, "&");
            }
            curl_setopt($curl, CURLOPT_URL, $url . $s);
        } else {
            curl_setopt($curl, CURLOPT_URL, $url);
        }
        curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($curl, CURLOPT_USERAGENT, "Mofang");
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        if (strtoupper($request) == "GET") {
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_HTTPGET, 1);
        }
        if (strtoupper($request) == "POST") {
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_POST, 1);
            if (is_array($data)) {
                curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
            } else {
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            }
        }
        if (strtoupper($request) == "PUT" || strtoupper($request) == "DELETE" || strtoupper($request) == "PATCH") {
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, strtoupper($request));
            if (is_array($data)) {
                curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
            } else {
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            }
        }
        if (!empty($header)) {
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        }
        $res = curl_exec($curl);
        $error = curl_error($curl);
        if (!empty($error)) {
            return ["status" => 500, "message" => "CURL ERROR:" . $error];
        }
        $info = curl_getinfo($curl);
        curl_close($curl);
        return json_decode($res, true);
    }

    public function getNatList($hostId, $productId)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid, [], 10, 'GET', $header);

        if (!isset($result['code']) || $result['code'] != 200) {
            return ['status' => 400, 'msg' => '获取NAT列表失败'];
        }

        $natList = $result['data']['NatList'] ?? [];
        $natPublicIP = $result['data']['Data']['NatPublicIP'] ?? '';

        return [
            'status' => 200,
            'data'   => [
                'list' => $natList,
                'ip'   => $natPublicIP,
            ],
        ];
    }


    public function addNat($hostId, $productId, $params)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $portIn = intval($params['port_in'] ?? 0);
        $portOut = intval($params['port_out'] ?? 0);
        $portType = $params['port_type'] ?? 'tcp';

        if ($portIn < 1 || $portIn > 65535 || $portOut < 1 || $portOut > 65535) {
            return ['status' => 400, 'msg' => '端口范围必须在1-65535之间'];
        }

        if (!in_array($portType, ['tcp', 'udp', 'tcp_udp'])) {
            return ['status' => 400, 'msg' => '协议类型不正确'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $postData = json_encode([
            'port_in'   => $portIn,
            'port_out'  => $portOut,
            'port_type' => $portType,
        ]);

        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/nat", $postData, 30, 'POST', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            return ['status' => 200, 'msg' => 'NAT转发添加成功'];
        } else {
            return ['status' => 400, 'msg' => $result['message'] ?? 'NAT转发添加失败'];
        }
    }

    public function delNat($hostId, $productId, $params)
    {
        $rcsid = $this->getRcsid($productId, $hostId);
        if (empty($rcsid)) {
            return ['status' => 400, 'msg' => '服务器ID不存在'];
        }

        $natId = intval($params['nat_id'] ?? 0);
        if (empty($natId)) {
            return ['status' => 400, 'msg' => '请选择要删除的NAT转发'];
        }

        $apiKey = (new \server\rainyunrcs\model\ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];

        $result = $this->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid . "/nat/?nat_id=" . $natId, [], 30, 'DELETE', $header);

        if (isset($result['code']) && $result['code'] == 200) {
            return ['status' => 200, 'msg' => 'NAT转发删除成功'];
        } else {
            return ['status' => 400, 'msg' => $result['message'] ?? 'NAT转发删除失败'];
        }
    }
}