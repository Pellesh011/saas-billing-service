import { DataProvider, fetchUtils } from 'react-admin';

const apiUrl = import.meta.env.VITE_API_URL || '/api';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  const token = localStorage.getItem('token');
  if (token) {
    options = {
      ...options,
      headers: {
        ...options.headers as Record<string, string>,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return fetchUtils.fetchJson(url, options);
};

const buildQuery = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  });
  return searchParams.toString();
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = buildQuery({
      page: page,
      limit: perPage,
      sort: field,
      order: order,
      filter: params.filter,
    });
    const url = `${apiUrl}/${resource}?${query}`;
    const { json } = await httpClient(url);
    return {
      data: json.data || json,
      total: json.meta?.total || json.total || 0,
    };
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url);
    return { data: json.data || json };
  },

  create: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return { data: json.data || json };
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: 'PATCH',
      body: JSON.stringify(params.data),
    });
    return { data: json.data || json };
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: 'DELETE',
    });
    return { data: json.data || json };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'DELETE',
        }),
      ),
    );
    return { data: params.ids };
  },

  getMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`).then(({ json }) => json.data || json),
      ),
    );
    return { data: results };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const query = buildQuery({
      page: page,
      limit: perPage,
      filter: {
        ...params.filter,
        [params.target]: params.id,
      },
    });
    const url = `${apiUrl}/${resource}?${query}`;
    const { json } = await httpClient(url);
    return {
      data: json.data || json,
      total: json.meta?.total || 0,
    };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        }),
      ),
    );
    return { data: params.ids };
  },
};
