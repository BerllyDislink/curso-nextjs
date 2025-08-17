'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache'; //revalidar la ruta para que se actualice la pagina
import { redirect } from 'next/navigation'; //redirigir a la pagina de facturas
import postgres from 'postgres'; //importar postgres

const sql = postgres(process.env.POSTGRES_URL!, {ssl: require}); //conectar a la base de datos

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),

})

const CreateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData){
const {customerId, amount,status} = CreateInvoice.parse({
    
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
   
});


const amountInCents = amount * 100;
const date = new Date().toISOString().split('T')[0];

try{ //se hace uso de try/catch para manejar los posibles errores
  await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
}
catch(error){
  console.error(error);
}
   


revalidatePath('/dashboard/invoices'); //revalidar la ruta para que se actualice la pagina
redirect('/dashboard/invoices'); //redirigir a la pagina de facturas

}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try{ //se hace uso de try/catch para manejar los posibles errores
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  }
  catch(error){
    console.error(error);
  }
  
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string, formData?: FormData){
  

  await sql `DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices'); //revalida el valor y lo actualiza en el cliente.
}