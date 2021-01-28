import React from 'react'
import { RiUserReceivedLine } from "react-icons/ri";

export const InboxDM = ({ dm, prof }: any) => {

    return (
        <li className="list-item">
            {prof[0] && <h4>{dm.message}</h4>}
            {prof[0] && <h4><RiUserReceivedLine className="badge" />{prof[0].nickName}</h4>}
        </li>
    )
}
