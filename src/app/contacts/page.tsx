import { Metadata } from "next";
// components
import { SiGmail, SiGithub } from "react-icons/si";
import { BsTwitter } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";

export const metadata: Metadata = {
	title: "Contact",
	description: "Get in touch with me here",
};

const Contacts = () => {
	return (
    <div className="mx-4">
      <div className="mb-4">
        <h1 className="text-3xl font-medium">Contacts</h1>
      </div>
      <div className="px-4">
        <div className="my-4 flex items-center gap-2">
          <SiGithub className="text-2xl" />
          <a href="https://github.com/nelsonfrank" target="_blank">
            <span className="text-xl font-medium text-primary">
              nelsonfrank
            </span>
          </a>
        </div>
        <div className="my-4 flex items-center gap-2">
          <BsTwitter className="text-2xl" />
          <a href="https://twitter.com/nelsonfr_" target="_blank">
            <span className="text-xl font-medium text-primary">nelsonfr_</span>
          </a>
        </div>
        <div className="my-4 flex items-center gap-2">
          <SiGmail className="text-2xl" />
          <a href="mailto:nelsonfrank741@gmail.com" target="_blank">
            <span className="text-xl font-medium text-primary">
              nelsonfrank741@gmail.com
            </span>
          </a>
        </div>
        {/* <div className='flex gap-2 items-center my-4'>
					<FaPhoneAlt className='text-2xl' />
					<a href='tel:+255684404462' target='_blank'>
						<span className='text-primary text-xl font-medium'>
							+255 68 440 4462
						</span>
					</a>
				</div> */}
      </div>
    </div>
  );
};

export default Contacts;
