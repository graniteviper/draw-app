import RoomCanvas from "@/components/RoomCanvas";

const canvas = async ({params}: {
  params: {
    roomId: string
  }
}) => {

    const roomId = (await params).roomId;
    // console.log(roomId);
    
    // Hot Reloading

  return (
    <div>
      <RoomCanvas roomId={roomId}/>
    </div>
  )
}

export default canvas