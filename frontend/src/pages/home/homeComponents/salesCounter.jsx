import React from "react";
import CountUp from "react-countup";
import "./SalesCounter.css";

const SalesCounter = () => {
  const totalVentas = 120; // <-- Numero de ventas
  const productosDonados = Math.floor(totalVentas / 3);

  return (
    <div className="sales-counter">
      <div className="counter-block">
        <h2 className="counter-number">
          +<CountUp start={0} end={totalVentas} duration={3} />
        </h2>
        <p className="counter-text">Ventas realizadas</p>
      </div>

      <div className="counter-block">
        <h2 className="counter-number">
          +<CountUp start={0} end={productosDonados} duration={3} />
        </h2>
        <p className="counter-text">Productos donados</p>
      </div>
    </div>
  );
};

export default SalesCounter;
