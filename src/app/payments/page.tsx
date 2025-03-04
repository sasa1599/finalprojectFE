// app/payments/page.tsx
import dynamic from "next/dynamic";

const DynamicPaymentPage = dynamic(() => import("./PaymentPageContent"), {
  ssr: false,
});

export default function PaymentPageWrapper() {
  return <DynamicPaymentPage />;
}
