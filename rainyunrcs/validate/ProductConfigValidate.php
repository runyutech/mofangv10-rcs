<?php
namespace server\rainyunrcs\validate;

use think\Validate;

class ProductConfigValidate extends Validate
{
    protected $rule = [
        'product_id' => 'require|integer|between:1,999999',
        'price_rate' => 'require|float|between:0,1000',
    ];

    protected $message = [
        'product_id.require' => 'product_id_tip',
        'product_id.integer' => 'verify_int',
        'product_id.between' => 'verify_int_range',
        'price_rate.require' => 'price_rate_tip',
        'price_rate.float' => 'verify_decimal',
        'price_rate.between' => 'price_rate_range',
    ];

    protected $scene = [
        'save' => ['product_id', 'price_rate'],
    ];
}