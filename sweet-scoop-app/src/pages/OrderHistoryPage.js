import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderHistorySection from "../components/OrderHistorySection";

function OrderHistoryPage() {
  return (
    <div className="flavors-page">
      <Header />
      <OrderHistorySection />
      <Footer />
    </div>
  );
}

export default OrderHistoryPage;
