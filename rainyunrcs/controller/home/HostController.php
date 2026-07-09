<?php
namespace server\rainyunrcs\controller\home;

use app\common\model\HostModel;
use app\common\model\ProductModel;
use app\common\model\MenuModel;
use app\common\model\SelfDefinedFieldModel;
use app\common\model\HostIpModel;
use app\common\model\HostAdditionModel;
use app\event\controller\BaseController;
use server\rainyunrcs\Rainyunrcs;
use server\rainyunrcs\model\ProductModel as RainyunProductModel;
use server\rainyunrcs\model\ProductServerModel;
use think\db\Query;

/**
 * @title RainyunRCS - 产品列表&详情(前台)
 * @desc RainyunRCS - 产品列表&详情(前台)
 * @use server\rainyunrcs\controller\home\HostController
 */
class HostController extends BaseController
{
    public function initialize()
    {
        parent::initialize();
        app('http')->name('home');
    }

    /**
     * 时间 2026-07-01
     * @title 产品列表
     * @desc 产品列表
     * @url /console/v1/rainyunrcs/host
     * @method GET
     * @author
     * @version v1
     * @param int m - 菜单ID
     * @param string keywords - 关键字,搜索范围:产品ID,商品名称,标识
     * @param string status - 状态 Unpaid未付款 Pending开通中 Active已开通 Suspended已暂停 Deleted已删除 Failed开通失败
     * @param string tab - 状态 using使用中 expiring即将到期 overdue已逾期 deleted已删除
     * @param int page - 页数
     * @param int limit - 每页条数
     * @param string orderby - 排序 id,active_time,due_time
     * @param string sort - 升/降序 asc,desc
     * @return array list - 产品
     * @return int list[].id - 产品ID
     * @return int list[].product_id - 商品ID
     * @return string list[].product_name - 商品名称
     * @return string list[].name - 标识
     * @return int list[].active_time - 开通时间
     * @return int list[].due_time - 到期时间
     * @return string list[].first_payment_amount - 金额
     * @return string list[].billing_cycle - 周期
     * @return string list[].status - 状态
     * @return object list[].self_defined_field - 产品自定义字段
     * @return int list[].is_auto_renew - 是否自动续费(0=否,1=是)
     * @return int count - 产品总数
     * @return int using_count - 使用中产品数量
     * @return int expiring_count - 即将到期产品数量
     * @return int overdue_count - 已逾期产品数量
     * @return int deleted_count - 已删除产品数量
     * @return int all_count - 全部产品数量
     */
    public function hostList()
    {
        $param = array_merge($this->request->param(), [
            'page'  => $this->request->page,
            'limit' => $this->request->limit,
            'sort'  => $this->request->sort,
        ]);

        $param['m']          = $param['m'] ?? 0;
        $param['client_id']  = get_client_id();
        $param['keywords']   = $param['keywords'] ?? '';
        $param['status']     = $param['status'] ?? '';
        $param['tab']        = $param['tab'] ?? '';
        $param['orderby']    = isset($param['orderby']) && in_array($param['orderby'], ['id', 'client_id', 'product_name', 'name', 'active_time', 'due_time', 'first_payment_amount', 'status']) ? $param['orderby'] : 'id';

        if ($param['orderby'] == 'product_name') {
            $param['orderby'] = 'p.name';
        } else {
            $param['orderby'] = 'h.' . $param['orderby'];
        }

        // 菜单关联的产品
        $menu = MenuModel::find($param['m']);
        if (!empty($menu)) {
            $param['product_id'] = json_decode($menu['product_id'], true) ?? [];
        } else {
            $param['product_id'] = [];
        }

        // 子账户可见产品
        $res = hook('get_client_host_id', ['client_id' => get_client_id(false)]);
        $res = array_values(array_filter($res ?? []));
        $hostId = [];
        foreach ($res as $value) {
            if (isset($value['status']) && $value['status'] == 200) {
                $hostId = $value['data']['host'] ?? [];
            }
        }
        $param['host_id'] = $hostId;

        // 构建查询条件
        $where = function (Query $query) use ($param) {
            if (!empty($param['host_id'])) {
                $query->whereIn('h.id', $param['host_id']);
            }
            if (!empty($param['product_id'])) {
                $query->whereIn('h.product_id', $param['product_id']);
            }
            if (!empty($param['client_id'])) {
                $query->where('h.client_id', $param['client_id'])->where('h.status', '<>', 'Cancelled');
            }
            // 前台是否展示已删除产品
            $homeShowDeletedHost = configuration('home_show_deleted_host');
            if ($homeShowDeletedHost != 1) {
                $query->where('h.status', '<>', 'Deleted');
            }
            // 搜索关键字
            if (!empty($param['keywords'])) {
                $query->where('h.id|p.name|h.name|h.client_notes', 'like', "%{$param['keywords']}%");
            }
            // 状态筛选
            if (!empty($param['status'])) {
                if ($param['status'] == 'Pending') {
                    $query->whereIn('h.status', ['Pending', 'Failed']);
                } else {
                    $query->where('h.status', $param['status']);
                }
            }
            // Tab 筛选
            if (!empty($param['tab'])) {
                $time = time();
                if ($param['tab'] == 'using') {
                    $query->whereIn('h.status', ['Pending', 'Active']);
                } elseif ($param['tab'] == 'expiring') {
                    $renewalFirstDay = configuration('cron_due_renewal_first_day');
                    $timeRenewalFirst = strtotime(date('Y-m-d 23:59:59', $time + $renewalFirstDay * 24 * 3600));
                    $query->whereIn('h.status', ['Pending', 'Active'])
                          ->where('h.due_time', '>', $time)
                          ->where('h.due_time', '<=', $timeRenewalFirst)
                          ->where('h.billing_cycle', '<>', 'free')
                          ->where('h.billing_cycle', '<>', 'onetime');
                } elseif ($param['tab'] == 'overdue') {
                    $query->whereIn('h.status', ['Pending', 'Active', 'Suspended', 'Failed'])
                          ->where('h.due_time', '<=', $time)
                          ->where('h.billing_cycle', '<>', 'free')
                          ->where('h.billing_cycle', '<>', 'onetime');
                } elseif ($param['tab'] == 'deleted') {
                    $query->where('h.status', 'Deleted');
                }
            }
            // 只查 rainyunrcs 模块的产品
            $query->where('s.module', 'rainyunrcs');
            $query->where('p.product_id', 0);
            $query->where('h.is_delete', 0);
        };

        $HostModel = new HostModel();

        // 总数
        $count = $HostModel->alias('h')
            ->field('h.id')
            ->leftJoin('product p', 'p.id = h.product_id')
            ->leftJoin('server s', 's.id = h.server_id')
            ->where($where)
            ->count();

        // 列表
        $hosts = $HostModel->alias('h')
            ->field('h.id,h.product_id,h.client_id,h.name,h.create_time,h.active_time,h.due_time,h.first_payment_amount,h.renew_amount,h.billing_cycle,h.billing_cycle_name,h.status,h.client_notes')
            ->field('p.name product_name')
            ->leftJoin('product p', 'p.id = h.product_id')
            ->leftJoin('server s', 's.id = h.server_id')
            ->where($where)
            ->withAttr('status', function ($value) {
                return $value == 'Failed' ? 'Pending' : $value;
            })
            ->limit($param['limit'])
            ->page($param['page'])
            ->order($param['orderby'], $param['sort'])
            ->select()
            ->toArray();

        // 获取自定义字段
        $selfDefinedField = ['self_defined_field' => [], 'self_defined_field_value' => []];
        if (!empty($hosts)) {
            $hostIds    = array_column($hosts, 'id');
            $productIds = array_column($hosts, 'product_id');

            $SelfDefinedFieldModel = new SelfDefinedFieldModel();
            $selfDefinedField = $SelfDefinedFieldModel->getHostListSelfDefinedFieldValue([
                'product_id' => $productIds,
                'host_id'    => $hostIds,
            ]);

            $autoRenewHostId = hook_one('get_auto_renew_host_id', ['host_id' => $hostIds]);
            $autoRenewHostId = $autoRenewHostId ? array_flip($autoRenewHostId) : [];
        }

        foreach ($hosts as $key => $host) {
            $hosts[$key]['first_payment_amount'] = amount_format($host['first_payment_amount']);
            $hosts[$key]['billing_cycle'] = $host['billing_cycle'] != 'onetime' ? $host['billing_cycle_name'] : '';
            $hosts[$key]['self_defined_field'] = $selfDefinedField['self_defined_field_value'][$host['id']] ?? (object)[];
            $hosts[$key]['is_auto_renew'] = isset($autoRenewHostId[$host['id']]) ? 1 : 0;

            unset($hosts[$key]['billing_cycle_name'], $hosts[$key]['create_time']);
        }

        // 各分类计数
        $countWhere = function (Query $query) use ($param) {
            if (!empty($param['host_id'])) {
                $query->whereIn('h.id', $param['host_id']);
            }
            if (!empty($param['product_id'])) {
                $query->whereIn('h.product_id', $param['product_id']);
            }
            if (!empty($param['client_id'])) {
                $query->where('h.client_id', $param['client_id'])->where('h.status', '<>', 'Cancelled');
            }
            $homeShowDeletedHost = configuration('home_show_deleted_host');
            if ($homeShowDeletedHost != 1) {
                $query->where('h.status', '<>', 'Deleted');
            }
            $query->where('s.module', 'rainyunrcs');
            $query->where('p.product_id', 0);
            $query->where('h.is_delete', 0);
        };

        $usingCount    = $HostModel->usingCount($countWhere);
        $expiringCount = $HostModel->expiringCount($countWhere);
        $overdueCount  = $HostModel->overdueCount($countWhere);
        $deletedCount  = $HostModel->deletedCount($countWhere);
        $allCount      = $HostModel->allCount($countWhere);

        $data = [
            'list'               => $hosts,
            'count'              => $count,
            'using_count'        => $usingCount,
            'expiring_count'     => $expiringCount,
            'overdue_count'      => $overdueCount,
            'deleted_count'      => $deletedCount,
            'all_count'          => $allCount,
            'self_defined_field' => $selfDefinedField['self_defined_field'] ?? [],
        ];

        return json([
            'status' => 200,
            'msg'    => lang('success_message'),
            'data'   => $data,
        ]);
    }

