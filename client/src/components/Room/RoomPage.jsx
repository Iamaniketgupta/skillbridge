import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../../../constant";

const RoomPage = () => {
    const user = useSelector((state) => state.auth.user);
    const { roomId } = useParams();
    const elementRef = useRef(null);
    const zcRef = useRef(null); 

    useEffect(() => {
        const myMeeting = async () => {
            const APP_ID = 1455837037;
            const SERVER_SECRET = 'd0c816a85a98b775f53cd72a5ba0accb';
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(APP_ID, SERVER_SECRET, roomId, user._id, user.fullName);
            const zc = ZegoUIKitPrebuilt.create(kitToken);

            zc.joinRoom({
                container: elementRef.current,
                sharedLinks: [{
                    name: "Copy Link",
                    url: SERVER_URL+`/room/${roomId}`,
                }],
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall
                },
                showScreenSharingButton: true,
            });
        };

        myMeeting();

        return () => {
            if (zcRef.current) {
                zcRef.current.leaveRoom(); 
                zcRef.current = null; 
            }
        };
    }, [roomId, user]);

    return (
        <div>
            <div ref={elementRef} />
        </div>
    );
};

export default RoomPage;
