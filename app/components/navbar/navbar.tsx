import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <div className="bg-[rgba(0,0,0,0.65)] w-full">
      <nav className="flex flex-row justify-between items-center h-30 w-full max-w-7xl mx-auto">
        <div>
          <p className={styles.link}>Logo</p>
        </div>
        <div>
          <p className={styles.link}>Links</p>
        </div>
        <div>
          <p className={styles.link}>Login</p>
        </div>
      </nav>
    </div>
  );
}
