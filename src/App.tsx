import { Route, Routes } from "react-router";
import styles from "./App.module.scss";
import { Footer } from "./components/Footer/Footer";
import { Nav } from "./components/Nav/Nav";
import { HomePage } from "./pages/HomePage/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ProjectsPage } from "./pages/ProjectsPage/ProjectsPage";
import { ServicesPage } from "./pages/ServicesPage/ServicesPage";

export function App(): React.JSX.Element {
  return (
    <div className={styles.app}>
      <Nav />
      <main className={styles.app__main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
