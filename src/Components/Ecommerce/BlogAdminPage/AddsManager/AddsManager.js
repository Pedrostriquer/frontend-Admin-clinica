import React, { useState, useEffect } from "react";
import "./AddsManager.css";
import blogAddsService from "../../../../dbServices/blogAddsService";

const AddsManager = () => {
  const [adds, setAdds] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newAdd, setNewAdd] = useState({
    name: "",
    imageUrl: "",
    width: 0,
    height: 0,
  });

  useEffect(() => {
    fetchAdds();
  }, []);

  const fetchAdds = async () => {
    try {
      const data = await blogAddsService.getAllAdds();
      setAdds(data);
    } catch {
      alert("Erro ao carregar anúncios");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await blogAddsService.uploadAddImage(file);
      setNewAdd({ ...newAdd, imageUrl: url });
    } catch {
      alert("Erro no upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!newAdd.name || !newAdd.imageUrl)
      return alert("Preencha nome e imagem");
    try {
      await blogAddsService.createAdd(newAdd);
      setNewAdd({ name: "", imageUrl: "", width: 0, height: 0 });
      fetchAdds();
    } catch {
      alert("Erro ao salvar anúncio");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remover este anúncio?")) return;
    try {
      await blogAddsService.deleteAdd(id);
      fetchAdds();
    } catch {
      alert("Erro ao excluir");
    }
  };

  return (
    <div className="adds-manager-container">
      <div className="add-form-card">
        <h3>Novo Banner / Anúncio</h3>
        <div className="add-inputs-row">
          <input
            type="text"
            placeholder="Nome do Anúncio"
            value={newAdd.name}
            onChange={(e) => setNewAdd({ ...newAdd, name: e.target.value })}
          />
          <div className="size-inputs">
            <input
              type="number"
              placeholder="Largura"
              value={newAdd.width}
              onChange={(e) =>
                setNewAdd({ ...newAdd, width: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Altura"
              value={newAdd.height}
              onChange={(e) =>
                setNewAdd({ ...newAdd, height: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="add-upload-row">
          <div className="image-preview-mini">
            {newAdd.imageUrl ? (
              <img src={newAdd.imageUrl} alt="Preview" />
            ) : (
              <div className="no-img">Sem Imagem</div>
            )}
          </div>
          <label className="upload-btn-adds">
            {isUploading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-cloud-arrow-up"></i>
            )}{" "}
            Upload Imagem
            <input type="file" hidden onChange={handleFileUpload} />
          </label>
          <button className="save-add-btn" onClick={handleSave}>
            Salvar Anúncio
          </button>
        </div>
      </div>

      <div className="adds-grid">
        {adds.map((add) => (
          <div key={add.id} className="add-card">
            <img src={add.imageUrl} alt={add.name} />
            <div className="add-card-info">
              <h4>{add.name}</h4>
              <p>
                {add.width}x{add.height}px
              </p>
              <button
                onClick={() => handleDelete(add.id)}
                className="del-add-btn"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddsManager;
