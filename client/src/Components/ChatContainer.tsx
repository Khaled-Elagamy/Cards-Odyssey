import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
type ChatProps = {
  room: string;
};
const ChatContainer = (props: ChatProps) => {
  return (
    <div>
      <ChatInput room={props.room} />
      <MessageList />
    </div>
  );
};

export default ChatContainer;
