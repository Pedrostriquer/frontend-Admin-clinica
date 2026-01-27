import React, { useState, useEffect } from "react";
import blogAddsService from "../../../dbServices/blogAddsService";

const SimulateAdd = () => {
  const [adds, setAdds] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await blogAddsService.getAllAdds();
        setAdds(data);
      } catch (err) {
        console.error("Erro ao carregar para teste", err);
      }
    };
    load();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{ textAlign: "center", color: "#122C4F", marginBottom: "30px" }}
      >
        Simulação de Banners (BlogAdds)
      </h2>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ color: "#666" }}>Conteúdo do artigo acima...</p>

        <hr
          style={{
            margin: "40px 0",
            border: "0",
            borderTop: "1px dashed #ccc",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {adds.length === 0 ? (
            <p>Nenhum Add cadastrado no banco para simular.</p>
          ) : (
            adds.map((add) => (
              <div
                key={add.id}
                style={{
                  textAlign: "center",
                  border: "1px solid #eee",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "10px",
                  }}
                >
                  Anúncio: <strong>{add.name}</strong> ({add.width}x{add.height}
                  )
                </p>

                {/* O Banner Real */}
                <img
                  src={add.imageUrl}
                  alt={add.name}
                  style={{
                    width: add.width > 0 ? `${add.width}px` : "100%",
                    height: add.height > 0 ? `${add.height}px` : "auto",
                    maxWidth: "100%", // Garante que não quebre o layout
                    objectFit: "contain",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            ))
          )}
        </div>

        <hr
          style={{
            margin: "40px 0",
            border: "0",
            borderTop: "1px dashed #ccc",
          }}
        />
        <p style={{ color: "#666" }}>Conteúdo do artigo abaixo...</p>
      </div>
    </div>
  );
};

export default SimulateAdd;
