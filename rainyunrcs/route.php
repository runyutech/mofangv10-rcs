<?php 

use think\facade\Route;
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
// 不需要登录
Route::group('console/v1',function (){
    Route::get('rainyunrcs/product/:product_id', "\\server\\rainyunrcs\\controller\\home\\ProductController@getProductInfo");
    Route::get('rainyunrcs/product/:product_id/ip_types', "\\server\\rainyunrcs\\controller\\home\\ProductController@getIpTypeMap");
    Route::get('rainyunrcs/product/:product_id/zones', "\\server\\rainyunrcs\\controller\\home\\ProductController@getZoneList");
    Route::get('rainyunrcs/product/:product_id/os_templates', "\\server\\rainyunrcs\\controller\\home\\ProductController@getOsTemplates");

})->allowCrossDomain([
    'Access-Control-Allow-Origin'        => $origin,
    'Access-Control-Allow-Credentials'   => 'true',
    'Access-Control-Max-Age'             => 600,
])->middleware(\app\http\middleware\Check::class);

// 前台需要登录
Route::group('console/v1',function (){
    Route::get('rainyunrcs/host', "\\server\\rainyunrcs\\controller\\home\\HostController@hostList");

    Route::get('rainyunrcs/host/:host_id/configoption', "\\server\\rainyunrcs\\controller\\home\\HostController@detail");

    Route::get('rainyunrcs/host/:host_id/configoption/area', "\\server\\rainyunrcs\\controller\\home\\HostController@clientAreaOutput");
    Route::post('rainyunrcs/host/:host_id/configoption/chart', "\\server\\rainyunrcs\\controller\\home\\HostController@chartData");
    Route::post('rainyunrcs/host/:host_id/provision/status', "\\server\\rainyunrcs\\controller\\home\\HostController@provisionFuncStatus");
    Route::post('rainyunrcs/host/:host_id/provision/:func', "\\server\\rainyunrcs\\controller\\home\\HostController@provisionFunc")->middleware(\app\http\middleware\CheckClientOperatePassword::class);
    Route::get('rainyunrcs/host/:host_id/upgrade', "\\server\\rainyunrcs\\controller\\home\\HostController@upgradePage");

    Route::post('rainyunrcs/host/:host_id/upgrade', "\\server\\rainyunrcs\\controller\\home\\HostController@upgrade");

    Route::get('rainyunrcs/host/:host_id/upgrade_config', "\\server\\rainyunrcs\\controller\\home\\HostController@upgradeConfigPage");

    Route::post('rainyunrcs/host/:host_id/upgrade_config', "\\server\\rainyunrcs\\controller\\home\\HostController@upgradeConfig");

    Route::get('rainyunrcs/host/:host_id/renew', "\\server\\rainyunrcs\\controller\\home\\HostController@renewPage");

    // NAT转发管理
    Route::get('rainyunrcs/host/:host_id/nat', "\\server\\rainyunrcs\\controller\\home\\HostController@natList");
    Route::post('rainyunrcs/host/:host_id/nat', "\\server\\rainyunrcs\\controller\\home\\HostController@natAdd");
    Route::delete('rainyunrcs/host/:host_id/nat/:nat_id', "\\server\\rainyunrcs\\controller\\home\\HostController@natDel");
})->allowCrossDomain([
    'Access-Control-Allow-Origin'        => $origin,
    'Access-Control-Allow-Credentials'   => 'true',
    'Access-Control-Max-Age'             => 600,
])->middleware(\app\http\middleware\CheckHome::class)
    ->middleware(\app\http\middleware\ParamFilter::class)
    ->middleware(\app\http\middleware\RejectRepeatRequest::class);

Route::group('console/v1',function (){
    Route::post('rainyunrcs/host/:host_id/sync_upgrade_price', "\\server\\rainyunrcs\\controller\\home\\HostController@syncUpgradePrice");
    Route::post('rainyunrcs/host/:host_id/sync_upgrade_config_price', "\\server\\rainyunrcs\\controller\\home\\HostController@syncUpgradeConfigPrice");
})->allowCrossDomain([
    'Access-Control-Allow-Origin'        => $origin,
    'Access-Control-Allow-Credentials'   => 'true',
    'Access-Control-Max-Age'             => 600,
])->middleware(\app\http\middleware\CheckHome::class)
    ->middleware(\app\http\middleware\ParamFilter::class);

Route::group(DIR_ADMIN . '/v1',function (){
    Route::get('rainyunrcs/product_config/:product_id', "\\server\\rainyunrcs\\controller\\admin\\ProductConfigController@getConfig");

    // 保存产品配置
    Route::post('rainyunrcs/product_config', "\\server\\rainyunrcs\\controller\\admin\\ProductConfigController@saveConfig");
})->allowCrossDomain([
    'Access-Control-Allow-Origin'        => $origin,
    'Access-Control-Allow-Credentials'   => 'true',
    'Access-Control-Max-Age'             => 600,
])
    ->middleware(\app\http\middleware\CheckAdmin::class)
    ->middleware(\app\http\middleware\ParamFilter::class);