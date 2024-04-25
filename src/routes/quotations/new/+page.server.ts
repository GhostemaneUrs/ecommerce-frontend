import { error, fail } from '@sveltejs/kit';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import type { Message } from '$lib/schemas/superForms';
import { superValidate } from 'sveltekit-superforms/server';
import { QuotationSchema } from '$lib/schemas/quotation';
import { yup } from 'sveltekit-superforms/adapters';
import { APP_URL } from '$lib/utils/constants.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
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

	return {
		users: await getUsers(),
		products: await getProducts(),
		form: await superValidate(yup(QuotationSchema))
	};
};

export const actions = {
	createQuotation: async (event) => {
		const success_alert = {
			_id: '',
			message: 'Quotation created successfully.'
		};
		try {
			const form = await superValidate(event.request, yup(QuotationSchema));

			if (!form.valid) {
				const message: Message = {
					type: 'error',
					message: 'All fields are required. Please fill in all fields.'
				};
				setFlash(message, event);
				return fail(400, { form });
			}

			const { data, statusCode, message } = await fetch(`${APP_URL}/api/quotations`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_id: form.data.user_id.value,
					product_id: form.data.product_id.value,
					quantity: form.data.quantity
				})
			}).then((res) => res.json());

			if (statusCode === 400) {
				const alert: Message = {
					type: 'error',
					message: message
				};
				setFlash(alert, event);
				return fail(400, { form });
			}

			success_alert._id = data.id;
		} catch (error) {
			console.log(error);
		}

		throw redirect(
			303,
			`/quotations/${success_alert._id}`,
			{
				type: 'success',
				message: success_alert.message
			},
			event
		);
	}
};
