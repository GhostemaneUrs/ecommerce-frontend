import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { QuotationSchema } from '$lib/schemas/quotation';
import { yup } from 'sveltekit-superforms/adapters';
import { APP_URL } from '$lib/utils/constants.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const getUsers = async () => {
		try {
			const { statusCode, data, message } = await fetch(`${APP_URL}/api/users`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}).then((res) => res.json());

			if (statusCode !== 200)
				throw error(statusCode, `Error al cargar las cotizaciones: ${message}`);

			return data;
		} catch (e) {
			throw error(500, `Error al cargar las cotizaciones`);
		}
	};

	const getProducts = async () => {
		try {
			const { statusCode, data, message } = await fetch(`${APP_URL}/api/products`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}).then((res) => res.json());

			if (statusCode !== 200) throw error(statusCode, `Error al cargar los productos: ${message}`);

			return data.map(
				(product: { id: string; name: string; price: number; image: string; stock: number }) => {
					return {
						value: product.id,
						label: product.name,
						price: product.price,
						image: product.image,
						stock: product.stock
					};
				}
			);
		} catch (e) {
			throw error(500, `Error al cargar los productos`);
		}
	};

	const getQuotationById = async (_id: string) => {
		try {
			const { statusCode, data, message } = await fetch(`${APP_URL}/api/quotations/${_id}`, {
				method: 'GET',

				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}).then((res) => res.json());

			if (statusCode !== 200) throw error(statusCode, `Error al cargar la cotización: ${message}`);

			return data;
		} catch (e) {
			throw error(500, `Error al cargar los productos`);
		}
	};

	return {
		users: await getUsers(),
		products: await getProducts(),
		form: await superValidate(await getQuotationById(params._id), yup(QuotationSchema))
	};
};

export const actions = {};
