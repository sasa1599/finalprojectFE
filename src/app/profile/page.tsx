// app/profile/page.tsx
import dynamic from "next/dynamic";

const DynamicProfileContent = dynamic(() => import("./ProfileContent"), {
  ssr: false,
});

export default function ProfilePage() {
  return <DynamicProfileContent />;
}
