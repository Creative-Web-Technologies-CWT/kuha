import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Message } from "../../pages/chat/Chat";
import ChatsHistory from "./ChatsHistory";
import SidebarFooter from "./SidebarFooter";

import styles from "./ChatHistory.module.css";

interface SidebarProps {
    handleCreateNewChat: () => void;
    handleSidebarExpand: () => void;
    handleSelectExistingChat: (title: string) => void;
    previousMessages: Message[];
    className?: string;
    isSidebarExpand?: boolean;
}

const chatTitles = [
    "Croatia-Reports",
    "SriLanka-Invoice",
    "Support Chat"
];

export const Sidebar = ({ className, previousMessages, handleCreateNewChat, handleSelectExistingChat, isSidebarExpand, handleSidebarExpand }: SidebarProps) => {
    // const chatTitles = Array.from(new Set(previousMessages.map(prev => prev.title)));
    return (
        isSidebarExpand ?
            <div className={`${styles.container} ${className ?? ""}`}>
                <div className={styles.sidebarHeader}>

                    <Button className={styles.newChatButton} onClick={handleCreateNewChat}>
                        <Icon as={AiOutlinePlus} mr={3} />
                        <Text fontSize="0.875rem">New chat</Text>
                    </Button>

                    <Button className={styles.expandButton} onClick={handleSidebarExpand}>
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"
                             strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em"
                             xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                    </Button>
                </div>

                <ChatsHistory handleSelectExistingChat={handleSelectExistingChat} titles={chatTitles} />

                {/*<SidebarFooter />*/}
            </div>
            :
            <div className={`${styles.expandContainer} ${className ?? ""} `}>
                <div className={styles.sidebarHeader}>
                    <Button className={`${styles.expandButton2}`} onClick={handleSidebarExpand}>
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 25 25" strokeLinecap="round"
                             strokeLinejoin="round" className="h-4 w-4" height="1.2em" width="1.2em"
                             xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                    </Button>
                </div>
            </div>
    );
};

export default Sidebar;
