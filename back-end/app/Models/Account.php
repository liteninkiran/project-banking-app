<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory;

    protected $table = 'accounts';

    protected $fillable = [
        'account_name',
        'account_number',
        'sort_code',
    ];

    public $timestamps = true;
}
