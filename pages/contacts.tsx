// components
import { SiGmail, SiGithub } from "react-icons/si";
import { BsTwitter } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import SEO from "@/components/seo";

const Contacts = () => {
	return (
		<div className='nf-mx-4'>
			<SEO title='Contact' description='Get in touch with me here' />
			<div className='nf-mb-4'>
				<h1 className='nf-font-medium nf-text-3xl'>Contacts</h1>
			</div>
			<div className='nf-px-4'>
				<div className='nf-flex nf-gap-2 nf-items-center nf-my-4'>
					<SiGithub className='nf-text-2xl' />
					<a href='https://github.com/nelsonfrank' target='_blank'>
						<span className='nf-text-primary nf-text-xl nf-font-medium'>
							nelsonfrank
						</span>
					</a>
				</div>
				<div className='nf-flex nf-gap-2 nf-items-center nf-my-4'>
					<BsTwitter className='nf-text-2xl' />
					<a href='https://twitter.com/nelsonfr_' target='_blank'>
						<span className='nf-text-primary nf-text-xl nf-font-medium'>
							nelsonfr_
						</span>
					</a>
				</div>
				<div className='nf-flex nf-gap-2 nf-items-center nf-my-4'>
					<SiGmail className='nf-text-2xl' />
					<a href='mailto:nelsonfrank741@gmail.com' target='_blank'>
						<span className='nf-text-primary nf-text-xl nf-font-medium'>
							nelsonfrank741@gmail.com
						</span>
					</a>
				</div>
				<div className='nf-flex nf-gap-2 nf-items-center nf-my-4'>
					<FaPhoneAlt className='nf-text-2xl' />
					<a href='tel:+255684404462' target='_blank'>
						<span className='nf-text-primary nf-text-xl nf-font-medium'>
							+255 68 440 4462
						</span>
					</a>
				</div>
			</div>
		</div>
	);
};

export default Contacts;
