import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Uses",
	description: "My current tools i use for developments and work",
};
const Uses = () => (
	<div className='w-full mx-4'>
		<div>
			<h1 className='text-3xl font-semibold mt-4 mb-8'>Uses</h1>
		</div>
		<div className='flex justify-center'>
			<div>
				<img src='/desktop-setup.webp' alt='Desktop setup' />
			</div>
		</div>
		<div className='my-8'>
			<div className='my-4'>
				<h2 className='font-medium text-xl'>Editor</h2>
				<ul>
					<li className='list-disc ml-8'>Vs Code</li>
					<li className='list-disc ml-8'>Vim</li>
					<li className='list-disc ml-8'>Obsidian (Markdown editor)</li>
				</ul>
			</div>
			<div className='my-4'>
				<h2 className='font-medium text-xl'>Laptop and Peripherals</h2>
				<ul>
					<li className='list-disc ml-8'>Lenovo T490s Laptop- 14inch</li>
					<li className='list-disc ml-8'>Dell U2712D Monitor - 27 inch</li>
					<li className='list-disc ml-8'>Logitech K235 Keyboard</li>
					<li className='list-disc ml-8'>Logitech M170 Mouse</li>
				</ul>
			</div>
			<div className='my-4'>
				<h2 className='font-medium text-xl'>OS and Configuration</h2>
				<ul>
					<li className='list-disc ml-8'>Ubuntu 22.04</li>
					<li className='list-disc ml-8'>i3 window manager</li>
					<li className='list-disc ml-8'>Polybar</li>
					<li className='list-disc ml-8'>Rofi</li>
					<li className='list-disc ml-8'>Picom</li>
				</ul>
			</div>
		</div>
	</div>
);

export default Uses;
