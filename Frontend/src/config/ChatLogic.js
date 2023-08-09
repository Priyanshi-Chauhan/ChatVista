export const getSender = (loggedUser, users) => {
return users[0]._id === loggedUser._id ? users[1].name: users[0].name
}

export const getSenderFull = (loggedUser, users) =>{ 
     return users[0]._id === loggedUser._id ? users[1] : users[0];
}
                             //m =currentmessage ,  i = indexofthecurrentmessage , userId  = loggedIn UserId
export const isSameSender = (messages, m, i, userId) => {
     return (
          // means other user hain, so we have to show the profile pic
          i < messages.length - 1 &&
          (messages[i + 1].sender._id !== m.sender._id ||
               messages[i + 1].sender._id === undefined) &&
             m.sender._id !== userId
     
     )
}

export const isLastMessage = (messages, i, userId) => {
     return (
          i === messages.length - 1 && 
          messages[i].sender._id !== userId && 
          messages[i].sender._id
          )
}

export const isSameSenderMargin = (messages, m, i, userId) => {
     if ( 
          // checking if the person who is logged in is sending message
          i < messages.length - 1 &&
          messages[i + 1].sender._id === m.sender._id &&
          messages[i].sender._id !== userId
     )
          return 33;
     else if (
          (i < messages.length - 1 &&
               messages[i + 1].sender._id !== m.sender._id &&
               messages[i].sender._id !== userId) ||
          (i === messages.length - 1 && messages[i].sender._id !== userId)
     )
          return 0;
     else return "auto";
}


export const isSameUser = (messages, m, i) => {
      return i> 0 && messages[i-1].sender._id === m.sender._id
}