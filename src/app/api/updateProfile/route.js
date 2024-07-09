// src/app/api/updateProfile/route.js
import User from "../../../models/User";
import connect from "../../../utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export const revalidate = 1;

export const POST = async (request) => {
    const { fullname, nickname, email, password, birthDate, gender, allergy } = await request.json();

    await connect();

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        const updateData = {
            fullname: fullname || existingUser.fullname,
            nickname: nickname || existingUser.nickname,
            email: email || existingUser.email,
            birthDate: birthDate || existingUser.birthDate,
            gender: gender || existingUser.gender,
            allergy: allergy || existingUser.allergy,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await User.updateOne({ email }, { $set: updateData });

        // Fetch the updated user data
        const updatedUser = await User.findOne({ email });

        return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
    } catch (err) {
        return new NextResponse(err.message, { status: 500 });
    }
};
