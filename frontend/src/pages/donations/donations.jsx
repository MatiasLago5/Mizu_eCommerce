
import './donationsStyles.css';
import HeroSection from './donationsComponents/HeroSection';
import HowItWorks from './donationsComponents/HowItWorks';
import RefugesList from './donationsComponents/RefugesList';
import ImpactStats from './donationsComponents/ImpactStats';
import ProductsList from './donationsComponents/ProductsList';
import CTASection from './donationsComponents/CTASection';
function Donations() {
  return (
    <div className="donations-page">
      <HeroSection />
      <HowItWorks />
      <RefugesList />
      <ImpactStats />
      <ProductsList />
      <CTASection />
    </div>
  );
}

export default Donations;