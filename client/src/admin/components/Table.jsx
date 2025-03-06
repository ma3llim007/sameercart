import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Table as CnTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ImSortAmountDesc, ImSortAmountAsc } from "react-icons/im";
import Loading from "./Loading";
import Input from "@/components/Form/Input";

const Table = ({ columns, data, paginationOptions = { pageSize: 10 }, sortable = true, loading = false, emptyMessage = "No Data Available" }) => {
    // State for global search filter
    const [globalFilter, SetGlobalFilter] = useState("");
    // State for pagination page size
    const [pageSize, SetPageSize] = useState(paginationOptions.pageSize);
    // Memoized columns and data for performance optimization
    const columnsMemo = useMemo(() => columns, [columns]);
    const dataMemo = useMemo(() => data, [data]);

    // Filtered data based on global search input
    const filteredData = useMemo(() => {
        return dataMemo.filter(row => {
            return columnsMemo.some(column => {
                const cellValue = row[column.accessorKey];
                return typeof cellValue === "string" && cellValue.toLowerCase().includes(globalFilter.toLowerCase());
            });
        });
    }, [dataMemo, globalFilter, columnsMemo]);

    // Set up the React Table instance
    const table = useReactTable({
        columns: columnsMemo,
        data: filteredData,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: sortable ? getSortedRowModel() : undefined,
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize },
            globalFilter: "",
        },
        state: {
            globalFilter,
        },
    });

    // Pagination details
    const { pageIndex } = table.getState().pagination;
    const rowCount = table.getFilteredRowModel().rows.length;
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min(startRow + pageSize - 1, rowCount);

    if (loading) {
        return <Loading />;
    }
    if (data?.length === 0) {
        return (
            <div className="text-center px-4 py-8">
                <h3 className="text-3xl font-bold underline">{emptyMessage}</h3>
            </div>
        );
    }
    return (
        <div className="w-full p-4">
            {/* Show Entries and Search Inputs */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    Show{" "}
                    <select
                        value={pageSize}
                        onChange={e => {
                            SetPageSize(Number(e.target.value));
                            table.setPageSize(Number(e.target.value));
                        }}
                        className={`mx-2 p-1 border rounded-md focus:outline-none bg-white text-gray-900 border-gray-500 
                            dark:bg-gray-800 dark:text-white dark:border-gray-700
                            transition duration-200 ease-in-out`}
                    >
                        {[10, 20, 30, 40, 50, 100].map(size => (
                            <option className="text-base text-inherit" key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    Entries
                </div>
                <div className="w-96 flex justify-center items-center">
                    <p className="text-lg font-bold">Search:</p>
                    <Input type="text" value={globalFilter} onChange={e => SetGlobalFilter(e.target.value)} className="ml-2 p-1 border border-gray-500" placeholder="Search..." />
                </div>
            </div>
            <CnTable className="shadow-sm border border-gray-500 border-opacity-25 rounded-lg">
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead
                                    key={header.id}
                                    onClick={() => {
                                        const currentSort = header.column.getIsSorted();
                                        header.column.toggleSorting(currentSort === "asc");
                                    }}
                                    className={`py-2 border border-gray-500 border-opacity-25 select-none font-bold text-base ${sortable ? "cursor-pointer" : ""}`}
                                >
                                    <div className="w-full flex items-center p-1 justify-between">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {sortable && (
                                            <>
                                                <span className="ml-1">{header.column.getIsSorted() === "desc" ? <ImSortAmountDesc /> : <ImSortAmountAsc />}</span>
                                            </>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={table.getAllColumns().length} className="p-3 text-center border border-gray-300 border-opacity-20">
                                <h5 className="text-lg font-bold">{emptyMessage}</h5>
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <TableRow
                                key={row.id}
                                className={
                                    row.index % 2 === 0
                                        ? "bg-white dark:bg-slate-900 hover:bg-gray-200 hover:dark:bg-gray-700"
                                        : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 hover:dark:bg-gray-600"
                                }
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} className="p-3 border border-gray-300 border-opacity-20">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </CnTable>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-base">
                    Showing {startRow} to {endRow} of {rowCount} entries
                </div>
                {/* Page Navigation */}
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Table;
