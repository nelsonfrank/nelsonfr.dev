// components
import Github from "@/components/icons/github";
import Gmail from "@/components/icons/gmail";
import Twitter from "@/components/icons/twitter";

const Contacts = () => {
  return (
    <div className="nf-mx-4">
      <div className="nf-mb-4">
        <h1 className="nf-font-medium nf-text-3xl">Contacts</h1>
      </div>
      <div className="nf-px-4">
        <div className="nf-flex nf-gap-2 nf-items-center nf-my-4">
          <Github height={40} width={40} />
          <a href="https://github.com/nelsonfrank" target="_blank">
            <span className="nf-text-primary nf-text-xl nf-font-medium">
              Nelsonfrank
            </span>
          </a>
        </div>
        <div className="nf-flex nf-gap-2 nf-items-center nf-my-4">
          <Twitter height={40} width={40} />
          <a href="https://twitter.com/nelsonfr_" target="_blank">
            <span className="nf-text-primary nf-text-xl nf-font-medium">
              Nelsonfr_
            </span>
          </a>
        </div>
        <div className="nf-flex nf-gap-2 nf-items-center nf-my-4">
          <Gmail height={40} width={40} />
          <a href="mailto:nelsonfrank741@gmail.com" target="_blank">
            <span className="nf-text-primary nf-text-xl nf-font-medium">
              nelsonfrank741@gmail.com
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
