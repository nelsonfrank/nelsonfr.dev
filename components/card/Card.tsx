import { useState } from "react";

import fallbackImage from "@/public/fallback.jpg";

interface CardProps {
  title: string;
  description?: string;
  img?: string;
  fallbackImg?: string;
}

const Card = ({
  title,
  description,
  img,
  fallbackImg = "/fallback.jpg",
}: CardProps) => {
  const [error, setError] = useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);
  return (
    <div className="nf-max-w-sm nf-mx-4 nf-my-4 nf-bg-white nf-rounded-lg nf-border nf-border-gray nf-shadow-md">
      <a href="#">
        <img
          className="nf-rounded-t-lg"
          src={error ? fallbackImg : img}
          alt={description}
          onError={setError}
        />
      </a>
      <div className="nf-py-5 nf-px-4">
        <h5 className="nf-my-2 nf-text-xl nf-font-bold nf-tracking-normal nf-text-gray-900">
          {title}
        </h5>
        <p className="nf-mb-3 nf-font-normal nf-text-left nf-text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Card;
