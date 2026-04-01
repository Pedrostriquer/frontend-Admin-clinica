import React, { useState, useEffect } from "react";
import blogGemCapitalDashboardService from "../../../../dbServices/blogGemCapitalDashboardService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  dashboardContainer,
  headerSection,
  pageTitle,
  cardsGrid,
  metricCard,
  cardTitle,
  cardValue,
  cardSubtitle,
  section,
  sectionTitle,
  chartsGrid,
  chartContainer,
  chartTitle,
  topPostsContainer,
  postCard,
  postTitle,
  postStats,
  statItem,
  statValue,
  statLabel,
  nextEventCard,
  eventTitle,
  eventDate,
  eventDetails,
  lastSendingCard,
  sendingStats,
  sendingValue,
  sendingStat,
} from "./BlogGemCapitalDashboardStyle";

const BlogGemCapitalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [postsData, setPostsData] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    thisWeek: 0,
    totalViews: 0,
  });
  const [newsletterData, setNewsletterData] = useState({
    totalViews: 0,
    totalClicks: 0,
    today: { views: 0, clicks: 0 },
    thisWeek: { views: 0, clicks: 0 },
  });
  const [subscribersData, setSubscribersData] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newToday: 0,
    newThisWeek: 0,
    newThisMonth: 0,
    newThisYear: 0,
    unsubscribedLastWeek: 0,
  });
  const [lineChartData, setLineChartData] = useState([]);
  const [subscribersMonthlyData, setSubscribersMonthlyData] = useState([]);
  const [topPostsChartData, setTopPostsChartData] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [nextNewsletter, setNextNewsletter] = useState({
    date: "N/A",
    time: "--:--",
    recipients: 0,
    status: "Desativado",
  });
  const [lastSending, setLastSending] = useState({
    date: "N/A",
    time: "--:--",
    totalSent: 0,
    success: 0,
    errors: 0,
    successRate: 0,
  });

  const COLORS = ["#10b981", "#ef4444"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await blogGemCapitalDashboardService.getAllDashboardData();

        if (data.posts) {
          setPostsData({
            total: data.posts.total,
            active: data.posts.active,
            inactive: data.posts.inactive,
            thisWeek: data.posts.createdThisWeek,
            totalViews: data.posts.totalViews,
          });
        }

        if (data.newsletter) {
          setNewsletterData({
            totalViews: data.newsletter.totalViews,
            totalClicks: data.newsletter.totalClicks,
            today: {
              views: data.newsletter.viewsToday,
              clicks: data.newsletter.clicksToday,
            },
            thisWeek: {
              views: data.newsletter.viewsThisWeek,
              clicks: data.newsletter.clicksThisWeek,
            },
          });
        }

        if (data.subscribers) {
          setSubscribersData({
            total: data.subscribers.total,
            active: data.subscribers.active,
            inactive: data.subscribers.inactive,
            newToday: data.subscribers.newToday,
            newThisWeek: data.subscribers.newThisWeek,
            newThisMonth: data.subscribers.newThisMonth,
            newThisYear: data.subscribers.newThisYear,
            unsubscribedLastWeek: data.subscribers.unsubscribedLastWeek,
          });
        }

        if (data.newsletterWeekly) {
          setLineChartData(
            data.newsletterWeekly.map((item) => ({
              day: item.day,
              views: item.views,
              clicks: item.clicks,
            }))
          );
        }

        if (data.subscribersMonthly) {
          setSubscribersMonthlyData(
            data.subscribersMonthly.map((item) => ({
              month: item.month,
              subscribers: item.subscribers,
            }))
          );
        }

        if (data.topPosts) {
          const formatted = data.topPosts.map((post) => ({
            id: post.id,
            title: post.title,
            featuredImage: post.featuredImage,
            views: post.views,
            clicks: post.clicks,
            date: post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("pt-BR")
              : "N/A",
          }));
          setTopPosts(formatted);
          setTopPostsChartData(
            formatted.map((p) => ({
              name: p.title.substring(0, 12) + "...",
              views: p.views,
            }))
          );
        }

        if (data.sendings) {
          if (
            data.sendings.nextSending &&
            data.sendings.nextSending.scheduledDate
          ) {
            const d = new Date(data.sendings.nextSending.scheduledDate);
            setNextNewsletter({
              date:
                d.getUTCDate().toString().padStart(2, "0") +
                "/" +
                (d.getUTCMonth() + 1).toString().padStart(2, "0") +
                "/" +
                d.getUTCFullYear(),
              time:
                d.getUTCHours().toString().padStart(2, "0") +
                ":" +
                d.getUTCMinutes().toString().padStart(2, "0"),
              recipients: data.sendings.nextSending.recipients,
              status: data.sendings.nextSending.status,
            });
          }

          if (data.sendings.lastSending && data.sendings.lastSending.sentDate) {
            const d = new Date(data.sendings.lastSending.sentDate);
            setLastSending({
              date:
                d.getUTCDate().toString().padStart(2, "0") +
                "/" +
                (d.getUTCMonth() + 1).toString().padStart(2, "0") +
                "/" +
                d.getUTCFullYear(),
              time:
                d.getUTCHours().toString().padStart(2, "0") +
                ":" +
                d.getUTCMinutes().toString().padStart(2, "0"),
              totalSent: data.sendings.lastSending.totalSent,
              success: data.sendings.lastSending.successCount,
              errors: data.sendings.lastSending.errorCount,
              successRate: data.sendings.lastSending.successRate,
            });
          }
        }
      } catch (err) {
        setError("Falha ao carregar métricas.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const piechartData = [
    { name: "Sucesso", value: lastSending.success },
    { name: "Erros", value: lastSending.errors },
  ];

  if (loading)
    return (
      <div style={dashboardContainer}>
        <h1 style={pageTitle}>Carregando...</h1>
      </div>
    );
  if (error)
    return (
      <div style={dashboardContainer}>
        <h1 style={pageTitle}>{error}</h1>
      </div>
    );

  return (
    <div style={dashboardContainer}>
      <div style={headerSection}>
        <h1 style={pageTitle}>
          <i
            className="fas fa-chart-line"
            style={{ fontSize: "32px", color: "#3b82f6" }}
          ></i>
          KPI e Métricas
        </h1>
      </div>

      <div style={section}>
        <h2 style={sectionTitle}>
          <i
            className="fas fa-file-alt"
            style={{ fontSize: "18px", color: "#3b82f6" }}
          ></i>
          Posts
        </h2>
        <div style={cardsGrid}>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i className="fas fa-file-alt" style={{ color: "#3b82f6" }}></i>{" "}
              Total
            </div>
            <div style={cardValue}>{postsData.total.toLocaleString()}</div>
            <div style={cardSubtitle}>{postsData.active} ativos</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i
                className="fas fa-check-circle"
                style={{ color: "#10b981" }}
              ></i>{" "}
              Ativos
            </div>
            <div style={cardValue}>{postsData.active.toLocaleString()}</div>
            <div style={cardSubtitle}>{postsData.inactive} inativos</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i className="fas fa-eye" style={{ color: "#8b5cf6" }}></i>{" "}
              Visualizações
            </div>
            <div style={cardValue}>{postsData.totalViews.toLocaleString()}</div>
            <div style={cardSubtitle}>Total geral</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i
                className="fas fa-calendar-week"
                style={{ color: "#f59e0b" }}
              ></i>{" "}
              Esta Semana
            </div>
            <div style={cardValue}>{postsData.thisWeek.toLocaleString()}</div>
            <div style={cardSubtitle}>Novos posts</div>
          </div>
        </div>
      </div>

      <div style={section}>
        <h2 style={sectionTitle}>
          <i
            className="fas fa-envelope"
            style={{ fontSize: "18px", color: "#ec4899" }}
          ></i>
          Newsletter - Visão Geral
        </h2>
        <div style={cardsGrid}>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i className="fas fa-eye" style={{ color: "#8b5cf6" }}></i> Views
              Total
            </div>
            <div style={cardValue}>
              {newsletterData.totalViews.toLocaleString()}
            </div>
            <div style={cardSubtitle}>Geral</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i
                className="fas fa-mouse-pointer"
                style={{ color: "#06b6d4" }}
              ></i>{" "}
              Clicks Total
            </div>
            <div style={cardValue}>
              {newsletterData.totalClicks.toLocaleString()}
            </div>
            <div style={cardSubtitle}>Geral</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i className="fas fa-bolt" style={{ color: "#f59e0b" }}></i> Views
              Hoje
            </div>
            <div style={cardValue}>
              {newsletterData.today.views.toLocaleString()}
            </div>
            <div style={cardSubtitle}>{newsletterData.today.clicks} clicks</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i
                className="fas fa-trending-up"
                style={{ color: "#10b981" }}
              ></i>{" "}
              Views Semana
            </div>
            <div style={cardValue}>
              {newsletterData.thisWeek.views.toLocaleString()}
            </div>
            <div style={cardSubtitle}>
              {newsletterData.thisWeek.clicks} clicks
            </div>
          </div>
        </div>
      </div>

      <div style={section}>
        <h2 style={sectionTitle}>
          <i
            className="fas fa-users"
            style={{ fontSize: "18px", color: "#3b82f6" }}
          ></i>
          Assinantes
        </h2>
        <div style={cardsGrid}>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i className="fas fa-users" style={{ color: "#3b82f6" }}></i>{" "}
              Total
            </div>
            <div style={cardValue}>
              {subscribersData.total.toLocaleString()}
            </div>
            <div style={cardSubtitle}>{subscribersData.active} ativos</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i className="fas fa-user-plus" style={{ color: "#8b5cf6" }}></i>{" "}
              Hoje
            </div>
            <div style={cardValue}>
              {subscribersData.newToday.toLocaleString()}
            </div>
            <div style={cardSubtitle}>Novos</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i
                className="fas fa-calendar-week"
                style={{ color: "#06b6d4" }}
              ></i>{" "}
              Semana
            </div>
            <div style={cardValue}>
              {subscribersData.newThisWeek.toLocaleString()}
            </div>
            <div style={cardSubtitle}>Novos</div>
          </div>
          <div style={metricCard}>
            <div style={cardTitle}>
              <i className="fas fa-user-slash" style={{ color: "#f97316" }}></i>{" "}
              Desativações
            </div>
            <div style={cardValue}>
              {subscribersData.unsubscribedLastWeek.toLocaleString()}
            </div>
            <div style={cardSubtitle}>7 dias</div>
          </div>
        </div>
      </div>

      <div style={section}>
        <h2 style={sectionTitle}>
          <i className="fas fa-chart-bar"></i> Análise de Dados
        </h2>
        <div style={chartsGrid}>
          <div style={chartContainer}>
            <div style={chartTitle}>Newsletter - Última Semana</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Visualizações"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Cliques"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={chartContainer}>
            <div style={chartTitle}>Assinantes - 12 Meses</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subscribersMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar
                  dataKey="subscribers"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={section}>
        <h2 style={sectionTitle}>
          <i className="fas fa-star"></i> 4 Posts Mais Vistos
        </h2>
        <div style={topPostsContainer}>
          {topPosts.map((post, index) => (
            <div key={post.id} style={postCard}>
              <div
                style={{
                  width: "100%",
                  height: "120px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginBottom: "12px",
                  backgroundColor: "#f3f4f6",
                }}
              >
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#9ca3af",
                    }}
                  >
                    <i
                      className="fas fa-image"
                      style={{ fontSize: "24px" }}
                    ></i>
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#3b82f6",
                  marginBottom: "12px",
                }}
              >
                #{index + 1}
              </div>
              <div style={postTitle}>{post.title}</div>
              <div style={postStats}>
                <div style={statItem}>
                  <div style={statValue}>{post.views.toLocaleString()}</div>
                  <div style={statLabel}>Views</div>
                </div>
                <div style={statItem}>
                  <div style={statValue}>{post.clicks.toLocaleString()}</div>
                  <div style={statLabel}>Clicks</div>
                </div>
                <div style={statItem}>
                  <div style={{ fontSize: "12px", fontWeight: "700" }}>
                    {post.date}
                  </div>
                  <div style={statLabel}>Data</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <h2 style={sectionTitle}>
          <i className="fas fa-paper-plane"></i> Newsletter - Status
        </h2>
        <div style={chartsGrid}>
          <div style={nextEventCard}>
            <div style={eventTitle}>Próximo Envio</div>
            <div style={{ marginTop: "20px" }}>
              <div style={{ marginBottom: "15px" }}>
                <div style={statLabel}>DATA</div>
                <div style={eventDate}>{nextNewsletter.date}</div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <div style={statLabel}>HORA</div>
                <div style={eventDetails}>{nextNewsletter.time}</div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <div style={statLabel}>DESTINATÁRIOS</div>
                <div style={eventDetails}>
                  {nextNewsletter.recipients.toLocaleString()}
                </div>
              </div>
              <div style={{ color: "#10b981", fontWeight: "700" }}>
                {nextNewsletter.status}
              </div>
            </div>
          </div>
          <div style={lastSendingCard}>
            <div style={eventTitle}>Último Envio</div>
            <div style={sendingStats}>
              <div style={sendingStat}>
                <div style={sendingValue}>
                  {lastSending.totalSent.toLocaleString()}
                </div>
                <div style={statLabel}>ENVIADOS</div>
              </div>
              <div style={sendingStat}>
                <div style={{ ...sendingValue, color: "#10b981" }}>
                  {lastSending.success.toLocaleString()}
                </div>
                <div style={statLabel}>SUCESSO</div>
              </div>
              <div style={sendingStat}>
                <div style={{ ...sendingValue, color: "#ef4444" }}>
                  {lastSending.errors.toLocaleString()}
                </div>
                <div style={statLabel}>ERROS</div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#10b981",
                }}
              >
                {lastSending.successRate}%
              </div>
              <div style={statLabel}>TAXA DE SUCESSO</div>
              <div style={{ marginTop: "15px" }}>
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie
                      data={piechartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {piechartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogGemCapitalDashboard;
