import { error, fail } from '@sveltejs/kit';
import { APP_URL } from '$lib/utils/constants.js';
import { yup } from 'sveltekit-superforms/adapters';
import type { Message } from '$lib/schemas/superForms';
import { superValidate } from 'sveltekit-superforms/server';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { DeleteProductSchema, ProductSchema } from '$lib/schemas/product';

export const load = async ({ fetch, params }) => {
	const getProductById = async (_id: string) => {
		try {
			const { statusCode, data, message } = await fetch(`${APP_URL}/api/products/${_id}`, {
				method: 'GET',

				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}).then((res) => res.json());

			if (statusCode !== 200) throw error(statusCode, `Error al cargar los productos: ${message}`);

			return {
				...data,
				price: Number(data.price)
			};
		} catch (e) {
			throw error(500, `Error al cargar los productos`);
		}
	};

	return {
		form: await superValidate(await getProductById(params._id), yup(ProductSchema)),
		formRemove: await superValidate({ id: params._id }, yup(DeleteProductSchema))
	};
};

export const actions = {
	updateProduct: async (event) => {
		try {
			const form = await superValidate(event.request, yup(ProductSchema));

			if (!form.valid) {
				const message: Message = {
					type: 'error',
					message: 'All fields are required. Please fill in all fields.'
				};
				setFlash(message, event);
				return fail(400, { form });
			}

			const { statusCode, message } = await fetch(`${APP_URL}/api/products/${form.data.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			}).then((res) => res.json());

			if (statusCode === 400) {
				const alert: Message = {
					type: 'error',
					message: message
				};
				setFlash(alert, event);
				return fail(400, { form });
			}

			const alert: Message = {
				type: 'success',
				message: message
			};

			setFlash(alert, event);

			return { form };
		} catch (error) {
			console.log(error);
		}
	},

	deleteProduct: async (event) => {
		const success_alert = {
			message: 'Product created successfully.'
		};
		try {
			const form = await superValidate(event.request, yup(DeleteProductSchema));

			if (!form.valid) {
				const message: Message = {
					type: 'error',
					message: 'All fields are required. Please fill in all fields.'
				};
				setFlash(message, event);
				return fail(400, { form });
			}

			const { statusCode, message } = await fetch(`${APP_URL}/api/products/${form.data.id}`, {
				method: 'PATCH',

				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					active: false
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

			success_alert.message = message;
		} catch (error) {
			console.log('🚀 ~ deleteProduct: ~ error:', error);
		}

		throw redirect(
			303,
			`/products`,
			{
				type: 'success',
				message: success_alert.message
			},
			event
		);
	}
};
