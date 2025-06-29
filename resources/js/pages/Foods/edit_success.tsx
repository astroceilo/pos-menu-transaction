import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Food', href: '/foods' },
];

function formatRupiah(angka: string) {
    const numberString = angka.replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substring(0, sisa);
    const ribuan = split[0].substring(sisa).match(/\d{3}/g);
    if (ribuan) {
        rupiah += (sisa ? "." : "") + ribuan.join(".");
    }
    return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
}

export default function Edit() {
    const { foods, errors } = usePage().props as any;

    const [data, setData] = useState({
        thumbnail: null as File | null,
        name: foods.name || '',
        price: foods.price.toString().replace(/\D/g, '') || '',
    });

    const [displayPrice, setDisplayPrice] = useState('');

    useEffect(() => {
        setDisplayPrice(formatRupiah(data.price));
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData({ ...data, thumbnail: e.target.files[0] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH'); // Spoof PATCH
        formData.append('name', data.name);
        formData.append('price', data.price);
        if (data.thumbnail) {
            formData.append('thumbnail', data.thumbnail);
        }

        router.post(route('foods.update', foods.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => console.log('Berhasil update!'),
            onError: (err) => console.log('Gagal update:', err),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Menu" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <p className="pl-4 pt-4 text-blue-500 font-bold">Edit Menu</p>
                    <div className="w-full p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="mb-2">
                                    <CircleAlert />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Thumbnail Upload */}
                            <div>
                                <Label htmlFor="thumbnail">Foto Makanan</Label>
                                {foods.thumbnail && (
                                    <div className="my-2">
                                        <img src={foods.thumbnail} alt={foods.name} className="w-40 h-32 object-cover rounded-md border" />
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleFileUpload}
                                    tabIndex={2}
                                />
                                <p className="text-sm text-red-500 mt-1">* Maksimal 2MB. Format jpeg, jpg, png.</p>
                            </div>

                            {/* Name */}
                            <div>
                                <Label htmlFor="name">Nama Makanan</Label>
                                <Input
                                    className="mt-2"
                                    placeholder="Masukkan nama makanan"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    autoFocus
                                    tabIndex={1}
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <Label htmlFor="price">Harga</Label>
                                <div className="flex mt-2">
                                    <span className="inline-flex items-center px-3 rounded-l-md bg-sky-500 text-white">Rp.</span>
                                    <Input
                                        className="flex-1 block w-full rounded-none rounded-r-md p-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Masukkan harga"
                                        value={displayPrice}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, "");
                                            setDisplayPrice(formatRupiah(raw));
                                            setData({ ...data, price: raw });
                                        }}
                                        tabIndex={3}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="mt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    className="cursor-pointer bg-green-500 hover:bg-green-400 px-8"
                                    tabIndex={4}
                                >
                                    Update Menu
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
