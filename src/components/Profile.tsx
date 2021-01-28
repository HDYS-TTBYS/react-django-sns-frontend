import React, { useContext } from 'react'
import { ApiContext } from "../context/ApiContext";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { apiBaseURL } from '../axios';


const useStyles = makeStyles((them) => ({
    button: {
        margin: them.spacing(1),
    },
}))

const Profile = ({ profileData, askData }: any) => {
    const classes = useStyles();
    const { newRequestFriend, myProfile } = useContext(ApiContext);

    const newRequest = () => {
        const askUploadData = new FormData();
        askUploadData.append("askTo", profileData.userPro as any);
        newRequestFriend(askUploadData);
    }
    return (
        <Card style={{ position: "relative", display: "flex", marginBottom: 10 }}>

            {profileData.img ?
                <CardMedia style={{ minWidth: 100 }} image={profileData.img as any} />
                :
                <CardMedia style={{ minWidth: 100 }} image={apiBaseURL + "/media/image/null.png"} />
            }

            <CardContent style={{ padding: 5 }}>
                <Typography
                    variant="h6">{profileData.nickName}
                </Typography>
                <Typography
                    variant="h6">{profileData.created_on}
                </Typography>

                {!askData[0] && myProfile.id ?
                    <Button
                        size="small"
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => newRequest()}>
                        友達申請を送信する
                    </Button>
                    :
                    <Button
                        size="small"
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled>
                        友達申請を送信する
                    </Button>

                }

            </CardContent>

        </Card>
    )
}

export default Profile
