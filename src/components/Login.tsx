import React, { useReducer } from 'react';
import { withCookies } from 'react-cookie';
import axios from "axios";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from "@material-ui/core/CircularProgress";
import { LoginActions } from "./actionTypes";
import { apiBaseURL } from "../axios";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                SNS App
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const initialState = {
    isLoading: false,
    isLoginView: true,
    errorMessage: "",
    credentialsLog: {
        username: "",
        password: "",
    },
    credentialsReg: {
        email: "",
        password: "",
    },
};


const loginReducer = (state: typeof initialState, action: LoginActions): typeof initialState => {
    switch (action.type) {
        case "START_FETCH": {
            return {
                ...state,
                isLoading: true,
            }
        }
        case "FETCH_SUCCESS": {
            return {
                ...state,
                isLoading: false,

            }
        }
        case "ERROR_CATCHED": {
            return {
                ...state,
                errorMessage: "メールアドレスまたはパスワードが正しくありません",

            }
        }
        case "INPUT_EDIT": {
            return {
                ...state,
                [action.inputName]: action.payload,
                errorMessage: "",
            }
        }
        case "TOGGLE_MODE": {
            return {
                ...state,
                isLoginView: !state.isLoginView,
            }
        }
        default:
            return state;
    }
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    span: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: "teal",
    },
    spanError: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: "fuchsia",
        marginTop: 10,
    },
}));

const Login = (props: any) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(loginReducer, initialState);

    const inputChangedLog = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const cred: any = state.credentialsLog;
        cred[event.target.name] = event.target.value;
        dispatch({
            type: "INPUT_EDIT",
            inputName: "state.credentialLog",
            payload: cred,
        })
    }

    const inputChangedReg = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        const cred: any = state.credentialsReg;
        cred[event.target.name] = event.target.value;
        dispatch({
            type: "INPUT_EDIT",
            inputName: "state.credentialsReg",
            payload: cred,
        })
    }

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (state.isLoginView) {
            try {
                dispatch({ type: "START_FETCH" })
                const res = await axios.post(`${apiBaseURL}/authen/`, state.credentialsLog, {
                    headers: { "Content-Type": "application/json" },
                })
                props.cookies.set("current-token", res.data.token)
                res.data.token ? window.location.href = "/profiles" : window.location.href = "/"
                dispatch({ type: "FETCH_SUCCESS" })
            } catch {
                dispatch({ type: "ERROR_CATCHED" })
                dispatch({ type: "FETCH_SUCCESS" })
            }
        } else {
            try {
                dispatch({ type: "START_FETCH" })
                await axios.post(`${apiBaseURL}/api/user/create/`, state.credentialsReg, {
                    headers: { "Content-Type": "application/json" },
                })
                dispatch({ type: "FETCH_SUCCESS" })
                dispatch({ type: "TOGGLE_MODE" })

                // props.cookies.set("current-token", res.data.token)
                // res.data.token ? window.location.href = "/profiles" : window.location.href = "/"
            } catch {
                dispatch({ type: "ERROR_CATCHED" })
                dispatch({ type: "FETCH_SUCCESS" })
            }
        }
    }

    const toggleView = () => {
        dispatch({ type: "TOGGLE_MODE" })
    }

    return (
        <Container component="main" maxWidth="xs">
            <form onSubmit={login}>
                <CssBaseline />
                <div className={classes.paper}>
                    {state.isLoading && <CircularProgress />}
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {state.isLoginView ? "ログイン" : "アカウントを作成"}
                    </Typography>
                    {state.isLoginView ?
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Email Address"
                            name="username"
                            value={state.credentialsLog.username}
                            autoComplete="email"
                            autoFocus
                            onChange={inputChangedLog()}
                        />
                        :
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={state.credentialsReg.email}
                            autoComplete="email"
                            autoFocus
                            onChange={inputChangedReg()}
                        />
                    }
                    {state.isLoginView ?
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={state.credentialsLog.password}
                            id="password"
                            autoComplete="current-password"
                            onChange={inputChangedLog()}
                        />
                        :
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={state.credentialsReg.password}
                            id="password"
                            autoComplete="current-password"
                            onChange={inputChangedReg()}
                        />
                    }
                    <span className={classes.spanError}>{state.errorMessage}</span>

                    {state.isLoginView ?
                        !state.credentialsLog.password || !state.credentialsLog.username ?
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled
                            >
                                ログイン
                        </Button>
                            :
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                ログイン
                        </Button>
                        :
                        !state.credentialsReg.password || !state.credentialsReg.email ?
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled
                            >
                                アカウントを作成
                        </Button>
                            :
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                アカウントを作成
                        </Button>
                    }

                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                パスワードを忘れましたか？
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2" onClick={toggleView} >
                                {state.isLoginView ? "アカウントを作成" : "ログイン"}
                            </Link>
                        </Grid>
                    </Grid>
                </div>
            </form>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container >
    );
}

export default withCookies(Login)
