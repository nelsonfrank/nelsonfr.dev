// components
import Github from "@/components/icons/github";
import Twitter from "@/components/icons/twitter";

const Footer = () => (
	<footer className='bg-gray-light'>
		<section className='w-full flex flex-col mt-12 p-4'>
			<div className='flex items-end justify-center mb-4'>
				<div className='mr-4'>
					<a href='https://github.com/nelsonfrank' target='_blank'>
						<Github />
					</a>
				</div>
				<div className='mr-4'>
					<a href='https://twitter.com/nelsonfr_' target='_blank'>
						<Twitter />
					</a>
				</div>
			</div>
			<div className='flex items-end justify-center'>
				<p> All right reserved &copy; {new Date().getFullYear()}</p>
			</div>
		</section>
	</footer>
);

export default Footer;
