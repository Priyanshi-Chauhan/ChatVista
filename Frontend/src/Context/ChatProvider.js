import {createContext, useContext, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children}) => {    // children is whole of our app
    // if we create this state inside of a component, it will be accessible just inside the component
    // but since we are making this inside of a contextApi, we can make it accessible to whole of our app by passing it in the value
    const[user, setUser] = useState();
    const[selectedChat, setSelectedChat] = useState();
    const[chats, setChats] =  useState([]); // so that we can populate all of our current chats 
    const [notifications, setNotifications] = useState([]);

    const history = useHistory();
    useEffect(()=>{
        // since it will be in the stringify format , we are going to parse it
   const userInfo =  JSON.parse(localStorage.getItem("userInfo")); 
   setUser(userInfo);
  console.log("UserInfo Inside ChatProvider", userInfo);
    if(!userInfo){   // if user is not logged in
     history.push("/");
     }
    
    },[history])
    return  (
        <ChatContext.Provider value = 
        {{user,
             setUser, 
              selectedChat
               ,setSelectedChat,
                chats,
            setChats, 
            notifications, 
                 setNotifications
                }}>{children}</ChatContext.Provider>
     )
}


// useContext(ChatContext);

export const ChatState = () =>{
    return useContext(ChatContext);   //inside of this , we are going to have all of our state
}
export default ChatProvider;