import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function Receipt() {
    const { transaction } = usePage().props as any;

    useEffect(() => {
        setTimeout(() => window.print(), 500); // Tunggu sejenak baru print
    }, []);

    return (
        <div className="p-4 max-w-md mx-auto text-sm">
            <h2 className="text-center font-bold text-lg mb-2">Struk Pembayaran</h2>
            <hr className="mb-2" />

            {transaction.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                    <span>{item.food.name} x{item.quantity}</span>
                    <span>Rp {item.subtotal.toLocaleString()}</span>
                </div>
            ))}

            <hr className="my-2" />
            <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp {transaction.total_price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span>Bayar</span>
                <span>Rp {transaction.paid_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
                <span>Kembalian</span>
                <span>Rp {transaction.change.toLocaleString()}</span>
            </div>

            <p className="text-center mt-4">~ Terima Kasih ~</p>
        </div>
    );
}