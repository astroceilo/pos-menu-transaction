import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { NumericFormat } from 'react-number-format';
import { Megaphone } from 'lucide-react';

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
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
}



export default function Transaction() {

    const { data, setData, post, processing, errors, reset } = useForm({
        items: [] as { food_id: number; quantity: number; price: number }[],
        paid_amount: 0,
    });

    const [bayarInput, setBayarInput] = useState("");

    const [lastTransaction, setLastTransaction] = useState(null);

    const [showAlert, setShowAlert] = useState(false);

    const addToCart = (food: Food) => {
        const existIndex = data.items.findIndex((item) => item.food_id === food.id);
        const updatedItems = [...data.items];

        if (existIndex > -1) {
            updatedItems[existIndex].quantity += 1;
        } else {
            updatedItems.push({ food_id: food.id, quantity: 1, price: food.price });
        }

        setData("items", updatedItems);
    };

    const { foods } = usePage().props as { foods: Food[] };

    const handleIncrease = (foodId: number) => {
        const updatedItems = data.items.map((item) => {
            if (item.food_id === foodId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        setData("items", updatedItems);
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

        setData("items", updatedItems);
    };

    const total = data.items.reduce((acc, item) => {
        const food = foods.find((f) => f.id === item.food_id);
        if (!food) return acc;
        return acc + food.price * item.quantity;
    }, 0);

    const clearCart = () => {
        setData("items", []);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction" />
            <div className="flex h-full flex-1 gap-4 p-4 overflow-x-auto">
                {/* MENU DAN PESANAN */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
                    {/* Menu */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {foods.slice(0, 9).map((food) => (
                            <div key={food.id} className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-900 shadow-sm bg-white dark:bg-zinc-900 text-black dark:text-white">
                                <img src={food.thumbnail} alt={food.name} className="w-full aspect-video object-cover" />
                                <div className="flex flex-col justify-between flex-1 p-4">
                                    <div>
                                        <h3 className="font-semibold text-base">{food.name}</h3>
                                        <p className="text-sky-500 font-medium text-sm">
                                            Rp. {food.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <Button onClick={() => addToCart(food)} className="mt-4 w-full bg-zinc-700 text-white py-1.5 rounded hover:bg-zinc-800 transition cursor-pointer">
                                        + Add to Cart
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pesanan */}
                    <div className="lg:col-span-1 order-first lg:order-none bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border border-gray-200 dark:border-zinc-900 min-w-[250px]">
                        <h2 className="text-lg font-bold mb-4">🧾 Pesanan</h2>
                        {data.items.map((item) => {
                            const food = foods.find((f) => f.id === item.food_id);
                            if (!food) return null;
                            return (
                                <div key={food.id} className="flex items-center mb-4">
                                    <img
                                        src={food.thumbnail}
                                        alt={food.name}
                                        className="w-12 h-12 object-cover rounded-xl"
                                    />
                                    <div className="ml-2 flex justify-between items-center w-full">
                                        <p className="text-sm font-semibold">{food.name}</p>
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => handleDecrease(item.food_id)}
                                                className="bg-gray-200 dark:bg-zinc-700 px-2 rounded cursor-pointer"
                                            >-</button>
                                            <p className="text-sm font-semibold">{item.quantity}</p>
                                            <button
                                                onClick={() => handleIncrease(item.food_id)}
                                                className="bg-gray-200 dark:bg-zinc-700 px-2 rounded cursor-pointer"
                                            >+</button>
                                            <p className="text-sm font-semibold text-sky-600">
                                                <strong>{rupiah(item.quantity * food.price)}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <Button className="w-full py-2 bg-transparent border border-red-400 text-red-500 rounded hover:bg-red-100 mb-2 cursor-pointer" disabled={data.items.length === 0} onClick={clearCart}>
                            Clear Cart
                        </Button>
                        <div className="flex gap-2 mb-2">
                            <Button
                                className="w-1/2 bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 cursor-pointer"
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
                                <Alert className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md shadow-lg transition-opacity duration-500 ease-in-out">
                                    <Megaphone className="h-5 w-5" />
                                    <AlertTitle>Notification!</AlertTitle>
                                    <AlertDescription>
                                        Bill telah disimpan.
                                    </AlertDescription>
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
                                className="w-1/2 bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 cursor-pointer"
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
                                <Button className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 cursor-pointer" disabled={data.items.length === 0}>
                                    Charge {rupiah(total)}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 md:px-6 mx-auto">
                                <DialogHeader>
                                    <DialogTitle>Detail Pesanan</DialogTitle>
                                </DialogHeader>

                                <div className="flex flex-col md:flex-row gap-6">
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
                                                            <TableCell>{food.name} x{item.quantity}</TableCell>
                                                            <TableCell>
                                                                <div className="flex justify-center">
                                                                    {food.thumbnail ? <img src={food.thumbnail} alt={food.name} className="h-12 w-12 object-cover rounded" /> : '-'}
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
                                    <div className="w-full md:w-1/3 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-4">
                                        <div className="mb-4">
                                            <label className="block mb-1 font-medium">Uang Pembeli (Rp)</label>
                                            <NumericFormat
                                                value={data.paid_amount}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                // prefix="Rp "
                                                onValueChange={(values) => {
                                                    const { floatValue } = values;
                                                    setData('paid_amount', floatValue || 0);
                                                }}
                                                className="border p-2 rounded w-full"
                                            />
                                        </div>

                                        <div className="flex justify-between gap-2">
                                            <DialogClose asChild>
                                                <Button variant="outline" className="w-full cursor-pointer">Close</Button>
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
                                                    // });
                                                    post('/transactions', {
                                                        onSuccess: (page) => {
                                                            const transactionId = page.props.last_transaction_id;
                                                            reset();
                                                            router.visit(route('transactions.show', transactionId)); // redirect ke halaman print
                                                        },
                                                    });
                                                }}
                                                className="w-full bg-sky-500 text-white hover:bg-sky-600 cursor-pointer">
                                                Pay!
                                            </Button>
                                        </div>

                                        <div className="mt-3 text-sm text-red-600 font-semibold">
                                            {data.paid_amount === 0 ? (
                                                <span className="text-gray-500">Masukkan nominal uang pembeli</span>
                                            ) : data.paid_amount < total ? (
                                                <span className="text-red-600">Uang yang dibayarkan kurang dari total belanja</span>
                                            ) : data.paid_amount == total ? (
                                                <span className="text-green-600">Uang yang dibayarkan sesuai dari total belanja</span>
                                            ) : (
                                                <span className="text-green-600">
                                                    Kembalian: {rupiah(data.paid_amount - total)}
                                                </span>
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
