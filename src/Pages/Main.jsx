import Chat from "../Components/Main/Chat";
import ChatList from "../Components/Main/ChatList";
import Details from "../Components/Main/Details";

const Main = () => {
    return (
        <div className="grid grid-cols-3 gap-6">
            <ChatList/>
            <Chat/>
            <Details/>
        </div>
    );
};

export default Main;