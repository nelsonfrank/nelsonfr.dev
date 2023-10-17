// components
import { SiGmail, SiGithub } from "react-icons/si";
import { BsTwitter } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import SEO from "@/components/seo";

const Contacts = () => {
	return (
		<div className='mx-4'>
			<SEO title='Contact' description='Get in touch with me here' />
			<div className='mb-4'>
				<h1 className='font-medium text-3xl'>Contacts</h1>
			</div>
			<div className='px-4'>
				<div className='flex gap-2 items-center my-4'>
					<SiGithub className='text-2xl' />
					<a href='https://github.com/nelsonfrank' target='_blank'>
						<span className='text-primary text-xl font-medium'>
							nelsonfrank
						</span>
					</a>
				</div>
				<div className='flex gap-2 items-center my-4'>
					<BsTwitter className='text-2xl' />
					<a href='https://twitter.com/nelsonfr_' target='_blank'>
						<span className='text-primary text-xl font-medium'>nelsonfr_</span>
					</a>
				</div>
				<div className='flex gap-2 items-center my-4'>
					<SiGmail className='text-2xl' />
					<a href='mailto:nelsonfrank741@gmail.com' target='_blank'>
						<span className='text-primary text-xl font-medium'>
							nelsonfrank741@gmail.com
						</span>
					</a>
				</div>
				<div className='flex gap-2 items-center my-4'>
					<FaPhoneAlt className='text-2xl' />
					<a href='tel:+255684404462' target='_blank'>
						<span className='text-primary text-xl font-medium'>
							+255 68 440 4462
						</span>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Contacts;
