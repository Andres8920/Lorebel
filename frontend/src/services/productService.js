/**
 * Servicios de API
 * Wrappers para endpoints de autenticación, productos y categorías
 */

import api from './api';

/**
 * Servicios de autenticación
 */
export const authService = {
  /**
   * Autenticar usuario
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - { username, email, password }
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

/**
 * Servicios de productos CRUD
 */
export const productService = {
  /**
   * Obtener productos con filtros y paginación
   * @param {Object} filters - { categoria?, search?, page?, limit? }
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrecio) params.append('minPrecio', filters.minPrecio);
    if (filters.maxPrecio) params.append('maxPrecio', filters.maxPrecio);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/productos?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtener un producto por ID
   */
  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo producto
   */
  create: async (productData) => {
    const response = await api.post('/productos', productData);
    return response.data;
  },

  /**
   * Actualizar producto existente
   */
  update: async (id, productData) => {
    const response = await api.put(`/productos/${id}`, productData);
    return response.data;
  },

  /**
   * Eliminar producto
   */
  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};

/**
 * Servicios de categorías CRUD
 */
export const categoriaService = {
  /**
   * Obtener todas las categorías con filtros
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.activo !== undefined) params.append('activo', filters.activo);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/categorias?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtener categorías con paginación
   */
  getCategorias: async (page = 1, limit = 100) => {
    const response = await api.get(`/categorias?page=${page}&limit=${limit}&activo=true`);
    return response.data;
  },

  /**
   * Obtener una categoría por ID
   */
  getById: async (id) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  /**
   * Crear nueva categoría
   */
  create: async (categoriaData) => {
    const response = await api.post('/categorias', categoriaData);
    return response.data;
  },

  /**
   * Actualizar categoría existente
   */
  update: async (id, categoriaData) => {
    const response = await api.put(`/categorias/${id}`, categoriaData);
    return response.data;
  },

  /**
   * Eliminar categoría
   */
  delete: async (id) => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  }
};
