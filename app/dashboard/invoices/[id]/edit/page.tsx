import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation'; //importación de notFound
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';

export default async function Page(props: {params: Promise<{id: string}>}) { //se obtiene el id de la invoice
    const params = await props.params; //se obtiene el id de la invoice
    const id = params.id; //se obtiene el id de la invoice
    const [invoice, customers] = await Promise.all([ //se obtienen la invoice y los customers
        fetchInvoiceById(id), //se obtiene la invoice
        fetchCustomers(), //se obtienen los customers
    ]);

    if(!invoice){
        notFound(); //código agregado de notFound para mostrar el componente en caso de que no exista la factura buscada.
    }
    return(
        <main>
            <Breadcrumbs
            breadcrumbs={[
                {label: 'Invoices',href: '/dashboard/invoices'},
                {
                    label: 'Edit Invoice',
                    href: `/dashboard/invoices/${id}/edit`,
                    active: true,
                },
            ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    )
}