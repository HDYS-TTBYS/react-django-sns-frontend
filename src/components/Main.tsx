import React, { useContext } from 'react'
import Grid from "@material-ui/core/Grid";
import { GoMail } from "react-icons/go";
import { BsFillPeopleFill } from "react-icons/bs";
import { ApiContext } from '../context/ApiContext';
import Profile from './Profile';
import ProfileType from "../types/Profile";
import FriendRequest from '../types/FriendRequest';
import ProfileManager from "./ProfileManager";
import Ask from './Ask';
import { InboxDM } from './InboxDM';
import Message from '../types/Message';

const Main: React.FC = () => {

    const { profiles, myProfile, askList, askListFull, inbox } = useContext(ApiContext);

    //自分以外のプロフィールを抽出
    const filterProfiles = profiles.filter((prof: ProfileType) => { return prof.id !== myProfile.id });
    const listProfiles = filterProfiles && (
        filterProfiles.map((filpfof: ProfileType) =>
            <Profile
                key={filpfof.id}
                profileData={filpfof}
                askData={askListFull.filter((ask: FriendRequest) => {
                    return (filpfof.userPro === ask.askFrom) || (filpfof.userPro === ask.askTo)
                })} />
        ))

    return (
        <Grid container>
            {/* プロフィールリスト */}
            <Grid item xs={4}>
                <div className="app-profiles">
                    <div className="task-list">
                        {listProfiles}
                    </div>
                </div>
            </Grid>


            <Grid item xs={4}>
                {/* マイプロフィール */}
                <div className="app-details">
                    <ProfileManager />
                </div>

                {/* 承認リクエストリスト */}
                <h3 className="title-ask"><BsFillPeopleFill className="badge" />承認リクエストリスト</h3>
                <div className="app-details">
                    <div className="task-list">
                        <ul>
                            {myProfile.id && askList.map((ask: FriendRequest) =>
                                <Ask
                                    key={ask.id}
                                    ask={ask}
                                    prof={profiles.filter((item: ProfileType) => { return item.userPro === ask.askFrom })} />)}
                        </ul>
                    </div>
                </div>
            </Grid>

            {/* DM 受信トレイ */}
            <Grid item xs={4}>
                <h3><GoMail className="badge" />DM 受信トレイ</h3>
                <div className="app-dms">
                    <div className="task-list">
                        <ul>
                            {myProfile.id && inbox.map((dm: Message) =>
                                <InboxDM
                                    key={dm.id}
                                    dm={dm}
                                    prof={profiles.filter((item: ProfileType) => { return item.userPro === dm.sender })} />)}
                        </ul>
                    </div>

                </div>
            </Grid>
        </Grid>
    )
}

export default Main
