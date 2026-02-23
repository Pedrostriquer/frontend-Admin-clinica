// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// --- CONTEXTOS ---
import { LoadProvider, useLoad } from "./Context/LoadContext";
import { AuthProvider } from "./Context/AuthContext";
import { NotificationProvider } from "./Context/NotificationContext";

// --- COMPONENTES DE INTERFACE ---
import LoadingGemas from "./Components/LoadingGemas/LoadingGemas";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./Components/Layout/MainLayout";

// --- PÁGINAS: GERAL ---
import Login from "./Components/Login/Login";
import UserProfile from "./Components/UserProfile/UserProfile";
import UsersPage from "./Components/Users/UsersPage";
import ExtractData from "./Components/ExtractData/ExtractData";
import SupportPage from "./Components/Support/SupportPage";
import MessagesPage from "./Components/Messages/MessagesPage";

// --- PÁGINAS: PLATAFORMA ---
import ContractsDashboard from "./Components/Platform/Dashboard/ContractsDashboard";
import ClientsPage from "./Components/Platform/Clients/ClientsPage";
import ClientDetailPage from "./Components/Platform/Clients/ClientDetailPage/ClientDetailPage";
import CreateClientPage from "./Components/Platform/Clients/CreateClientPage/CreateClientPage";
import ConsultantsPage from "./Components/Platform/Consultants/ConsultantsPage";
import ConsultantDetailPage from "./Components/Platform/Consultants/ConsultantDetailPage/ConsultantDetailPage";
import CreateConsultantPage from "./Components/Platform/Consultants/CreateConsultantPage/CreateConsultantPage";
import ContractsPage from "./Components/Platform/Contracts/ContractsPage";
import ContractDetailPage from "./Components/Platform/Contracts/ContractDetailPage/ContractDetailPage";
import WithdrawalsPage from "./Components/Platform/Withdraws/WithdrawalsPage";
import WithdrawDetailPage from "./Components/Platform/Withdraws/WithdrawDetailPage/WithdrawDetailPage";
import CreateWithdrawalPage from "./Components/Platform/Withdraws/CreateWithdrawalPage/CreateWithdrawalPage";
import ControllerPage from "./Components/Platform/Controller/ControllerPage";
import ReferralsPage from "./Components/Platform/Indication/ReferralsPage";
import OffersPage from "./Components/Platform/Offers/OffersPage";
import Catalog from "./Components/Platform/Catalog/Catalog";

// --- PÁGINAS: E-COMMERCE ---
import EcommerceDashboard from "./Components/Ecommerce/Dashboard/EcommerceDashboard";
import ProductsPage from "./Components/Ecommerce/Products/ProductsPage";
import OrdersPage from "./Components/Ecommerce/Orders/OrdersPage";
import PromotionsPage from "./Components/Ecommerce/Promotions/PromotionsPage";
import CategoriesPage from "./Components/Ecommerce/Categories/CategoriesPage";
import FormsPage from "./Components/Ecommerce/Forms/FormsPage";
import BlogAdminPage from "./Components/Ecommerce/BlogAdminPage/BlogAdminPage";

// --- PÁGINAS: CONFIGURAÇÃO DE SITE (INSTITUCIONAL) ---
import HomeManager from "./Components/SiteConfig/Home/HomeManager";
import GemCashManager from "./Components/SiteConfig/GemCash/GemCashManager";
import PersonalizadasManager from "./Components/SiteConfig/Personalizadas/PersonalizadasManager";
import LeadsPage from "./Components/SiteConfig/Leads/LeadsPage";

// --- PÁGINAS: GEMVALUE (EDITORES VISUAIS) ---
import HeroManager from "./Components/GemValueConfig/Hero/HeroManager";
import WhyPhysicalManager from "./Components/GemValueConfig/WhyPhysical/WhyPhysicalManager";
import WhyDiamondsManager from "./Components/GemValueConfig/WhyDiamonds/WhyDiamondsManager";
import HowItWorksManager from "./Components/GemValueConfig/HowItWorks/HowItWorksManager";
import ParametersManager from "./Components/GemValueConfig/Parameters/ParametersManager";
import AuthorityManager from "./Components/GemValueConfig/Authority/AuthorityManager";
import TargetAudienceManager from "./Components/GemValueConfig/TargetAudience/TargetAudienceManager";
import SimulationManager from "./Components/GemValueConfig/Simulation/SimulationManager";
import FAQManager from "./Components/GemValueConfig/FAQ/FAQManager";
import FooterManager from "./Components/GemValueConfig/Footer/FooterManager";
import PopUps from "./Components/PopUps/PopUps";
import TestePopUp from "./Components/PopUps/TestePopUp";
import SimulateAdd from "./Components/Ecommerce/BlogAdminPage/SimulateAdd";
import EmailModelsPage from "./Components/EmailSender/Models/EmailModelsPage";
import EmailCampaignsPage from "./Components/EmailSender/Campaigns/EmailCampaignsPage";
// import WhatsAppManager from "./Components/GemValueConfig/WhatsApp/WhatsAppManager";

