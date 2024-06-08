import Avatar from "./Avatar";

export default function Contact({userId, username,onClick, selectedUserId, online}) {
    return (
        <div
            onClick={() => onClick(userId)}
            key={userId}
            className={
              "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
              (selectedUserId ? "bg-blue-50" : "")
            }
          >
            {selectedUserId && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar online={online} username={username} userId={userId}></Avatar>
              <span className="text-gray-800">{username}</span>
            </div>
          </div>
    )
}