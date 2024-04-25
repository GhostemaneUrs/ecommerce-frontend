import { object, string, number, type InferType, boolean } from 'yup';

export const QuotationSchema = object({
	id: string().optional(),
	active: boolean().optional(),
	user_id: object({
		value: string().required('User id is required'),
		label: string().required('User name is required')
	}).required('User id is required'),
	quantity: number()
		.required('Product quantity is required')
		.min(1, 'Quantity must be greater than 0'),
	product_id: object({
		value: string().required('Product id is required'),
		label: string().required('Product name is required')
	}).required('Product id is required')
});

export const DeleteQuotationSchema = object({
	id: string().required('Quotation id is required')
});

export type Quotation = InferType<typeof QuotationSchema>;
