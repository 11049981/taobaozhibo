import { messageApi } from '@/api'

export default {
  namespaced: true,
  
  state: {
    templates: []
  },

  mutations: {
    SET_TEMPLATES(state, templates) {
      state.templates = templates
    },
    
    ADD_TEMPLATE(state, template) {
      state.templates.push(template)
    },
    
    UPDATE_TEMPLATE(state, { id, updates }) {
      const index = state.templates.findIndex(t => t.id === id)
      if (index !== -1) {
        state.templates[index] = { ...state.templates[index], ...updates }
      }
    },
    
    DELETE_TEMPLATE(state, templateId) {
      state.templates = state.templates.filter(t => t.id !== templateId)
    }
  },

  actions: {
    async fetchTemplates({ commit }) {
      const templates = await messageApi.getTemplates()
      commit('SET_TEMPLATES', templates)
    },

    async addTemplate({ commit }, template) {
      const newTemplate = await messageApi.addTemplate(template)
      commit('ADD_TEMPLATE', newTemplate)
      return newTemplate
    },

    async updateTemplate({ commit }, { id, updates }) {
      await messageApi.updateTemplate(id, updates)
      commit('UPDATE_TEMPLATE', { id, updates })
    },

    async deleteTemplate({ commit }, templateId) {
      await messageApi.deleteTemplate(templateId)
      commit('DELETE_TEMPLATE', templateId)
    }
  },

  getters: {
    templateById: state => id => state.templates.find(t => t.id === id)
  }
} 