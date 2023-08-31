import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const addToast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      addToast({
        title: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          // we are supposed to send the jwt token, and we have made this route as "protected", so it takes some headers
          Authorization: `Bearer ${user.token}`,
        },
      }; // ?  -> after this query is passed
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      addToast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config); // this userid has come from usercontroller

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      console.log(data);
      setLoadingChat(false);
      onClose(); // to close the side drawer
    } catch (error) {
      addToast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa fa-search"></i>

            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text>Chat Vista</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* thse notifications are not persistent in the database */}
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              ></NotificationBadge>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* for notifications, the menu list is  - */}
            <MenuList pl={3}>
              {!notifications.length && "No New Messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatame}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton // using icon inside the menu button
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                {/* below MenuItem is the children of the ProfileModal */}
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>Search Users</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search} // such that it is a controlled input
                  onChange={(e) => setSearch(e.target.value)}
                />

                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                // optional chaining
                searchResults?.map(
                  (
                    user // handlesearch se users jo aaye , unki chat access krre hain
                  ) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  )
                )
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
