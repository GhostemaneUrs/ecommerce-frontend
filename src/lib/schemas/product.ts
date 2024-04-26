import { object, string, number, boolean, type InferType } from 'yup';

export const ProductSchema = object({
  id: string().optional(),
  name: string().required('Product name is required'),
  description: string()
    .required('Product description is required')
    .min(80, 'Description must be at least 80 characters'),
  price: number()
    .required('Product price is required')
    .min(50, 'Price must be greater than 50'),
  stock: number()
    .required('Product stock is required')
    .min(1, 'Price must be greater than 0'),
  category: string().required('Product category is required'),
  image: string().required('Product image is required'),
  active: boolean().optional(),
  reference: string().optional(),
});

export const DeleteProductSchema = object({
  id: string().required('Product id is required'),
});

export type Product = InferType<typeof ProductSchema>;
