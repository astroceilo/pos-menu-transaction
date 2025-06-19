import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert } from 'lucide-react';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Food',
        href: '/foods/create',
    },
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

export default function Index() {

    const { data, setData, post, processing, errors, reset } = useForm({
        thumbnail: null as File | null,
        name: '',
        price: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('foods.store'), {
            forceFormData: true,
            onSuccess: () => {
                // console.log("Form submitted");
                reset();
            },
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('thumbnail', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambahkan Menu" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <p className="pl-4 pt-4 text-blue-500 font-bold">Tambahkan menu</p>
                    <div className="w-full p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Display Error */}

                            {Object.keys(errors).length > 0 && (
                                <Alert variant="default | destructive" className="mb-2">
                                    <CircleAlert />
                                    <AlertTitle>Errors!</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="gap-1.5 mb-2">
                                <Label htmlFor="food thumbnail">Foto Makanan</Label>
                                <Input
                                    className="mt-2"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg*"
                                    onChange={handleFileUpload}
                                    tabIndex={2}
                                ></Input>
                                <ul>
                                    <li className="text-sm mt-1 text-red-500">* Ukuran maksimal file 2MB.</li>
                                    <li className="text-sm text-red-500">* Format file harus jpeg, png, atau jpg.</li>
                                </ul>
                            </div>
                            <div className="gap-1.5 mb-2">
                                <Label htmlFor="food name">Nama Makanan</Label>
                                <Input
                                    className="mt-2"
                                    placeholder="Masukkan nama makanan"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoFocus
                                    tabIndex={1}
                                ></Input>
                            </div>
                            <div className="gap-1.5 mb-2">
                                <Label htmlFor="food price">Harga Makanan</Label>
                                <div className="flex mt-2">
                                    <span className="inline-flex items-center px-3 rounded-l-md bg-sky-500 text-white">
                                        Rp.
                                    </span>
                                    <Input
                                        className="flex-1 block w-full rounded-none rounded-r-md p-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Masukkan harga"
                                        value={formatRupiah(data.price)}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, ""); // Hanya angka
                                            setData("price", raw);  // Simpan angka mentah tanpa titik
                                        }}
                                        tabIndex={3}
                                    ></Input>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button type="submit" className="cursor-pointer bg-green-500 hover:bg-green-400 px-8" tabIndex={4}>Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </AppLayout >
    );
}