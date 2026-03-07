<?php

namespace App\Services;

// Core
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Models
use App\Models\Transaction;
use App\Models\Account;
use App\Models\TransactionType;

class TransactionImportService
{
    private $lookup;
    private $attrs;

    public function import(Collection $transactions): Collection
    {
        $imported = collect();

        DB::transaction(function () use ($transactions, &$imported) {

            $transactions->each(function ($tx) use (&$imported) {

                $this->setAttributes(
                    $tx['account_number'],
                    $tx['account_name']
                );

                // 1️⃣ Find or create account
                $account = Account::firstOrCreate($this->lookup, $this->attrs);

                // 2️⃣ Lookup transaction type
                $trType = TransactionType::where('code', $tx['type'])->first();
                if (!$trType) {
                    throw new \Exception("Transaction type '{$tx['type']}' not found.");
                }

                // 3️⃣ Create transaction
                $date = Carbon::createFromFormat('d/m/Y', $tx['date'])->startOfDay();
                $isRowAdded = Transaction::insertOrIgnore([
                    'date' => $date,
                    'amount' => $tx['value'],
                    'balance' => $tx['balance'],
                    'description' => $tx['description'],
                    'account_id' => $account->id,
                    'transaction_type_id' => $trType->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $imported->push($isRowAdded);
            });

        });

        return $imported;
    }

    private function setAttributes(string $account, string $name)
    {
        if (str_starts_with($account, "'")) {
            $account = substr($account, 1);
        }

        [$sortCode, $accountNumber] = explode('-', $account);

        $this->lookup = [
            'account_number' => $accountNumber,
        ];

        $this->attrs = [
            'account_name' => $name,
            'sort_code' => $sortCode,
        ];
    }
}
