<?php

namespace App\Services;

// Core
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

// Models
use App\Models\Transaction;
use App\Models\Account;
use App\Models\TransactionType;

class TransactionImportService
{
    private Account $account;
    private Collection $imported;
    private Collection $transactions;

    public function import(Collection $transactions): Collection
    {
        $this->imported = collect();
        $this->transactions = $transactions;

        DB::transaction(fn () => $this->useTransaction());

        return $this->imported;
    }

    private function useTransaction() {
        // 1️⃣ Find or create account
        $this->setAccount(
            $this->transactions[0]['account_number'],
            $this->transactions[0]['account_name']
        );

        $this->transactions->each(fn ($tr) => $this->createTransaction($tr));
    }

    private function createTransaction($transaction) {
        // 2️⃣ Lookup transaction type
        $trType = TransactionType::where('code', $transaction['type'])->first();
        if (!$trType) {
            throw new Exception("Transaction type '{$transaction['type']}' not found.");
        }

        // 3️⃣ Create transaction
        $date = Carbon::createFromFormat('d/m/Y', $transaction['date'])->startOfDay();
        $isRowAdded = Transaction::insertOrIgnore([
            'date' => $date,
            'amount' => $transaction['value'],
            'balance' => $transaction['balance'],
            'description' => $transaction['description'],
            'account_id' => $this->account->id,
            'transaction_type_id' => $trType->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->imported->push($isRowAdded);
    }

    private function setAccount(string $account, string $name)
    {
        if (str_starts_with($account, "'")) {
            $account = substr($account, 1);
        }

        [$sortCode, $accountNumber] = explode('-', $account);

        $lookup = [
            'account_number' => $accountNumber,
        ];

        $attrs = [
            'account_name' => $name,
            'sort_code' => $sortCode,
        ];

        $this->account = Account::firstOrCreate($lookup, $attrs);
    }
}
