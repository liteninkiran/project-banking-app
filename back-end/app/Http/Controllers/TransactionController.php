<?php

namespace App\Http\Controllers;

// Core
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// Models
use App\Models\Transaction;

// Validation
use App\Http\Requests\MassImportTransactionRequest;

// Services
use App\Services\TransactionImportService;

class TransactionController extends Controller
{

    protected $importService;

    public function __construct(TransactionImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }

    /**
     * Mass import
     */
    public function massImport(MassImportTransactionRequest $request)
    {
        $transactions = collect($request->validated());
        $imported = $this->importService->import($transactions);

        return response()->json([
            'message' => 'Transactions imported successfully.',
            'imported' => $imported->sum(),
            'skipped' => $transactions->count() - $imported->sum(),
        ]);
    }
}
