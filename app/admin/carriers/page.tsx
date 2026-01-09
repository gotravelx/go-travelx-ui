"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { carrierService, Carrier } from "@/services/carrierService";

export default function CarriersAdminPage() {
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredCarriers = carriers
        .filter((carrier) =>
            carrier.carrierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            carrier.carrierCode.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const isAStar = a.program === "Star Alliance";
            const isBStar = b.program === "Star Alliance";
            if (isAStar && !isBStar) return -1;
            if (!isAStar && isBStar) return 1;
            return 0;
        });

    const totalPages = Math.ceil(filteredCarriers.length / itemsPerPage);
    const paginatedCarriers = filteredCarriers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Form state
    const [formData, setFormData] = useState<Carrier>({
        carrierCode: "",
        carrierName: "",
        program: "",
    });

    const fetchCarriers = async () => {
        setIsLoading(true);
        try {
            const data = await carrierService.getAllCarriers();
            setCarriers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load carriers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCarriers();
    }, []);

    const handleOpenDialog = () => {
        setFormData({
            carrierCode: "",
            carrierName: "",
            program: "",
        });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.carrierCode || !formData.carrierName) {
            toast.error("Carrier Code and Name are required");
            return;
        }

        setIsSaving(true);
        try {
            await carrierService.createCarrier(formData);
            toast.success("Carrier added successfully");
            fetchCarriers();
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add carrier");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (code: string) => {
        try {
            await carrierService.deleteCarrier(code);
            toast.success("Carrier deleted successfully");
            fetchCarriers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete carrier");
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 mt-16">
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-2xl font-bold">Carrier Management</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative w-64 mr-2">
                            <Search className="absolute left-2 top-2.5 h-[1.3rem] w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search carriers..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-8"
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={fetchCarriers} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        </Button>
                        <Button onClick={() => handleOpenDialog()} className="gradient-border">
                            <Plus className="mr-2 h-4 w-4" /> Add Carrier
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCarriers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                No carriers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedCarriers.map((carrier) => (
                                            <TableRow key={carrier.carrierCode}>
                                                <TableCell className="font-medium">{carrier.carrierCode}</TableCell>
                                                <TableCell>{carrier.carrierName}</TableCell>
                                                <TableCell>{carrier.program}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the carrier
                                                                        <span className="font-bold"> {carrier.carrierCode} </span>
                                                                        and remove it from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(carrier.carrierCode)}
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(i + 1)}
                                                isActive={currentPage === i + 1}
                                                className="cursor-pointer"
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((p) => Math.max(1, Math.min(totalPages, p + 1)))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Carrier</DialogTitle>
                        <DialogDescription>
                            Enter the details for the airline carrier here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <Input
                                id="code"
                                value={formData.carrierCode}
                                onChange={(e) => setFormData({ ...formData, carrierCode: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. UA"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.carrierName}
                                onChange={(e) => setFormData({ ...formData, carrierName: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. United Airlines"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="program" className="text-right">
                                Program
                            </Label>
                            <Input
                                id="program"
                                value={formData.program}
                                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. Star Alliance"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
