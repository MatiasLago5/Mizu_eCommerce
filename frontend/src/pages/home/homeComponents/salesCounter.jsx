import { useEffect, useState } from "react";
import CountUp from "react-countup";
import "./SalesCounter.css";
import { fetchSalesStats } from "../../../apiFetchs/ordersFetch";

const SalesCounter = () => {
  const [stats, setStats] = useState({ totalProductsSold: 0, totalDonations: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const payload = await fetchSalesStats();
        if (!isMounted) return;

        const totalProductsSold = payload?.totalProductsSold ?? 0;
        const totalDonations = payload?.totalDonations ?? Math.floor(totalProductsSold / 3);

        setStats({ totalProductsSold, totalDonations });
        setError(null);
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "No pudimos cargar las ventas");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="sales-counter">
      {error && <p className="counter-error">{error}</p>}

      <div className="counter-block">
        <h2 className="counter-number">
          +
          <CountUp
            start={0}
            end={isLoading ? 0 : stats.totalProductsSold}
            duration={2.5}
          />
        </h2>
        <p className="counter-text">Productos vendidos</p>
      </div>

      <div className="counter-block">
        <h2 className="counter-number">
          +
          <CountUp
            start={0}
            end={isLoading ? 0 : stats.totalDonations}
            duration={2.5}
          />
        </h2>
        <p className="counter-text">Productos donados</p>
      </div>
    </div>
  );
};

export default SalesCounter;
