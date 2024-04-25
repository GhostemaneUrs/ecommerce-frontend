import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_APP_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
  const getQuotations = async () => {
    try {
      const { statusCode, data, message } = await fetch(
        `${PUBLIC_APP_URL}/api/quotations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      ).then((res) => res.json());

      if (statusCode !== 200)
        throw error(statusCode, `Error al cargar las cotizaciones: ${message}`);

      return data;
    } catch (e) {
      throw error(500, `Error al cargar las cotizaciones`);
    }
  };

  return {
    quotations: await getQuotations(),
  };
};
