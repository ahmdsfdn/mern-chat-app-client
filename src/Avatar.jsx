export default function Avatar({userId, username}){
    const colors = ['bg-red-200','bg-green-200','bg-purple-200','bg-blue-200','bg-yellow-200','bg-teal-200'];

    const userIdBase10 = parseInt(userId, 16);
    const colorParsed = colors[userIdBase10 % colors.length]
    return (
        <div className={"w-8 h-8 bg-red-200 rounded-full flex items-center "+colorParsed}>
           {/* <div className="text-center w-full opacity-70">{username[0]}</div> */}
        </div>
    )
}