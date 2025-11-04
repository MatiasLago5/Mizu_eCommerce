import React from 'react';

function RefugesList() {
  const refuges = [
    {
      name: "Refugio Esperanza",
      location: "Montevideo",
      description: "Hogar temporal para familias en situación de vulnerabilidad",
      donated: "+500 productos donados"
    },
    {
      name: "Casa Abrigo",
      location: "Canelones",
      description: "Refugio para mujeres y niños en situación de violencia",
      donated: "+350 productos donados"
    },
    {
      name: "Hogar del Sol",
      location: "Maldonado",
      description: "Centro de acogida para personas en situación de calle",
      donated: "+420 productos donados"
    },
    {
      name: "Refugio San José",
      location: "San José",
      description: "Albergue para adultos mayores en situación de vulnerabilidad",
      donated: "+280 productos donados"
    }
  ];

  return (
    <section className="sticky-section refuges-section">
      <div className="section-content">
        <h2 className="section-title">Refugios Beneficiados</h2>
        <div className="refuges-grid">
          {refuges.map((refuge, index) => (
            <div key={index} className="refuge-card">
              <h3 className="refuge-name">{refuge.name}</h3>
              <p className="refuge-location">📍 {refuge.location}</p>
              <p className="refuge-description">{refuge.description}</p>
              <div className="refuge-stat">{refuge.donated}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RefugesList;