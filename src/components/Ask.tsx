import React, { useState, useContext } from 'react'
import { ApiContext } from "../context/ApiContext";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { RiMailAddLine } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";
import { IoMdClose } from "react-icons/io";


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    text: {
        margin: theme.spacing(3),
    },
}))

const Ask = ({ ask, prof }: any) => {

    const classes = useStyles();
    const { changeApprovalRequest, sendDMContent } = useContext(ApiContext);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [text, setText] = useState("");

    const customStyle = {
        content: {
            top: "50%",
            left: "42%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%.-50%)",
        },
    }

    const handleInputChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }

    const sendDM = () => {
        const uploadDM = new FormData();
        uploadDM.append("reciver", ask.askFrom);
        uploadDM.append("message", text);
        sendDMContent(uploadDM);
        setModalIsOpen(false);
    }

    const changeApproval = () => {
        const uploadDataAsk = new FormData();
        uploadDataAsk.append("askTo", ask.askTo);
        uploadDataAsk.append("approved", true.toString());
        changeApprovalRequest(uploadDataAsk, ask);
    }
    return (
        <li className="list-item">
            <h4>{prof[0] ? prof[0].nickName : "Loading..."}</h4>
            {!ask.approved ? (
                <Button
                    size="small"
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => changeApproval()}
                >
                    承認する
                </Button>
            ) : (
                    <button
                        className="mail"
                        onClick={() => setModalIsOpen(true)} >
                        <RiMailAddLine />
                    </button>
                )}
            <Modal
                isOpen={modalIsOpen}
                ariaHideApp={false}
                onRequestClose={() => setModalIsOpen(false)}
                style={customStyle}
            >
                <Typography >メッセージ</Typography>
                <TextField
                    className={classes.text}
                    type="text"
                    onChange={handleInputChange()}
                />
                <br />
                <button
                    className="btn-modal"
                    onClick={() => sendDM()}>
                    <IoIosSend />
                </button>
                <button
                    className="btn-modal"
                    onClick={() => setModalIsOpen(false)}
                >
                    <IoMdClose />
                </button>
            </Modal>

        </li>
    )
}

export default Ask
