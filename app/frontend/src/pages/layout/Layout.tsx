import { Outlet, NavLink, Link } from "react-router-dom";

import styles from "./Layout.module.css";

const Layout = () => {
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    {/* <img className={styles.creativeLogo} src="src/assets/creativeLogo.png"></img> */}
                    <img width={130} src={"/creativeLogo.png"} />
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h4 className={styles.headerTitle}>Enterprise Search</h4>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li>
                            <li className={styles.headerNavLeftMargin}>
                                <NavLink to="/qa" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Ask a question
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                    <h4 className={styles.headerRightText}></h4>
                </div>
            </header>

            <Outlet />
        </div>
    );
};

export default Layout;
