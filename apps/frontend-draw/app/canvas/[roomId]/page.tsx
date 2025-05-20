import Roomcanvas from "@/components/Roomcanvas";
import React from "react";

const page = async ({params}:{
  params:{
    roomId: string
  }
}) => {

  const roomId = (await params).roomId;
  return (
      <div className="w-full h-full overflow-hidden">
        <Roomcanvas roomId={roomId}/>
      </div>
  );
};

export default page;