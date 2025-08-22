import clsx from "clsx";
import styles from "./SpinnerDownload.module.css";

export default function SpinnerDownload({className={}}) {
  return (
    <div className="w-4 h-4 flex justify-center items-center pr-0.5 m-0">
      <div className={clsx(styles.spinner, className)}></div>
    </div>
  );
}
