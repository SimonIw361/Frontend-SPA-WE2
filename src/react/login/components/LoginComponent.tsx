import  Button  from "react-bootstrap/Button";


export function Login() {
    return (
    <Button id="LoginButton" onClick={LoginWeg}>Login</Button>
        
    );
}

export function LoginWeg(){
    // document.getElementById("LoginButton")?.addEventListener("click", () => {
    //     console.log("click")
    // })
    console.log("click");
}