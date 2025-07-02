import styles from "./SpinnerDocList.module.css";

export default function SpinnerDocList() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner_container}>
        <div className={styles.spinner1}></div>
      </div>
      <div className={styles.spinner_container}>
        <div className={styles.spinner2}></div>
      </div>
      <div className={styles.spinner_container}>
        <div className={styles.spinner3}></div>
      </div>
      <div className={styles.spinner_container}>
        <div className={styles.spinner4}></div>
      </div>
      <div className={styles.spinner_container}>
        <div className={styles.spinner5}></div>
      </div>
    </div>
  );
}
