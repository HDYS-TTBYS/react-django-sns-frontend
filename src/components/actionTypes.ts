const START_FETCH = () => ({
    type: "START_FETCH" as const,
});

const FETCH_SUCCESS = () => ({
    type: "FETCH_SUCCESS" as const,
});

const ERROR_CATCHED = () => ({
    type: "ERROR_CATCHED" as const,
});

const INPUT_EDIT = () => ({
    type: "INPUT_EDIT" as const,
    inputName: "",
    payload: {
        username: "",
        password: "",
        email: "",
    },
});
const TOGGLE_MODE = () => ({
    type: "TOGGLE_MODE" as const,
});

export type LoginActions = (
    | ReturnType<typeof START_FETCH>
    | ReturnType<typeof FETCH_SUCCESS>
    | ReturnType<typeof ERROR_CATCHED>
    | ReturnType<typeof INPUT_EDIT>
    | ReturnType<typeof TOGGLE_MODE>
);
