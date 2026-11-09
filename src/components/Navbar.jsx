import { Bell, Command, Menu, Moon, Sun } from "lucide-react";

export default function Navbar({ theme, onToggleTheme, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" aria-label="Open menu" onClick={onMenuClick}>
        <Menu size={19} />
      </button>
      <a className="mobile-brand" href="#overview" aria-label="AI Data Analyst home">
        <span className="brand-mark"><Command size={17} /></span>
        <span>data<span className="brand-light">wise</span></span>
      </a>
      <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>Overview</strong></div>
      <div className="topbar-actions">
        <span className="live-status"><span /> All systems operational</span>
        <button className="icon-button" aria-label="Notifications"><Bell size={18} /><i className="notification-dot" /></button>
        <button className="icon-button" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} onClick={onToggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="avatar" title="Your profile">A</div>
      </div>
    </header>
  );
}
