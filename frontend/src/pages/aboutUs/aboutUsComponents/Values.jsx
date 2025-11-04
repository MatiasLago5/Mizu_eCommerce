import React from 'react';

function Values() {
  const values = [
    {
      icon: "💧",
      title: "Pureza",
      text: "Agua tratada con los más altos estándares de calidad"
    },
    {
      icon: "🌱",
      title: "Sostenibilidad",
      text: "Compromiso con el cuidado del medio ambiente"
    },
    {
      icon: "⚡",
      title: "Eficiencia",
      text: "Entregas rápidas y servicio confiable"
    },
    {
      icon: "🤝",
      title: "Confianza",
      text: "Transparencia en cada paso del proceso"
    }
  ];

  return (
    <section className="contenido">
      <div className="content-wrapper">
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-item">
              <div className="value-icon">{value.icon}</div>
              <h4 className="value-title">{value.title}</h4>
              <p className="value-text">{value.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Values;