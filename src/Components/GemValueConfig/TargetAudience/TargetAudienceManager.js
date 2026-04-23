import React, { useState, useEffect } from "react";
import {
  PieChart,
  ShieldCheck,
  Gem,
  FileText,
  Landmark,
  Check,
  Save,
  Eye,
  Users,
} from "lucide-react";
import gemValueService from "../../../dbServices/gemValueService";
import "./TargetAudienceManager.css";

const TargetAudienceManager = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [audienceList, setAudienceList] = useState([]);
  const [originalAudienceList, setOriginalAudienceList] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const sessionKeys = ["target_audience_title", "target_audience_list"];

  const staticIcons = [
    <PieChart size={24} />,
    <ShieldCheck size={24} />,
    <Gem size={24} />,
    <FileText size={24} />,
    <Landmark size={24} />,
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allTexts = await gemValueService.getAllTexts();
      const filtered = allTexts.filter((item) =>
        sessionKeys.includes(item.sessionName)
      );

      const dataMap = {};
      filtered.forEach((item) => {
        dataMap[item.sessionName] = item;
      });
      setData(dataMap);
      setOriginalData(JSON.parse(JSON.stringify(dataMap)));

      const rawList = dataMap["target_audience_list"]?.textContent || "";
      const parsedList = rawList
        ? rawList.split("|").map((item, index) => {
            const [title, desc] = item.split("::");
            return {
              id: index + 1,
              title: title?.trim() || "",
              desc: desc?.trim() || "",
            };
          })
        : [
            { id: 1, title: "Quem quer diversificar de verdade", desc: "" },
            {
              id: 2,
              title: "Empresários que querem proteger patrimônio",
              desc: "",
            },
            { id: 3, title: "Quem prefere um bem que pode tocar", desc: "" },
            {
              id: 4,
              title: "Quem quer regras claras desde o início",
              desc: "",
            },
            {
              id: 5,
              title: "Quem quer menos dependência do sistema bancário",
              desc: "",
            },
          ];
      setAudienceList(parsedList);
      setOriginalAudienceList(JSON.parse(JSON.stringify(parsedList)));
      setIsDirty(false);
    } catch (error) {
      alert("❌ Erro ao carregar Público-Alvo");
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: { ...prev[key], textContent: value },
    }));
    setIsDirty(true);
  };

  const handleItemChange = (index, field, value) => {
    const newList = [...audienceList];
    newList[index][field] = value;
    setAudienceList(newList);
    setIsDirty(true);
  };

  const saveAll = async () => {
    try {
      setIsSaving(true);
      const promises = sessionKeys.map(async (key) => {
        let content = data[key]?.textContent || "";

        if (key === "target_audience_list") {
          content = audienceList
            .map((item) => `${item.title} :: ${item.desc}`)
            .join(" | ");
        }

        if (!content || content.trim() === "") {
          return Promise.resolve();
        }

        if (data[key]?.id) {
          return gemValueService.updateText(data[key].id, key, content);
        }

        try {
          const newRecord = await gemValueService.createText(key, content);
          setData((prev) => ({ ...prev, [key]: newRecord }));
          return newRecord;
        } catch (createError) {
          await loadData();
          const updatedData = await gemValueService.getAllTexts();
          const existingRecord = updatedData.find(
            (item) => item.sessionName === key
          );
          if (existingRecord) {
            return gemValueService.updateText(existingRecord.id, key, content);
          }
          throw createError;
        }
      });

      await Promise.all(promises);
      alert("✅ Público-Alvo atualizado com sucesso!");
      setIsDirty(false);
      setTimeout(() => loadData(), 500);
    } catch (error) {
      alert("❌ Erro ao salvar alterações");
      console.error("Erro detalhado:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return <div className="admin-loading">Carregando Público-Alvo...</div>;

  return (
    <div className="target-editor-container">
      <header className="editor-top-bar">
        <div className="editor-info">
          <Users size={20} className="text-blue-500" />
          <div>
            <h2>Editor Visual: Público-Alvo</h2>
            <p>Edite o título e as descrições dos 5 perfis de clientes.</p>
          </div>
        </div>
        {isDirty && (
          <button
            className="btn-primary-save"
            onClick={saveAll}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner"></span> Salvando...
              </>
            ) : (
              <>
                <Save size={18} /> Publicar Alterações
              </>
            )}
          </button>
        )}
      </header>

      <div className="target-editor-layout">
        {/* COLUNA ESQUERDA: LISTA DE ITENS (LINHAS) */}
        <aside className="target-items-sidebar">
          <div className="admin-section-label">
            Perfis e Estratégias (Linhas)
          </div>
          <div className="target-rows-stack">
            {audienceList.map((item, index) => (
              <div key={item.id} className="admin-target-row">
                <div className="admin-row-header">
                  <div className="admin-row-icon">
                    {staticIcons[index] || <Check size={20} />}
                  </div>
                  <span className="admin-row-id">0{item.id}</span>
                </div>
                <div className="admin-row-inputs">
                  <input
                    className="admin-target-input-title"
                    value={item.title}
                    onChange={(e) =>
                      handleItemChange(index, "title", e.target.value)
                    }
                    placeholder="Título do Perfil"
                  />
                  <textarea
                    className="admin-target-input-desc"
                    value={item.desc}
                    onChange={(e) =>
                      handleItemChange(index, "desc", e.target.value)
                    }
                    placeholder="Descrição do motivo/vantagem..."
                    rows={4}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* COLUNA DIREITA: TEXTOS DE CABEÇALHO */}
        <main className="target-content-main">
          <div className="admin-section-label">Cabeçalho da Seção</div>

          <div className="admin-field-box">
            <label>Tag Minimalista</label>
            <input
              className="target-input-tag"
              value={data["target_audience_tag"]?.textContent}
              onChange={(e) =>
                handleTextChange("target_audience_tag", e.target.value)
              }
            />
          </div>

          <div className="admin-field-box">
            <label>Título Principal</label>
            <textarea
              className="target-input-h2"
              value={data["target_audience_title"]?.textContent}
              onChange={(e) =>
                handleTextChange("target_audience_title", e.target.value)
              }
              rows={3}
            />
          </div>

          <div className="admin-info-box">
            <Eye size={18} />
            <span>
              A animação de hover e a numeração sequencial são geradas
              automaticamente no site.
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TargetAudienceManager;
