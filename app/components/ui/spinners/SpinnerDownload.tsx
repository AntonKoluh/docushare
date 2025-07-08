import styles from "./SpinnerDownload.module.css";

export default function SpinnerDownload() {
  return (
    <div className="w-4 h-4 flex justify-center items-center pr-0.5 m-0">
      <div className={styles.spinner}></div>
    </div>
  );
}
