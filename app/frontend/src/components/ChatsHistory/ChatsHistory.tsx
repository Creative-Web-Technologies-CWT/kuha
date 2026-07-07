import { List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import React from "react";
import { FiMessageSquare } from "react-icons/fi";

interface ChatsHistoryProps {
    titles: string[];
    handleSelectExistingChat: (title: string) => void;
}

export const ChatsHistory = ({ titles, handleSelectExistingChat }: ChatsHistoryProps) => {
    return (
        <List mt={3} spacing={3} padding={0}>
            {titles?.map(title => (
                <ListItem
                    key={title}
                    display="flex"
                    alignItems="center"
                    p={3}
                    borderRadius="6px"
                    _hover={{ bg: "#2A2B32", pr: 4 }}
                    cursor="pointer"
                    wordBreak="break-all"
                    onClick={() => handleSelectExistingChat(title)}
                >
                    <ListIcon as={FiMessageSquare} w={30} h={20}  px={7}/>
                    <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" flexGrow={1}>
                        {title}
                    </Text>
                </ListItem>
            ))}
        </List>
    );
};

export default ChatsHistory;
