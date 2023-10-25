"use client";
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
		<div className='max-w-sm mx-4 my-4 bg-white rounded-lg border border-gray shadow-md'>
			<a href='#'>
				<img
					className='rounded-t-lg'
					src={error ? fallbackImg : img}
					alt={description}
					onError={setError}
				/>
			</a>
			<div className='py-5 px-4'>
				<h5 className='my-2 text-xl font-bold tracking-normal text-gray-900'>
					{title}
				</h5>
				<p className='mb-3 font-normal text-left text-gray-700'>
					{description}
				</p>
				<div className='flex py-2'>
					<ul className='flex list-none p-0 my-0'>
						{repoUrl && (
							<li className='mr-4 text-primary'>
								<a href={repoUrl} target='_blank'>
									Code
								</a>
							</li>
						)}
						{url && (
							<li className='mr-4 text-primary'>
								<a href={url} target='_blank'>
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
