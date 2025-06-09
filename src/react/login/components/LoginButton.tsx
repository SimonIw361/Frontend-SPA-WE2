import { type MouseEvent } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, } from "react-redux";
import { showLoginDialog } from "../state/AuthenticationSlice";
import type { AppDispatch } from "../../RootStore";

// verwendete Quellen: Folien und Videos von den Vorlesungen

export function LoginButton() {
    const dispatch = useDispatch<AppDispatch>();

    const handleShow = (e: MouseEvent) => {
        e.preventDefault();
        dispatch(showLoginDialog());
    }

    return <Button variant="primary" onClick={handleShow} id="OpenLoginDialogButtonPublic">Login</Button>
}