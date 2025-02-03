"use client";

import { useEffect, useState } from "react";
import { AssetChart } from "./AssetChart";
import "swiper/css";
// Swiper styles
import "swiper/css/pagination";
// Pagination styles
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Ensure this is correctly imported

interface AssetChartCarouselProps {
  tokens: string[];
  chartColors?: string[];
}

const AssetChartCarousel: React.FC<AssetChartCarouselProps> = ({
  tokens,
  chartColors = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6"],
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 py-3 px-2">
      {isMobile ? (
        // Mobile: Swiper Carousel
        <Swiper
          spaceBetween={10}
          slidesPerView={"auto"}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="px-2"
        >
          {tokens.map((token, index) => {
            const randomColor = chartColors[index % chartColors.length];
            return (
              <SwiperSlide key={index} className="w-auto">
                <AssetChart token={token} color={randomColor} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        // Desktop: Grid layout
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
          {tokens.map((token, index) => {
            const randomColor = chartColors[index % chartColors.length];
            return <AssetChart key={index} token={token} color={randomColor} />;
          })}
        </div>
      )}
    </div>
  );
};

export default AssetChartCarousel;