const AppContent = () => {
  const { loadState } = useLoad();

  return (
    <>
      {/* Loading Global controlado pelo Contexto */}
      <LoadingGemas isLoading={loadState} text="Forjando as Gemas..." />

      <Routes>
        {/* Rota de Acesso Público */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/test-adds" element={<SimulateAdd />} /> */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Redirecionamento Inicial */}
            <Route index element={<Navigate to="/platform/dashboard" />} />

            {/* Menu Global */}
            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="extract-data" element={<ExtractData />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="support/:ticketId" element={<SupportPage />} />


            {/* Sub-Roteamento: Email Sender */}
            <Route path="emailsender/models" element={<EmailModelsPage />} />
            <Route
              path="emailsender/campaigns"
              element={<EmailCampaignsPage />}
            />

            {/* Sub-Roteamento: Plataforma */}
            <Route path="platform/dashboard" element={<ContractsDashboard />} />
            <Route path="platform/clients" element={<ClientsPage />} />
            <Route
              path="platform/clients/:clientId"
              element={<ClientDetailPage />}
            />
            <Route path="platform/consultants" element={<ConsultantsPage />} />
            <Route
              path="platform/consultants/create"
              element={<CreateConsultantPage />}
            />
            <Route
              path="platform/consultants/:consultantId"
              element={<ConsultantDetailPage />}
            />
            <Route path="platform/contracts" element={<ContractsPage />} />
            <Route
              path="platform/contracts/:contractId"
              element={<ContractDetailPage />}
            />
            <Route path="platform/withdraws" element={<WithdrawalsPage />} />
            <Route
              path="platform/withdraws/create"
              element={<CreateWithdrawalPage />}
            />
            <Route
              path="platform/withdraws/:withdrawalId"
              element={<WithdrawDetailPage />}
            />
            <Route path="platform/controller" element={<ControllerPage />} />
            <Route path="platform/indication" element={<ReferralsPage />} />
            <Route path="platform/offers" element={<OffersPage />} />
            <Route path="platform/messages" element={<MessagesPage />} />
            <Route path="platform/notifications" element={<MessagesPage />} />
            <Route path="platform/catalogo-gemcash" element={<Catalog />} />
            <Route path="clients/create" element={<CreateClientPage />} />
            <Route path="platform/pop-ups" element={<PopUps />} />

            {/* Sub-Roteamento: E-commerce */}
            <Route
              path="ecommerce/dashboard"
              element={<EcommerceDashboard />}
            />
            <Route path="ecommerce/products" element={<ProductsPage />} />
            <Route path="ecommerce/blog" element={<BlogAdminPage />} />
            <Route path="ecommerce/orders" element={<OrdersPage />} />
            <Route path="ecommerce/promotions" element={<PromotionsPage />} />
            <Route path="ecommerce/categories" element={<CategoriesPage />} />
            <Route path="ecommerce/forms" element={<FormsPage />} />

            {/* Sub-Roteamento: Configurações do Site (Original) */}
            <Route path="site/home" element={<HomeManager />} />
            <Route path="site/gemcash" element={<GemCashManager />} />
            <Route
              path="site/personalizadas"
              element={<PersonalizadasManager />}
            />
            <Route path="site/leads" element={<LeadsPage />} />

            {/* Sub-Roteamento: Site GemValue (Novos Editores Visuais) */}
            <Route path="gemvalue/hero" element={<HeroManager />} />
            <Route
              path="gemvalue/why-physical"
              element={<WhyPhysicalManager />}
            />
            <Route
              path="gemvalue/why-diamonds"
              element={<WhyDiamondsManager />}
            />
            <Route
              path="gemvalue/how-it-works"
              element={<HowItWorksManager />}
            />
            <Route path="gemvalue/parameters" element={<ParametersManager />} />
            <Route path="gemvalue/authority" element={<AuthorityManager />} />
            <Route
              path="gemvalue/target-audience"
              element={<TargetAudienceManager />}
            />
            <Route path="gemvalue/simulation" element={<SimulationManager />} />
            <Route path="gemvalue/faq" element={<FAQManager />} />
            <Route path="gemvalue/footer" element={<FooterManager />} />
            <Route
              path="gemvalue/whatsapp"
              element={<div>Página WhatsApp</div>}
            />

            {/* Exemplos de como ficarão quando prontos: */}
            {/* <Route path="gemvalue/how-it-works" element={<HowItWorksManager />} /> */}
          </Route>
        </Route>

        {/* Fallback para Rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LoadProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </LoadProvider>
    </BrowserRouter>
  );
}

export default App;
