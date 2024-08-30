import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Pagination from "@/components/list/pagination";
import Search from "@/components/list/search";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface DataTableProps<T> {
    data: T[];
    columns: { key: keyof T; header: string }[];
    onUpdate: (id: number) => void;
    onDelete: (id: number) => void;
    onResetPassword?: (id: number) => void;
    onDetails: (id: number) => void;
    onBan?: (id: number) => void;
    onSearchChange?: (query: string) => void;
    onPageChange?: (page: number) => void;
    totalCount: number;
    itemsPerPage?: number;
    searchPlaceholder?: string;
    advancedFilters?: React.ReactNode;
    getColumnValue?: (data: T, column: { key: keyof T; header: string, render?: (data: T) => any }) => any;
}

export default function DataTable<T extends { id: number }>({
                                                                data,
                                                                columns,
                                                                onUpdate,
                                                                onDelete,
                                                                onResetPassword,
                                                                onDetails,
                                                                onBan,
                                                                onSearchChange,
                                                                onPageChange,
                                                                totalCount,
                                                                itemsPerPage = 10,
                                                                searchPlaceholder = "Search...",
                                                                advancedFilters,
                                                                getColumnValue = (data, column) => data[column.key],
                                                            }: DataTableProps<T>) {
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: keyof T) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleSearchChange = (query: string) => {
        onSearchChange?.(query);
    };

    const handlePageChange = (page: number) => {
        onPageChange?.(page);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Search placeholder={searchPlaceholder} onSearch={handleSearchChange} />
                {advancedFilters}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key as string}
                                onClick={() => handleSort(column.key)}
                            >
                                {column.header}
                                {sortColumn === column.key ? (
                                    sortDirection === "asc" ? (
                                        <ChevronUp className="inline ml-1" />
                                    ) : (
                                        <ChevronDown className="inline ml-1" />
                                    )
                                ) : (
                                    <ChevronsUpDown className="inline ml-1" />
                                )}
                            </TableHead>
                        ))}
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} onClick={() => onDetails(item.id)} style={{cursor: 'pointer'}}>
                            {columns.map((column) => (
                                <TableCell key={column.key as string}>
                                    {String(getColumnValue(item, column))}
                                </TableCell>
                            ))}
                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">Actions</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => onUpdate(item.id)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(item.id)}>
                                            Delete
                                        </DropdownMenuItem>
                                        {onResetPassword && (
                                            <DropdownMenuItem onClick={() => onResetPassword(item.id)}>
                                                Reset Password
                                            </DropdownMenuItem>
                                        )}
                                        {onBan && (
                                            <DropdownMenuItem onClick={() => onBan(item.id)}>
                                                Ban
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => onDetails(item.id)}>
                                            Details
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination
                count={totalCount}
                itemsName="items"
                totalCount={totalCount}
                onPageChange={handlePageChange}
            />
        </div>
    );
}