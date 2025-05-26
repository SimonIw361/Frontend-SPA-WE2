export const SHOW_LOGIN_DIALOG = "SHOW_LOGIN_DIALOG";
export const HIDE_LOGIN_DIALOG = "HIDE_LOGIN_DIALOG"

export function getShowLoginDialogAction(){
    return {
        type: SHOW_LOGIN_DIALOG
    }
}

export function getHideLoginDialogAction(){
    return {
        type: HIDE_LOGIN_DIALOG
    }
}