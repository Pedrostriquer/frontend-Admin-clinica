import api  from "./api/api";

const blogGemCapitalDashboardService = {
  // ============ POSTS METRICS ============
  async getPostsMetrics() {
    try {
      const response = await api.get("gemcapital-blog/kpi/posts");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar métricas de posts:", error);
      throw error;
    }
  },

  // ============ NEWSLETTER METRICS ============
  async getNewsletterMetrics() {
    try {
      const response = await api.get("gemcapital-blog/kpi/newsletter");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar métricas de newsletter:", error);
      throw error;
    }
  },

  async getNewsletterWeeklyChart() {
    try {
      const response = await api.get("gemcapital-blog/kpi/newsletter-weekly");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar gráfico semanal de newsletter:", error);
      throw error;
    }
  },

  // ============ SUBSCRIBERS METRICS ============
  async getSubscribersMetrics() {
    try {
      const response = await api.get("gemcapital-blog/kpi/subscribers");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar métricas de assinantes:", error);
      throw error;
    }
  },

  async getSubscribersMonthlyChart() {
    try {
      const response = await api.get("gemcapital-blog/kpi/subscribers-monthly");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar gráfico mensal de assinantes:", error);
      throw error;
    }
  },

  // ============ TOP POSTS ============
  async getTopPosts(limit = 4) {
    try {
      const response = await api.get(`gemcapital-blog/kpi/top-posts?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar posts mais vistos:", error);
      throw error;
    }
  },

  // ============ NEWSLETTER SENDINGS ============
  async getNewsletterSendings() {
    try {
      const response = await api.get("gemcapital-blog/kpi/sendings");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados de envios:", error);
      throw error;
    }
  },

  // ============ LOAD ALL DATA IN PARALLEL ============
  async getAllDashboardData() {
    try {
      const results = await Promise.all([
        this.getPostsMetrics(),
        this.getNewsletterMetrics(),
        this.getNewsletterWeeklyChart(),
        this.getSubscribersMetrics(),
        this.getSubscribersMonthlyChart(),
        this.getTopPosts(),
        this.getNewsletterSendings(),
      ]);

      return {
        posts: results[0],
        newsletter: results[1],
        newsletterWeekly: results[2],
        subscribers: results[3],
        subscribersMonthly: results[4],
        topPosts: results[5],
        sendings: results[6],
      };
    } catch (error) {
      console.error("Erro ao carregar dados da dashboard:", error);
      throw error;
    }
  },
};

export default blogGemCapitalDashboardService;
