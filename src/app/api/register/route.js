import User from "../../../models/User";
import connect from "../../../utils/db";
import { argon2 } from "argon2";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const { fullname, nickname, email, password, birthDate, gender, allergy } = await request.json();

    await connect();

    console.log("Received password:", password); // Log the received password


    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return new NextResponse("Email is already in use", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    // const hashedPassword = password;

    console.log("Plain password:", password); // Log plain password
    console.log("Hashed password:", hashedPassword); // Log hashed password

    const newUser = new User({
        fullname,
        nickname,
        email,
        password: hashedPassword,
        birthDate,
        gender,
        allergy
    });

    try {
        await newUser.save();
        return new NextResponse("User is registered", { status: 200 });
    } catch (err) {
        return new NextResponse(err.message, {
            status: 500,
        });
    }
};
