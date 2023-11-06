import { Separator } from "@/components/ui/separator";
import { Divider } from "@/components/ui/divider";

const Footer = () => (
  <footer className="bg-gray-light">
    <Divider />
    <section className="w-full px-4 py-8 md:px-0">
      <div className="flex flex-col items-center justify-center">
        <p> Copyright &copy; {new Date().getFullYear()}</p>
        <Separator
          orientation="vertical"
          className="mx-4 hidden h-4 md:block"
        />
        <p>All rights reserved.</p>
      </div>
    </section>
  </footer>
);

export default Footer;
