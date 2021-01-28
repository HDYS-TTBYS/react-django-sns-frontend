import React, { createContext, useState, useEffect } from 'react'
import { withCookies } from 'react-cookie';
import axios from "axios";
import { apiBaseURL } from '../axios';
import FriendRequest from '../types/FriendRequest';
import ProfileType from '../types/Profile';
import Message from '../types/Message';

export const ApiContext = createContext<any>("");

const ApiContextProvider = (props: any) => {

    const token = props.cookies.get("current-token");
    const [myProfile, setMyProfile] = useState<ProfileType>({ id: "", nickName: "" });
    const [profiles, setProfiles] = useState<ProfileType[]>([]);
    const [editedProfile, setEditedProfile] = useState<ProfileType>({ id: "", nickName: "" });
    const [askListFull, setAskListFull] = useState<FriendRequest[]>([]);
    const [askList, setAskList] = useState<FriendRequest[]>([]);
    const [inbox, setInbox] = useState<Message[]>([]);
    const [cover, setCover] = useState<any>([]);

    useEffect(() => {
        const getMyProfile = async () => {
            //マイプロフィールを取得
            try {
                const resmy = await axios.get(`${apiBaseURL}/api/user/myprofile/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                })
                //自分宛フレンドリクエストの取得
                const res = await axios.get(`${apiBaseURL}/api/user/approval/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                })
                resmy.data[0] && setMyProfile(resmy.data[0]);
                resmy.data[0] && setEditedProfile({
                    id: resmy.data[0].id,
                    nickName: resmy.data[0].nickName
                });
                //自分宛承認リスト
                res.data[0] && setAskList(
                    res.data.filter((ask: FriendRequest) => {
                        return resmy.data[0].userPro === ask.askTo
                    }));
                //承認リスト全て
                setAskListFull(res.data);
            } catch {
                console.log("error");
            }
        }

        const getProfile = async () => {
            //プロフィール一蘭を取得
            try {
                const res = await axios.get(`${apiBaseURL}/api/user/profile/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                })
                setProfiles(res.data);
            } catch {
                console.log("error");
            }
        }

        const getInbox = async () => {
            // 受取人が自分のメッセージ一蘭を取得
            try {
                const res = await axios.get(`${apiBaseURL}/api/dm/inbox/`, {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                })
                setInbox(res.data);
            } catch {
                console.log("error");
            }
        }
        getMyProfile();
        getProfile();
        getInbox();
    }, [token, myProfile.id])

    const createProfile = async () => {
        const createData = new FormData();
        createData.append("nickName", editedProfile.nickName);
        cover.name && createData.append("img", cover as any, cover.name);
        try {
            const res = await axios.post(`${apiBaseURL}/api/user/profile/`, createData, {
                headers: {
                    "Content-Type": "applocation/json",
                    "Authorization": `Token ${token}`
                }
            })
            setMyProfile(res.data);
            setEditedProfile(res.data);
        } catch {
            console.log("error");
        }
    }

    const deleteProfile = async () => {
        try {
            await axios.delete(`${apiBaseURL}/api/user/profile/${myProfile.id}/`, {
                headers: {
                    "Content-Type": "applocation/json",
                    "Authorization": `Token ${token}`
                }
            })
            setProfiles(profiles.filter(dev => dev.id !== myProfile.id));
            setMyProfile({ id: "", nickName: "" });
            setEditedProfile({ id: "", nickName: "" });
            setCover([]);
            setAskList([]);
        } catch {
            console.log("error");
        }
    }

    const editProfile = async () => {
        const editData = new FormData();
        editData.append("nickName", editedProfile.nickName);
        cover.name && editData.append("img", cover, cover.name);

        try {
            const res = await axios.put(`${apiBaseURL}/api/user/profile/${myProfile.id}/`, editData, {
                headers: {
                    "Content-Type": "applocation/json",
                    "Authorization": `Token ${token}`
                }
            })
            setMyProfile(res.data)
        } catch {
            console.log("error")
        }
    }

    const newRequestFriend = async (askData: HTMLFormElement) => {
        try {
            const res = await axios.post(`${apiBaseURL}/api/user/approval/`, askData, {
                headers: {
                    "Content-Type": "applocation/json",
                    "Authorization": `Token ${token}`
                }
            })
            setAskListFull([...askListFull, res.data]);
        } catch {
            console.log("error");
        }
    }

    const sendDMContent = async (uploadDM: HTMLFormElement) => {
        try {
            await axios.post(`${apiBaseURL}/api/dm/message/`, uploadDM, {
                headers: {
                    "Content-Type": "applocation/json",
                    "Authorization": `Token ${token}`
                }
            })
        } catch {
            console.log("error");
        }
    }

    const changeApprovalRequest = async (uploadDataAsk: HTMLFormElement, ask: FriendRequest) => {
        try {
            const res = await axios.put(`${apiBaseURL}/api/user/approval/${ask.id}/`, uploadDataAsk, {
                headers: {
                    "Content-Type": "applocation/json",
                    "Authorization": `Token ${token}`
                }
            })
            setAskList(askList.map(item => (item.id === ask.id ? res.data : item)));
            const newDataAsk = new FormData();
            newDataAsk.append("askTo", ask.askFrom as any);
            newDataAsk.append("approved", true as any);

            const newDataAskPut = new FormData();
            newDataAskPut.append("askTo", ask.askFrom as any);
            newDataAskPut.append("askTFrom", ask.askTo as any);
            newDataAskPut.append("approved", true as any);

            const resp = askListFull.filter(item => { return (item.askFrom === myProfile.userPro && item.askTo === ask.askFrom) });
            !resp[0] ?
                await axios.post(`${apiBaseURL}/api/user/approval/`, newDataAsk, {
                    headers: {
                        "Content-Type": "applocation/json",
                        "Authorization": `Token ${token}`
                    }
                })
                :
                await axios.put(`${apiBaseURL}/api/user/approval/${resp[0].id}`, newDataAskPut, {
                    headers: {
                        "Content-Type": "applocation/json",
                        "Authorization": `Token ${token}`
                    }
                })
        } catch {
            console.log("error")
        }
    }

    return (
        <ApiContext.Provider
            value={{
                myProfile,
                profiles,
                cover,
                setCover,
                askList,
                askListFull,
                inbox,
                newRequestFriend,
                createProfile,
                editProfile,
                deleteProfile,
                changeApprovalRequest,
                sendDMContent,
                editedProfile,
                setEditedProfile,
            } as any}
        >
            {props.children}
        </ApiContext.Provider>
    );
}

export default withCookies(ApiContextProvider);
