import styles from "./SpinnerPageLoading.module.css";

const SpinnerPageLoading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <h3 className="text-gray-700!">Loading....</h3>
    </div>
  );
};

export default SpinnerPageLoading;
