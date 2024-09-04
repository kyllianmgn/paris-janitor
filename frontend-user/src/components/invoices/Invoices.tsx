"use client";

import {useEffect, useState} from "react";
import {invoiceService} from "@/api/services/invoiceService";
import {Download} from "lucide-react";
import Link from "next/link";

export default function Invoices() {
    const [invoices, setInvoices] = useState<any[]>([])

    const loadInvoices = async () => {
        const res = await invoiceService.getMyInvoices()
        console.log(res)
        setInvoices(res.data.data)
    }

    useEffect(() => {
        loadInvoices().then()
    }, []);


    return (<>
            <h1 className={"text-center text-2xl font-bold pb-10"}>Your Invoices</h1>
            <div className={"flex flex-col gap-2.5 my-3"}>
                <div className={"flex justify-between border-b border-gray-600"}>
                    <span>Description</span>
                    <span>Amount Paid</span>
                    <span>Date</span>
                    <span>Actions</span>
                </div>
                {
                    invoices && invoices.length > 0 && invoices.map((invoice: any) => (
                        <div className={"flex justify-between border-b border-gray-400 p-1"} key={invoice.id}>
                            <span>{invoice.lines.data[0].description}</span>
                            <span>{invoice.amount_paid / 100}€</span>
                            <span>{new Date(invoice.effective_at).toISOString()}€</span>
                            <Link href={invoice.invoice_pdf}><Download></Download></Link>
                        </div>
                    ))
                }
            </div>
        </>
    )
}