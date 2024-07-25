"use server"

import { nanoid } from "nanoid"
import { OptionalUser } from "./types"
import bcrypt from 'bcrypt'
import { addUser, getAllUsers } from "./api"
import { redirect } from "next/navigation"

export const hadnleSignup = async (prev: unknown, data: FormData) => {
    const users = getAllUsers()
    const regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!data.get('name') || !data.get('surname') || !data.get('login') || !data.get('password')) {
        return {
            message: 'Please fill all the fields',
            name: data.get('name') as string,
            surname: data.get('surname') as string,
            login: data.get('login') as string,
        }
    }
    if (users.find(elm => elm.login == data.get('login'))) {
        return {
            message: 'login already existing',
            name: data.get('name') as string,
            surname: data.get('surname') as string,
            login: data.get('login') as string,
        }
    }
    if (!regExp.test(data.get('password') as string)) {
        return {
            message: 'Password must contain letters,numbers,symbols and must not be less than 6 characters ',
            name: data.get('name') as string,
            surname: data.get('surname') as string,
            login: data.get('login') as string,
        }
    }

    const user: OptionalUser = {
        id: nanoid(),
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        login: data.get('login') as string,
    }
    user.password = await bcrypt.hash((data.get('password') as string), 10)
    addUser(user);
    redirect('/login')
}

export const handleLogin = async (prev: unknown, data: FormData) => {
    const users = getAllUsers()
    if (!data.get('login') || !data.get('password')) {
        return {
            message: 'Fill all the fields',
            login: data.get('login') as string
        }
    }

    const found = users.find(elm => elm.login == data.get('login'))
    if (!found) {
        return {
            message: 'Login is incorrect',
            login: data.get('login') as string
        }
    }

    const result = bcrypt.compareSync(data.get('password') as string, found.password as string)
    if (!result) {
        return {
            message: "Password is incorrect",
            login: data.get('login') as string
        }
    }

    redirect('/profile/'+ found.id)





}