import { Button, Flex, Icon, Image, Tag, Text } from "@chakra-ui/react";
import React from "react";
import { FiUser } from "react-icons/fi";

import styles from "./ChatHistory.module.css";

const SidebarFooter: React.FC = () => {
    return (
        <Flex direction="column" align="flex-start" width="full">
            <Button className={styles.footerButton}>
                <Flex>
                    <Icon as={FiUser} mr={3} />
                    <Text>Upgrade to Plus</Text>
                </Flex>

                <Tag variant="solid" borderRadius="6px" bg="black" color="white" size="lg" p="2px 6px">
                    NEW
                </Tag>
            </Button>
            <Button className={styles.footerButton}>
                <Image borderRadius="2px" w="20px" h="20px" mr={3} src="/claire-2022.png" />
                <Text fontSize="14px">chamath.peiris@gmail.com</Text>
            </Button>
        </Flex>
    );
};
export default SidebarFooter;
