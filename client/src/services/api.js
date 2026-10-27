import axios from 'axios'

const api = axios.create({ withCredentials: true })

export const authApi = {
  me: () => api.get('/api/auth/me'),
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (details) => api.post('/api/auth/register', details),
  logout: () => api.post('/api/auth/logout'),
}

export const articleApi = {
  list: () => api.get('/api/articles'),
  getPublic: (slug) => api.get(`/api/public/articles/${encodeURIComponent(slug)}`),
  create: (article) => api.post('/api/articles', article),
  update: (id, article) => api.patch(`/api/articles/${id}`, article),
  preview: (id) => api.get(`/api/articles/${id}/preview`),
  publish: (id, visibility) => api.post(`/api/articles/${id}/publish`, { visibility }),
  unpublish: (id) => api.post(`/api/articles/${id}/unpublish`),
  remove: (id) => api.delete(`/api/articles/${id}`),
}

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (profile) => api.patch('/api/profile', profile),
  getPortfolioArticles: () => api.get('/api/profile/portfolio-articles'),
  updatePortfolioArticles: (articleIds) => api.patch('/api/profile/portfolio-articles', { articleIds }),
  getPortfolio: (id) => api.get(`/api/public/portfolios/${encodeURIComponent(id)}`),
}
