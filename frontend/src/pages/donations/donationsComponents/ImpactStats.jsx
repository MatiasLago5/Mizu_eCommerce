import React from 'react';

function ImpactStats() {
  const stats = [
    { number: "1,550", label: "Productos Donados" },
    { number: "4", label: "Refugios Beneficiados" },
    { number: "300+", label: "Personas Ayudadas" }
  ];

  return (
    <section className="sticky-section impact-section">
      <div className="section-content">
        <h2 className="section-title">Nuestro Impacto</h2>
        <div className="impact-grid">
          {stats.map((stat, index) => (
            <div key={index} className="impact-card">
              <div className="impact-number">{stat.number}</div>
              <div className="impact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactStats;