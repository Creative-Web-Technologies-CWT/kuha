import React from "react";

import styles from "./HelpFaqButton.module.css";

interface HelpFaqButtonProps {
    onClick: () => void;
}

const HelpFaqButton: React.FC<HelpFaqButtonProps> = ({ onClick }) => {
    return (
        <button className={styles.helpFaqButton} onClick={onClick}>
            Help & FAQ
        </button>
    );
};

export default HelpFaqButton;
