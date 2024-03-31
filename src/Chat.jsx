import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
import axios from "axios";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessage = useRef();
  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs(){
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    // Reconnecting
    ws.addEventListener("close", () => {
      setTimeout(()=>{
        console.log('disconnected. trying to reconnect');
        connectToWs()
      },1000)
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    // console.log({e, messageData});
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    // console.log('sending');
    ws.send(
      JSON.stringify({
        message: {
          recipient: selectedUserId,
          text: newMessageText,
        },
      })
    );
    setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
  }

  useEffect(()=>{
    const div = divUnderMessage.current;
    if(div){
      div.scrollIntoView({behavior:'smooth',block: 'end'});
    }

  }, [messages])

  useEffect(() => {
    if(selectedUserId) {
        axios.get('/messages/'+selectedUserId).then(res => {
          setMessages(res.data);

        })
    }
  }, [selectedUserId])

  const onlinePeopleExcludeOurUser = { ...onlinePeople };
  delete onlinePeopleExcludeOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, "_id");
  // console.log(messagesWithoutDupes)

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo></Logo>
        {Object.keys(onlinePeopleExcludeOurUser).map((userId) => (
          <div
            onClick={() => setSelectedUserId(userId)}
            key={userId}
            className={
              "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUserId ? "bg-blue-50" : "")
            }
          >
            {userId === selectedUserId && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar username={onlinePeople[userId]} userId={userId}></Avatar>
              <span className="text-gray-800">{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">
                &larr; Select a person from the sidebar
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map((message, i) => (
                  <div
                    key={i}
                    className={message.sender === id ? "text-right" : "text-left"}
                  >
                    <div
                      className={
                        "inline-block p-2 my-2 rounded-md text-sm " +
                        (message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                      key={i}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessage}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMessageText}
              type="text"
              className="bg-white border p-2 flex-grow rounded-sm"
              onChange={(ev) => setNewMessageText(ev.target.value)}
              placeholder="Type your message here"
            ></input>
            <button
              type="submit"
              className="rounded-sm bg-blue-500 p-2 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
