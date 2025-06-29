import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Megaphone, Plus, Trash2, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Food',
    href: '/foods',
  },
];

interface Foods {
  id: number,
  thumbnail: string | null,
  name: string,
  price: number
}

interface PaginatedFoods {
  data: Foods[];
  current_page: number;
  last_page: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface PageProps {
  flash: {
    message?: string;
  };
  foods: PaginatedFoods;
}

// Helper untuk format ke rupiah
const rupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

export default function Index() {

  const { foods, flash } = usePage().props as PageProps;

  const [showAlert, setShowAlert] = useState<boolean>(!!flash.message);

  const [foodToDelete, setFoodToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (flash.message) {
      const timer = setTimeout(() => setShowAlert(false), 5000); // 5 detik
      return () => clearTimeout(timer);
    }
  }, [flash.message]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Food" />
      <p className="pl-4 pt-4">Tambahkan menu makanan yang ada di resto</p>
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <Link href={route('foods.create')}><Button className="m-4 cursor-pointer"><Plus />Tambah Menu</Button></Link>
          <div className="m-4">
            <div>
              {showAlert && flash.message && (
                <Alert className="transition-opacity duration-500 ease-in-out">
                  <Megaphone className="h-5 w-5" />
                  <AlertTitle>Notification!</AlertTitle>
                  <AlertDescription>
                    {flash.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {foods.data.length > 0 && (
              <div className="m-4">
                <Table>
                  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">#</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-center">Foto</TableHead>
                      <TableHead className="text-center">Harga</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foods.data.map((food, index) => (
                      <TableRow key={food.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{food.name}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {food.thumbnail ? <img src={food.thumbnail} alt={food.name} className="h-12 w-12 object-cover rounded" /> : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{rupiah(food.price)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Link href={route('foods.edit', food.slug)}>
                              <Button className="cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90 hover:bg-blue-400">
                                <SquarePen size={16} />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  className="cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90 hover:bg-red-400"
                                  onClick={() => setFoodToDelete(food.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Yakin ingin menghapus menu {food.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Menu yang dihapus tidak bisa dikembalikan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="cursor-pointer"
                                    onClick={() => {
                                      if (foodToDelete) {
                                        router.delete(route('foods.destroy', foodToDelete), {
                                          preserveScroll: true,
                                        });
                                      }
                                    }}
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <Pagination className="flex justify-end mt-4">
                  <PaginationContent>
                    {foods.links.map((link, index) => {
                      if (link.label.includes('Previous')) {
                        return (
                          <PaginationItem key={index}>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (link.url) router.visit(link.url)
                              }}
                              className={!link.url ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        )
                      }

                      if (link.label.includes('Next')) {
                        return (
                          <PaginationItem key={index}>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (link.url) router.visit(link.url)
                              }}
                              className={!link.url ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        )
                      }

                      if (link.label === "...") {
                        return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }

                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            isActive={link.active}
                            onClick={(e) => {
                              e.preventDefault()
                              if (link.url) router.visit(link.url)
                            }}
                          >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                  </PaginationContent>
                </Pagination>

              </div>
            )}
          </div >
        </div >
      </div >
    </AppLayout >
  );
}