import { Account, Profile } from "next-auth"
import dbConnect from "../dbConnect"
import User from "../models/UserModel"

interface SignInWithOauthParams {
    account: Account,
    profile: Profile
}

export const signInWithOauth = async ({
    account,
    profile
}: SignInWithOauthParams) => {
    console.log(`SignInWithOauthParams > account ${account}`)
    await dbConnect()

    const user = await User.findOne(({ email: profile.email }))

    if (user) return true

    const newUser = new User({
        name: profile.name,
        email: profile.email,
        provider: account.provider
    })

    console.log(`SignInWithOauthParams > newUser ${newUser}`)
    await newUser.save()

    return true
}

interface GetUserByEmail {
    email: string
}

export const getUserByEmail = async ({
    email
}: GetUserByEmail) => {
    
    await dbConnect()

    const user = await User.findOne({ email }).select("-password")

    if (!user) {
        throw new Error("User does not exist")
    }

    console.log(`user by email ${user}`)
    
    return {...user._doc, _id: user._id.toString()}
}