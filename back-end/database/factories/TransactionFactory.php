<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Transaction;
use App\Models\Account;
use App\Models\TransactionType;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Pick a random account and transaction type
        $account = Account::inRandomOrder()->first() ?? Account::factory()->create();
        $type = TransactionType::inRandomOrder()->first() ?? TransactionType::factory()->create();

        // Generate a random amount (positive or negative for debits/credits)
        $amount = $this->faker->randomFloat(2, 10, 5000);

        // Generate a realistic balance by adding/subtracting amount from a base
        $balance = $this->faker->randomFloat(2, 1000, 10000);

        return [
            'account_id' => $account->id,
            'transaction_type_id' => $type->id,
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'amount' => $amount,
            'balance' => $balance,
            'description' => $this->faker->sentence(3),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
