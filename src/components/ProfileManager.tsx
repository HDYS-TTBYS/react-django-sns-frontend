import React, { useContext, useState } from 'react'
import { ApiContext } from "../context/ApiContext";
import { makeStyles } from "@material-ui/core/styles";
import LocationOn from "@material-ui/icons/LocationOn";
import { BsPersonCheckFill } from "react-icons/bs";
import { MdAddAPhoto } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { BsPersonPlus } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import { IconButton } from "@material-ui/core";
import { apiBaseURL } from '../axios';


const useStyles = makeStyles((theme) => ({

    profile: {
        "& .image-wrapper": {
            textAlign: "center",
            position: "relative",
            "& button": {
                position: "absolute",
                top: "80%",
                left: "70%",
            },
            margin: 6,
        },
        "& .profile-image": {
            width: 150,
            height: 150,
            objectFit: "cover",
            maxWidth: "100&",
            borderRadius: "50%",
            backgroundColor: "white",
        },
        "& .profile-details": {
            textAlign: "center",
            "& span, svg": {
                verticalAlign: "middle",
                color: "lightgray",
                fontFamily: '"Comic Nenu", cursive',
            },
        },
        "& hr": {
            border: "none",
            margin: "0 0 7px 0",
        },
    },
}))



const ProfileManager = () => {
    const classes = useStyles();
    const { myProfile, editedProfile, setEditedProfile, deleteProfile, cover, setCover, createProfile, editProfile } = useContext(ApiContext);


    const [imageURL, setImageURL] = useState("");

    const onChange = (file: any) => {

        console.log(file)
        var image_url = URL.createObjectURL(file);
        setImageURL(image_url);
    };

    const handleEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const name = e.target.name;
        setEditedProfile({ ...editedProfile, [name]: value });
    }



    return (
        <div className={classes.profile}>
            <div className="image-wrapper">
                {myProfile.id ?
                    <img src={imageURL ? imageURL : myProfile.img} alt="myProfile" className="profile-image" />
                    :
                    <img src={apiBaseURL + "/media/image/null.png"} alt="myProfile" className="profile-image" />
                }

                <input
                    type="file"
                    id="imageInput"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                        setCover(e.target.files && e.target.files[0]);
                        onChange(e.target.files && e.target.files[0]);
                        e.target.value = "";
                    }}
                />
                <IconButton onClick={handleEditPicture}>
                    <MdAddAPhoto className="photo" />
                </IconButton>
            </div>

            {editedProfile.id ?
                //更新
                (editedProfile.nickName ?
                    <button
                        className="user"
                        onClick={() => editProfile()}
                    >
                        <FaUserEdit />
                    </button>
                    :
                    <button
                        className="user-invalid"
                        disabled>
                        <FaUserEdit />
                    </button>
                )
                : //新規作成
                (editedProfile.nickName && cover.name ?
                    <button
                        className="user"
                        onClick={() => createProfile()}>
                        <BsPersonPlus />
                    </button>
                    :
                    <button
                        className="user-invalid"
                        disabled
                    >
                        <BsPersonPlus />
                    </button>
                )
            }
            {/* 削除ボタン */}
            <button className="trash" onClick={() => deleteProfile()}><BsTrash /></button>

            <div className="profile-details">
                <BsPersonCheckFill
                    className="badge" />
                {myProfile && <span>{myProfile.nickName}</span>}
                <hr />
                <input
                    type="text"
                    value={editedProfile.nickName}
                    name="nickName"
                    onChange={handleInputChange} />
                <br />
                <span>作成日:{myProfile.created_on}</span>
                <hr />
                <LocationOn /><span>JAPAN</span>
            </div>
        </div>
    )
}

export default ProfileManager
