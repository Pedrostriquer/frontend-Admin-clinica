import React, { useState, useEffect } from "react";
import BlogGemCapitalContainer from "./BlogGemCapitalContainer";
import Affiliates from "./Affiliates/Affiliates";
import affiliateService from "../../../dbServices/affiliatesService";

const AffiliatesPage = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch data ao montar
  useEffect(() => {
    fetchAffiliates();
    fetchStatistics();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const data = await affiliateService.searchAffiliates({
        pageNumber: 1,
        pageSize: 10,
        order: "desc",
      });
      setAffiliates(data.data || []);
    } catch (error) {
      console.error("Erro ao buscar afiliados:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await affiliateService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  return (
    <BlogGemCapitalContainer>
      <Affiliates />
    </BlogGemCapitalContainer>
  );
};

export default AffiliatesPage;
