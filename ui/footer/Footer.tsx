import Github from "@/components/icons/github";
import Twitter from "@/components/icons/twitter";

const Footer = () => (
  <footer className="nf-bg-gray-light">
    <section className="nf-w-full nf-flex nf-flex-col nf-mt-12 nf-p-4">
      <div className="nf-flex nf-items-end nf-justify-center nf-mb-4">
        <div className="nf-mr-4">
          <a href="https://github.com/nelsonfrank" target="_blank">
            <Github />
          </a>
        </div>
        <div className="nf-mr-4">
          <a href="https://twitter.com/nelsonfr_" target="_blank">
            <Twitter />
          </a>
        </div>
      </div>
      <div className="nf-flex nf-items-end nf-justify-center">
        <p> All right reserved &copy; {new Date().getFullYear()}</p>
      </div>
    </section>
  </footer>
);

export default Footer;
