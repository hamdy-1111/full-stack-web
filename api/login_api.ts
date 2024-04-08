interface UserLoginData {
    username: string,
    password: string
};

interface UserRegisterData {
    useremail: string,
    username: string,
    password: string,
    profile_pic: any
};

export async function send_login_data (login_data: UserLoginData) {
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            Accept: "application/json"
        },
        body: JSON.stringify(login_data)
    })
}

export async function send_register_data (login_data: UserLoginData) {
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            Accept: "application/json"
        },
        body: JSON.stringify(login_data)
    })
}
