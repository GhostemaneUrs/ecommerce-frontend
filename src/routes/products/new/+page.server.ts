import { fail } from '@sveltejs/kit';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import type { Message } from '$lib/schemas/superForms';
import { superValidate } from 'sveltekit-superforms/server';
import { ProductSchema } from '$lib/schemas/product';
import { yup } from 'sveltekit-superforms/adapters';
import { APP_URL } from '$lib/utils/constants.js';

export const load = async () => {
	return {
		form: await superValidate(yup(ProductSchema))
	};
};

export const actions = {
	createProduct: async (event) => {
		const success_alert = {
			_id: '',
			message: 'Product created successfully.'
		};
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

			const { data, statusCode, message } = await fetch(`${APP_URL}/api/products`, {
				method: 'POST',
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

			success_alert._id = data.id;
		} catch (error) {
			console.log(error);
		}

		throw redirect(
			303,
			`/products/${success_alert._id}`,
			{
				type: 'success',
				message: success_alert.message
			},
			event
		);
	}
};