    /**
     * 时间 2026-07-03
     * @title 产品详情配置
     * @desc 获取产品详情页的配置信息、图表、管理按钮等
     * @url /console/v1/rainyunrcs/host/:host_id/configoption
     * @method GET
     * @param int host_id - 产品ID required
     * @return object host - 产品基础信息
     * @return array configoptions - 配置项信息
     * @return array chart - 图表配置
     * @return array client_area - 自定义区域
     * @return object client_button - 管理按钮
     * @return object os - 操作系统列表
     */
    public function detail()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        // 验证产品归属
        $host = HostModel::where('id', $hostId)
            ->where('client_id', $clientId)
            ->where('status', 'Active')
            ->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在或无权访问']);
        }

        // 获取rcsid
        $productId = $host['product_id'];
        $rainyunrcs = new Rainyunrcs();
        $rcsid = $rainyunrcs->getRcsid($productId, $hostId);

        // 查询雨云API获取服务器详情
        $apiKey = (new ProductServerModel())->getApiKeyByProductId($productId);
        $header = ["Content-Type: application/json; charset=utf-8", "x-api-key: " . $apiKey];
        $detail = $rainyunrcs->Curl("https://api.v2.rainyun.com/product/rcs/" . $rcsid, [], 10, 'GET', $header);
        $dataDetail = $detail['data']['Data'] ?? [];
        $upgradeablePlans = $detail['data']['UpgradeablePlans'] ?? [];

        // 从雨云API获取操作系统用户名
        $osInfo = $dataDetail['OsInfo'] ?? [];
        $apiUsername = ($osInfo['os_type'] ?? '') === 'windows' ? 'administrator' : 'root';
        $defaultPass = $dataDetail['DefaultPass'] ?? '';
        $plan = $dataDetail['Plan'] ?? [];

        // 主机信息 - 优先使用雨云API实时数据
        $hostInfo = [
            'id'                    => $host['id'],
            'name'                  => $host['name'],
            'product_id'            => $host['product_id'],
            'dedicatedip'           => $dataDetail['MainIPv4'] ?? '',
            'username'              => $apiUsername,
            'password'              => $defaultPass,
            'os'                    => $dataDetail['OsName'] ?? '',
            'os_info'               => $osInfo,
            'billing_cycle'         => $host['billing_cycle'],
            'billing_cycle_time'    => $host['due_time'] - $host['active_time'],
            'status'                => $host['status'],
            // 雨云API实时数据
            'server_id'             => $host['id'],
            'host_name'             => $dataDetail['HostName'] ?? '',
            'status_api'            => $dataDetail['Status'] ?? '',
            'node_name'             => $dataDetail['Node']['ChineseName'] ?? '',
            'zone'                  => $dataDetail['Zone'] ?? '',
            'int_ip'                => $dataDetail['IntIPv4'] ?? '',
            'uid'                   => $dataDetail['UID'] ?? '',
            'node_uuid'             => $dataDetail['NodeUUID'] ?? '',
            'create_date'           => $dataDetail['CreateDate'] ?? 0,
            'tag'                   => $dataDetail['Tag'] ?? '',
            'plan_name'             => $plan['chinese'] ?? $plan['plan_name'] ?? '',
            'line'                  => $plan['line'] ?? '',
            'cpu'                   => $plan['cpu'] ?? 0,
            'memory'                => intval(($plan['memory'] ?? 0) / 1024),
            'disk'                  => $dataDetail['Disk'] ?? ($plan['disk_size']['ssd'] ?? 0),
            'net_in'                => $plan['net_in'] ?? 0,
            'net_out'               => $plan['net_out'] ?? 0,
            'traffic_base_gb'       => $plan['traffic_base_gb'] ?? 0,
            'region'                => $plan['region'] ?? $dataDetail['Node']['Region'] ?? '',
            'machine'               => $plan['machine'] ?? $dataDetail['Node']['Machine'] ?? '',
        ];

        // 如果API返回的IP为NAT模式（-），尝试从EIPList获取
        if ($hostInfo['dedicatedip'] === '-' || empty($hostInfo['dedicatedip'])) {
            $eipList = $detail['data']['EIPList'] ?? [];
            foreach ($eipList as $eip) {
                if (!empty($eip['IP'])) {
                    $hostInfo['dedicatedip'] = $eip['IP'];
                    break;
                }
            }
        }

        // 如果API没有返回密码，降级到本地数据库
        if (empty($hostInfo['password'])) {
            $addition = HostAdditionModel::where('host_id', $hostId)->find();
            if ($addition) {
                $hostInfo['password'] = $addition['password'] ?? '';
            }
        }

        // 配置项 - 组装成前端的配置格式
        $configoptions = [];
        if (!empty($plan)) {
            $configoptions[] = [
                'id'           => 1,
                'option_name'  => 'CPU',
                'option_type'  => 'quantity',
                'qty'          => $plan['cpu'] ?? 0,
                'subs'         => [],
                'unit'         => '核',
            ];
            $configoptions[] = [
                'id'           => 2,
                'option_name'  => '内存',
                'option_type'  => 'quantity',
                'qty'          => intval(($plan['memory'] ?? 0) / 1024),
                'subs'         => [],
                'unit'         => 'GB',
            ];
            $configoptions[] = [
                'id'           => 3,
                'option_name'  => '硬盘',
                'option_type'  => 'quantity',
                'qty'          => $dataDetail['Disk'] ?? ($plan['disk_size']['ssd'] ?? 0),
                'subs'         => [],
                'unit'         => 'GB',
            ];
            $configoptions[] = [
                'id'           => 4,
                'option_name'  => '带宽',
                'option_type'  => 'quantity',
                'qty'          => $plan['net_out'] ?? 0,
                'subs'         => [],
                'unit'         => 'Mbps',
            ];
            $configoptions[] = [
                'id'           => 5,
                'option_name'  => '流量',
                'option_type'  => 'quantity',
                'qty'          => $plan['traffic_base_gb'] ?? 0,
                'subs'         => [],
                'unit'         => 'GB',
            ];
            $configoptions[] = [
                'id'           => 6,
                'option_name'  => '套餐',
                'option_type'  => 'radio',
                'subs'         => [
                    ['id' => $plan['id'], 'option_name' => $plan['chinese'] ?? $plan['plan_name'] ?? ''],
                ],
                'unit'         => '',
            ];
        }

        // 图表数据 - 使用UsageData
        $usageData = $dataDetail['UsageData'] ?? [];
        $chartData = [];
        if (!empty($usageData)) {
            $chartData[] = [
                'title'       => 'CPU使用率',
                'type'        => 'cpu',
                'select'      => [],
                'selectValue' => '',
                'loading'     => false,
                'data'        => [['time' => date('H:i'), 'value' => round($usageData['CPU'] ?? 0, 1)]],
            ];
            $chartData[] = [
                'title'       => '内存使用率',
                'type'        => 'memory',
                'select'      => [],
                'selectValue' => '',
                'loading'     => false,
                'data'        => [
                    ['time' => date('H:i'), 'value' => round((($usageData['MaxMem'] ?? 1) - ($usageData['FreeMem'] ?? 0)) / ($usageData['MaxMem'] ?? 1) * 100, 1)],
                ],
            ];
            $chartData[] = [
                'title'       => '网络入流量',
                'type'        => 'net_in',
                'select'      => [],
                'selectValue' => '',
                'loading'     => false,
                'data'        => [['time' => date('H:i'), 'value' => round(($usageData['NetIn'] ?? 0) / 1024, 2)]],
            ];
            $chartData[] = [
                'title'       => '网络出流量',
                'type'        => 'net_out',
                'select'      => [],
                'selectValue' => '',
                'loading'     => false,
                'data'        => [['time' => date('H:i'), 'value' => round(($usageData['NetOut'] ?? 0) / 1024, 2)]],
            ];
        }

        // 管理按钮
        $clientButton = [
            'control' => [
                ['func' => 'on', 'name' => '开机'],
                ['func' => 'off', 'name' => '关机'],
                ['func' => 'reboot', 'name' => '重启'],
            ],
            'console' => [
                ['func' => 'vnc_xtermjs', 'name' => 'Xtermjs VNC（常用，支持复制粘贴）'],
                ['func' => 'vnc_novnc', 'name' => 'NoVNC（排错救援专用）'],
                ['func' => 'reinstall', 'name' => '重装系统'],
                ['func' => 'crack_pass', 'name' => '重置密码'],
            ],
        ];

        // 自定义区域 (client_area)
        $clientArea = [];

        // 判断是否为NAT机型，添加NAT管理标签
        $mainIpv4 = $dataDetail['MainIPv4'] ?? '';
        if ($mainIpv4 === '-') {
            $clientArea[] = ['key' => 'nat', 'name' => 'NAT转发'];
        }

        // 弹性云盘菜单
        $clientArea[] = ['key' => 'disk', 'name' => '弹性云盘'];

        // 备份还原菜单
        $clientArea[] = ['key' => 'backup', 'name' => '备份还原'];

        $result = [
            'host' => $hostInfo,
            'configoptions' => $configoptions,
            'chart' => $chartData,
            'client_area' => $clientArea,
            'client_button' => $clientButton,
            'host_data' => [
                'status' => $host['status'],
                'name'   => $host['name'],
                'active_time' => $host['active_time'],
                'due_time'    => $host['due_time'],
                'first_payment_amount' => $host['first_payment_amount'],
                'billing_cycle_name'   => $host['billing_cycle_name'],
                'renew_amount' => $host['renew_amount'],
            ],
        ];

        return json([
            'status' => 200,
            'msg'    => lang('success_message'),
            'data'   => $result,
        ]);
    }

    /**
     * 时间 2026-07-03
     * @title 获取实例状态
     * @desc 获取云服务器电源状态
     * @url /console/v1/rainyunrcs/host/:host_id/provision/status
     * @method POST
     */
    public function provisionFuncStatus()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $rainyunrcs = new Rainyunrcs();
        $res = $rainyunrcs->status($hostId, $host['product_id']);

        return json($res);
    }

    /**
     * 时间 2026-07-03
     * @title 执行供应操作
     * @desc 执行开机、关机、重启、重装系统、重置密码、VNC等操作
     * @url /console/v1/rainyunrcs/host/:host_id/provision/:func
     * @method POST
     */
    public function provisionFunc()
    {
        $hostId = $this->request->param('host_id');
        $func = $this->request->param('func');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $params = $this->request->param();
        $rainyunrcs = new Rainyunrcs();

        switch ($func) {
            case 'on':
                $res = $rainyunrcs->on($hostId, $host['product_id']);
                break;
            case 'off':
                $res = $rainyunrcs->off($hostId, $host['product_id']);
                break;
            case 'reboot':
                $res = $rainyunrcs->reboot($hostId, $host['product_id']);
                break;
            case 'reinstall':
            case 'changeos':
                $res = $rainyunrcs->reinstall($hostId, $host['product_id'], $params);
                break;
            case 'crack_pass':
                $res = $rainyunrcs->crackPass($hostId, $host['product_id'], $params);
                break;
            case 'vnc':
                $consoleType = $params['console_type'] ?? 'xtermjs';
                $res = $rainyunrcs->vnc($hostId, $host['product_id'], $consoleType);
                break;
            default:
                return json(['status' => 400, 'msg' => '不支持的操作']);
        }


        return json($res);
    }

    /**
     * 时间 2026-07-03
     * @title 图表数据
     * @desc 获取统计图表数据
     * @url /console/v1/rainyunrcs/host/:host_id/configoption/chart
     * @method POST
     */
    public function chartData()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();
        $params = $this->request->param();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $rainyunrcs = new Rainyunrcs();
        $res = $rainyunrcs->getChartData($hostId, $host['product_id'], $params);

        return json($res);
    }

    /**
     * 时间 2026-07-03
     * @title 自定义区域输出
     * @desc 自定义区域HTML输出
     * @url /console/v1/rainyunrcs/host/:host_id/configoption/area
     * @method GET
     */
    public function clientAreaOutput()
    {
        $hostId = $this->request->param('host_id');
        $key = $this->request->param('key', '');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $html = '';
        if ($key === 'disk') {
            $html = '<div class="main-card"><div class="main-card-title"><span class="title">弹性云盘</span></div><p style="padding: 20px; color: #999;">功能开发中</p></div>';
        } elseif ($key === 'backup') {
            $html = '<div class="main-card"><div class="main-card-title"><span class="title">备份还原</span></div><p style="padding: 20px; color: #999;">功能开发中</p></div>';
        }

        return json([
            'status' => 200,
            'data'   => [
                'html' => $html,
            ],
        ]);
    }

    /**
     * 时间 2026-07-05
     * @title NAT转发列表
     * @desc 获取NAT转发规则列表
     * @url /console/v1/rainyunrcs/host/:host_id/nat
     * @method GET
     * @param int host_id - 产品ID required
     */
    public function natList()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $rainyunrcs = new Rainyunrcs();
        $res = $rainyunrcs->getNatList($hostId, $host['product_id']);

        return json($res);
    }

    /**
     * 时间 2026-07-05
     * @title 添加NAT转发
     * @desc 创建新的NAT转发规则
     * @url /console/v1/rainyunrcs/host/:host_id/nat
     * @method POST
     * @param int host_id - 产品ID required
     * @param int port_out - 外网端口 required
     * @param int port_in - 内网端口 required
     * @param string port_type - 协议类型(tcp/udp/tcp_udp) required
     */
    public function natAdd()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $params = $this->request->param();
        $rainyunrcs = new Rainyunrcs();
        $res = $rainyunrcs->addNat($hostId, $host['product_id'], $params);


        return json($res);
    }

    /**
     * 时间 2026-07-05
     * @title 删除NAT转发
     * @desc 删除指定的NAT转发规则
     * @url /console/v1/rainyunrcs/host/:host_id/nat/:nat_id
     * @method DELETE
     * @param int host_id - 产品ID required
     * @param int nat_id - NAT规则ID required
     */
    public function natDel()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $params = $this->request->param();
        $rainyunrcs = new Rainyunrcs();
        $res = $rainyunrcs->delNat($hostId, $host['product_id'], $params);


        return json($res);
    }

    /**
     * 时间 2026-07-03
     * @title 续费页面
     * @desc 获取续费页面信息
     * @url /console/v1/rainyunrcs/host/:host_id/renew
     * @method GET
     */
    public function renewPage()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        // 获取续费价格信息（简化版，实际应调用雨云API获取续费价格）
        $renewAmount = $host['renew_amount'];

        $hostData = [
            [
                'id'             => $host['id'],
                'billing_cycle'  => $host['billing_cycle_name'],
                'billing_cycle_name' => $host['billing_cycle_name'],
                'duration'       => $host['due_time'] - $host['active_time'],
                'price'          => $renewAmount,
                'base_price'     => $renewAmount,
                'due_time'       => $host['due_time'],
            ],
        ];

        return json([
            'status' => 200,
            'data'   => [
                'host' => $hostData,
            ],
        ]);
    }

    /**
     * 时间 2026-07-03
     * @title 升级页面
     * @desc 获取产品升级页面数据
     * @url /console/v1/rainyunrcs/host/:host_id/upgrade
     * @method GET
     */
    public function upgradePage()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $rainyunrcs = new Rainyunrcs();
        $res = $rainyunrcs->getUpgradePage($hostId, $host['product_id']);

        return json($res);
    }

    /**
     * 时间 2026-07-03
     * @title 提交升级
     * @desc 提交产品升级
     * @url /console/v1/rainyunrcs/host/:host_id/upgrade
     * @method POST
     */
    public function upgrade()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();
        $params = $this->request->param();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        // 升级需要生成订单，简化处理
        return json(['status' => 400, 'msg' => '升级功能开发中']);
    }

    /**
     * 时间 2026-07-03
     * @title 配置升降级页面
     * @desc 获取配置升降级页面数据
     * @url /console/v1/rainyunrcs/host/:host_id/upgrade_config
     * @method GET
     */
    public function upgradeConfigPage()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        $rainyunrcs = new Rainyunrcs();
        $res = $rainyunrcs->getUpgradeConfigPage($hostId, $host['product_id']);

        return json($res);
    }

    /**
     * 时间 2026-07-03
     * @title 提交配置升降级
     * @desc 提交配置升降级
     * @url /console/v1/rainyunrcs/host/:host_id/upgrade_config
     * @method POST
     */
    public function upgradeConfig()
    {
        $hostId = $this->request->param('host_id');
        $clientId = get_client_id();
        $params = $this->request->param();

        $host = HostModel::where('id', $hostId)->where('client_id', $clientId)->find();
        if (empty($host)) {
            return json(['status' => 400, 'msg' => '产品不存在']);
        }

        // 配置升降级需要生成订单，简化处理
        return json(['status' => 400, 'msg' => '配置升降级功能开发中']);
    }

    /**
     * 时间 2026-07-03
     * @title 同步升级价格
     * @desc 异步获取升降级价格
     * @url /console/v1/rainyunrcs/host/:host_id/sync_upgrade_price
     * @method POST
     */
    public function syncUpgradePrice()
    {
        $hostId = $this->request->param('host_id');
        $params = $this->request->param();

        // 简化实现
        return json([
            'status' => 200,
            'data'   => [
                'upgrade_price' => '0.00',
                'base_price'    => '0.00',
                'description'   => '',
            ],
        ]);
    }

    /**
     * 时间 2026-07-03
     * @title 同步配置升级价格
     * @desc 异步获取配置升降级价格
     * @url /console/v1/rainyunrcs/host/:host_id/sync_upgrade_config_price
     * @method POST
     */
    public function syncUpgradeConfigPrice()
    {
        $hostId = $this->request->param('host_id');
        $params = $this->request->param();

        // 简化实现
        return json([
            'status' => 200,
            'data'   => [
                'price' => '0.00',
            ],
        ]);
    }

    /**
     * 获取服务器API信息
     */
    private function getServerApi($productId)
    {
        $product = ProductModel::find($productId);
        if (empty($product)) {
            return null;
        }
        return [
            'url'  => $product['server_url'] ?? 'https://api.v2.rainyun.com',
            'hash' => (new ProductServerModel())->getApiKeyByProductId($productId),
        ];
    }
}
