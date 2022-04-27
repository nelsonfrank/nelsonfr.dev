import { Close } from '@/components/icons'

interface sidebarProps {
    handleToggleSidebar: () => void
}
const Sidebar = ({ handleToggleSidebar }: sidebarProps) => {
    return (
        <aside className="nf-h-screen ">
            <header className="nf-flex nf-justify-end nf-my-10 nf-p-4">
                <button onClick={handleToggleSidebar}>
                    <Close />
                </button>
            </header>
            <ul className="nf-flex nf-flex-col nf-font-medium nf-text-4xl nf-items-center nf-justify-evenly nf-h-1/2">
                <li>
                    <button className="nf-text-xl focus:nf-text-primary">Blog</button>
                </li>
                <li>
                    <button className="nf-text-xl focus:nf-text-primary">
                        Projects
                    </button>
                </li>
                <li>
                    <button className="nf-text-xl focus:nf-text-primary">Uses</button>
                </li>
                <li>
                    <button className="nf-text-xl focus:nf-text-primary">
                        About
                    </button>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar