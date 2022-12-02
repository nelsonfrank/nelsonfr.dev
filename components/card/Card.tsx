import { useState } from "react";

import fallbackImage from "@/public/fallback.jpg";

interface CardProps {
  title: string;
  description?: string;
  img?: string;
  fallbackImg?: string;
  repoUrl?: string;
  url?: string;
}

const Card = ({
  title,
  description,
  img,
  fallbackImg = "/fallback.jpg",
  repoUrl,
  url,
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
        <div className="nf-flex nf-py-2">
          <ul className="nf-flex nf-list-none nf-p-0 nf-my-0">
            {repoUrl && (
              <li className="nf-mr-4 nf-text-primary">
                <a href={repoUrl} target="_blank">
                  Code
                </a>
              </li>
            )}
            {url && (
              <li className="nf-mr-4 nf-text-primary">
                <a href={url} target="_blank">
                  Preview
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
