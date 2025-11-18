import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Page } from '@inertiajs/core';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaction',
        href: '/transactions',
    },
];

interface Food {
    id: number;
    name: string;
    price: number;
    thumbnail: string;
}

// Helper untuk format ke rupiah
const rupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function Transaction() {
    const { data, setData, post, reset } = useForm({
        items: [] as { food_id: number; quantity: number; price: number }[],
        paid_amount: 0,
    });

    const [bayarInput, setBayarInput] = useState('');

    interface Transaction {
        id: number | string;
        // add other properties if needed
    }
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

    const [showAlert, setShowAlert] = useState(false);

    const addToCart = (food: Food) => {
        const existIndex = data.items.findIndex((item) => item.food_id === food.id);
        const updatedItems = [...data.items];

        if (existIndex > -1) {
            updatedItems[existIndex].quantity += 1;
        } else {
            updatedItems.push({ food_id: food.id, quantity: 1, price: food.price });
        }

        setData('items', updatedItems);
    };

    const { foods = [] } = usePage<{ foods: Food[] }>().props;

    const handleIncrease = (foodId: number) => {
        const updatedItems = data.items.map((item) => {
            if (item.food_id === foodId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        setData('items', updatedItems);
    };

    const handleDecrease = (foodId: number) => {
        const updatedItems = data.items
            .map((item) => {
                if (item.food_id === foodId) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            })
            .filter((item) => item.quantity > 0); // otomatis hapus dari keranjang kalau qty = 0

        setData('items', updatedItems);
    };

    const total = data.items.reduce((acc, item) => {
        const food = foods.find((f) => f.id === item.food_id);
        if (!food) return acc;
        return acc + food.price * item.quantity;
    }, 0);

    const clearCart = () => {
        setData('items', []);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction" />
            <div className="flex h-full flex-1 gap-4 overflow-x-auto p-4">
                {/* MENU DAN PESANAN */}
                <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-4">
                    {/* Menu */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
                        {foods.slice(0, 9).map((food) => (
                            <div
                                key={food.id}
                                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-black shadow-sm dark:border-zinc-900 dark:bg-zinc-900 dark:text-white"
                            >
                                <img src={food.thumbnail} alt={food.name} className="aspect-video w-full object-cover" />
                                <div className="flex flex-1 flex-col justify-between p-4">
                                    <div>
                                        <h3 className="text-base font-semibold">{food.name}</h3>
                                        <p className="text-sm font-medium text-sky-500">Rp. {food.price.toLocaleString()}</p>
                                    </div>
                                    <Button
                                        onClick={() => addToCart(food)}
                                        className="mt-4 w-full cursor-pointer rounded bg-zinc-700 py-1.5 text-white transition hover:bg-zinc-800"
                                    >
                                        + Add to Cart
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pesanan */}
                    <div className="order-first min-w-[250px] rounded-xl border border-gray-200 bg-white p-4 shadow lg:order-none lg:col-span-1 dark:border-zinc-900 dark:bg-zinc-900">
                        <h2 className="mb-4 text-lg font-bold">🧾 Pesanan</h2>
                        {data.items.map((item) => {
                            const food = foods.find((f) => f.id === item.food_id);
                            if (!food) return null;
                            return (
                                <div key={food.id} className="mb-4 flex items-center">
                                    <img src={food.thumbnail} alt={food.name} className="h-12 w-12 rounded-xl object-cover" />
                                    <div className="ml-2 flex w-full items-center justify-between">
                                        <p className="text-sm font-semibold">{food.name}</p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDecrease(item.food_id)}
                                                className="cursor-pointer rounded bg-gray-200 px-2 dark:bg-zinc-700"
                                            >
                                                -
                                            </button>
                                            <p className="text-sm font-semibold">{item.quantity}</p>
                                            <button
                                                onClick={() => handleIncrease(item.food_id)}
                                                className="cursor-pointer rounded bg-gray-200 px-2 dark:bg-zinc-700"
                                            >
                                                +
                                            </button>
                                            <p className="text-sm font-semibold text-sky-600">
                                                <strong>{rupiah(item.quantity * food.price)}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <Button
                            className="mb-2 w-full cursor-pointer rounded border border-red-400 bg-transparent py-2 text-red-500 hover:bg-red-100"
                            disabled={data.items.length === 0}
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                        <div className="mb-2 flex gap-2">
                            <Button
                                className="w-1/2 cursor-pointer rounded bg-emerald-500 py-2 text-white hover:bg-emerald-600"
                                disabled={data.items.length === 0}
                                onClick={() => {
                                    // Simpan bill ke database/localStorage dsb...
                                    setShowAlert(true);
                                    setTimeout(() => setShowAlert(false), 5000); // Auto-hide alert setelah 5 detik
                                }}
                            >
                                Save Bill
                            </Button>

                            {/* Alert Bill */}
                            {showAlert && (
                                <Alert className="fixed top-20 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 transform shadow-lg transition-opacity duration-500 ease-in-out">
                                    <Megaphone className="h-5 w-5" />
                                    <AlertTitle>Notification!</AlertTitle>
                                    <AlertDescription>Bill telah disimpan.</AlertDescription>
                                </Alert>
                            )}

                            {/* <Button className="w-1/2 bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 cursor-pointer"
                                disabled={!lastTransaction}
                                onClick={() => {
                                    if (!lastTransaction) return;
                                    // Cetak bill (bisa redirect ke halaman /cetak atau window.print)
                                    console.log("Print Bill:", lastTransaction);
                                    // alert("Mencetak bill...");
                                }}
                            >
                                Print Bill</Button> */}

                            <Button
                                className="w-1/2 cursor-pointer rounded bg-emerald-500 py-2 text-white hover:bg-emerald-600"
                                disabled={!lastTransaction}
                                onClick={() => {
                                    if (!lastTransaction) return;

                                    // Redirect ke halaman struk berdasarkan ID transaksi terakhir
                                    router.visit(route('transactions.show', lastTransaction.id));
                                }}
                            >
                                Print Bill
                            </Button>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full cursor-pointer rounded bg-sky-500 py-2 text-white hover:bg-sky-600"
                                    disabled={data.items.length === 0}
                                >
                                    Charge {rupiah(total)}
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                className="mx-auto w-full max-w-[95vw] px-4 sm:max-w-2xl md:max-w-3xl md:px-6 lg:max-w-4xl"
                                aria-describedby="payment-description"
                            >
                                <DialogHeader>
                                    <DialogTitle>Detail Pesanan</DialogTitle>
                                </DialogHeader>

                                <span id="payment-description" className="sr-only">
                                    Masukkan nominal uang pembeli dan cek rincian pesanan sebelum membayar.
                                </span>

                                <div className="flex flex-col gap-6 md:flex-row">
                                    {/* Kiri: Tabel Pesanan */}
                                    <div className="w-full md:w-2/3">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>#</TableHead>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead className="text-center">Foto</TableHead>
                                                    <TableHead className="text-right">Harga</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.items.map((item, index) => {
                                                    const food = foods.find((f) => f.id === item.food_id);
                                                    if (!food) return null;
                                                    return (
                                                        <TableRow key={food.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>
                                                                {food.name} x{item.quantity}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    {food.thumbnail ? (
                                                                        <img
                                                                            src={food.thumbnail}
                                                                            alt={food.name}
                                                                            className="h-12 w-12 rounded object-cover"
                                                                        />
                                                                    ) : (
                                                                        '-'
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">{rupiah(item.quantity * food.price)}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Kanan: Form Pembayaran */}
                                    <div className="w-full border-t pt-4 md:w-1/3 md:border-t-0 md:border-l md:pt-0 md:pl-4">
                                        <div className="mb-4">
                                            <label className="mb-1 block font-medium">Uang Pembeli (Rp)</label>
                                            <NumericFormat
                                                value={data.paid_amount}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                // prefix="Rp "
                                                onValueChange={(values) => {
                                                    const { floatValue } = values;
                                                    setData('paid_amount', floatValue || 0);
                                                }}
                                                className="w-full rounded border p-2"
                                            />
                                        </div>

                                        <div className="flex justify-between gap-2">
                                            <DialogClose asChild>
                                                <Button variant="outline" className="w-full cursor-pointer">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                onClick={() => {
                                                    // post('/transactions', {
                                                    //     preserveScroll: true,
                                                    //     onSuccess: (page) => {
                                                    //         // Simpan hasil transaksi terakhir untuk bisa digunakan oleh Print/Save Bill
                                                    //         setLastTransaction({
                                                    //             items: data.items,
                                                    //             paid_amount: data.paid_amount,
                                                    //             total,
                                                    //             change: data.paid_amount - total,
                                                    //             timestamp: new Date().toISOString(),
                                                    //         });

                                                    //         reset();
                                                    //         setBayarInput("");
                                                    //     },
                                                    post('/transactions', {
                                                        onSuccess: (page: Page) => {
                                                            const transactionId = (page.props as { last_transaction_id?: number | string })
                                                                .last_transaction_id;
                                                            reset();
                                                            if (typeof transactionId === 'number' || typeof transactionId === 'string') {
                                                                const url = `/transactions/${transactionId}`;
                                                                router.visit(url); // redirect ke halaman print
                                                            }
                                                        },
                                                    });
                                                }}
                                                className="w-full cursor-pointer bg-sky-500 text-white hover:bg-sky-600"
                                            >
                                                Pay!
                                            </Button>
                                        </div>

                                        <div className="mt-3 text-sm font-semibold text-red-600">
                                            {data.paid_amount === 0 ? (
                                                <span className="text-gray-500">Masukkan nominal uang pembeli</span>
                                            ) : data.paid_amount < total ? (
                                                <span className="text-red-600">Uang yang dibayarkan kurang dari total belanja</span>
                                            ) : data.paid_amount == total ? (
                                                <span className="text-green-600">Uang yang dibayarkan sesuai dari total belanja</span>
                                            ) : (
                                                <span className="text-green-600">Kembalian: {rupiah(data.paid_amount - total)}</span>
                                            )}
                                            {/* Kembalian : {rupiah(Math.max(0, data.paid_amount - total))} */}
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
