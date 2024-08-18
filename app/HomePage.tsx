import Link from "next/link";
import styles from "./home.module.css";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to Sprout & Scribble</h1>
      <p>Click the button below to explore our products.</p>
      <Link href="/products">
        <button className={styles.button}>View Products</button>
      </Link>
    </div>
  );
};

export default HomePage;
