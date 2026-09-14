import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SoilMoistureCard } from "@/components/dashboard/SoilMoistureCard";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import { ScanCta } from "@/components/dashboard/ScanCta";
import { QuickAccessTools } from "@/components/dashboard/QuickAccessTools";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { YieldChart } from "@/components/dashboard/YieldChart";

export default function HomeDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-8 sm:px-8 sm:py-10">
      <DashboardHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <WeatherCard />
        <SoilMoistureCard />
        <ScanCta />
      </div>

      <QuickAccessTools />
      <RecentScans />
      <YieldChart />
    </div>
  );
}
