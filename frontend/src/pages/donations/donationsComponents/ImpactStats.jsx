import { useEffect, useMemo, useState } from 'react';
import { fetchSalesStats } from '../../../apiFetchs/ordersFetch';

function ImpactStats() {
  const [impact, setImpact] = useState({
    totalOrders: 0,
    totalProductsSold: 0,
    totalDonations: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadImpact = async () => {
      try {
        const data = await fetchSalesStats();
        if (!isMounted) return;
        setImpact({
          totalOrders: data?.totalOrders ?? 0,
          totalProductsSold: data?.totalProductsSold ?? 0,
          totalDonations: data?.totalDonations ?? 0,
        });
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || 'No pudimos cargar el impacto');
      }
    };

    loadImpact();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => ([
    {
      number: impact.totalDonations,
      label: 'Productos Donados',
    },
    {
      number: impact.totalOrders,
      label: 'Compras Solidarias',
    },
    {
      number: impact.totalProductsSold,
      label: 'Productos Entregados',
    },
  ]), [impact]);

  const formatNumber = (value) => {
    const number = Number(value) || 0;
    return number.toLocaleString('es-UY');
  };

  return (
    <section className="sticky-section impact-section">
      <div className="section-content">
        <h2 className="section-title">Nuestro Impacto</h2>
        {error && <p className="impact-error">{error}</p>}
        <div className="impact-grid">
          {stats.map((stat, index) => (
            <div key={index} className="impact-card">
              <div className="impact-number">{formatNumber(stat.number)}</div>
              <div className="impact-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactStats;