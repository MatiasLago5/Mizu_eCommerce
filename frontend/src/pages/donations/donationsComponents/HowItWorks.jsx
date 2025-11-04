import React from 'react';

function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Comprás",
      text: "Elegís tus productos de higiene favoritos"
    },
    {
      number: 2,
      title: "Sumamos",
      text: "Por cada 3 del mismo producto, separamos 1"
    },
    {
      number: 3,
      title: "Donamos",
      text: "Lo entregamos directamente a refugios"
    }
  ];

  return (
    <section className="sticky-section how-section">
      <div className="section-content">
        <h2 className="section-title">¿Cómo Funciona?</h2>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;