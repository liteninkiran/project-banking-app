<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TransactionType;

class TransactionTypeSeeder extends Seeder
{
    protected array $codes = [
        'ATM' => 'Automated Teller (Cash) Machine',
        'ATM RFD' => 'ATM Refund',
        'BAC' => 'Automated Credit',
        'BGC' => 'Bank Giro Credit',
        'BSP' => 'Branch Single Payment',
        'CDM' => 'Cash & Deposit Machine',
        'Charge' => 'Previously displayed as CHG',
        'CHP' => 'Payment by CHAPS transfer',
        'CHQ' => 'Cheque',
        'C/L' => 'Cashline (Cash machine / ATM withdrawal)',
        'C/R' => 'Credit Remittance',
        'CUI' => 'Centralised Unpaid In (Unpaid Cheque)',
        'CWP' => 'Cold Weather Payment',
        'D/D' => 'Direct Debit',
        'DIV' => 'Dividend',
        'DPC' => 'Direct Banking by PC (payment or transfer made using online banking)',
        'DR' => 'Account Overdrawn or Debit Item',
        'DWP' => 'Department for Work and Pensions',
        'IBP' => 'Inter-Branch Payment',
        'INT' => 'Interest',
        'ITL' => 'International',
        'NDC' => 'Non Dividend Counterfoil',
        'NO WI BON' => 'No Withdrawal Bonus',
        'N-S TRN FEE' => 'Non Sterling Transaction Fee',
        'OTR' => 'Online Banking Transaction',
        'POC' => 'Post Office Counters',
        'POS' => 'Point of Sale/Debit Card Transaction',
        'S/O' => 'Standing Order',
        'SBT' => 'Screen Based Transaction',
        'TEL' => 'Telephone Banking',
        'TFR' => 'Transfer',
        'TLR' => 'Teller Transaction',
        'VRATE' => 'Visa Payment Scheme Exchange Rate',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->codes as $code => $description) {
            TransactionType::updateOrCreate(
                ['code' => $code],
                ['description' => $description]
            );
        }
    }
}
