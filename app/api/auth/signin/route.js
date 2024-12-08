import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/users';
import { createSession } from '@/lib/session';

export async function POST(req) {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
        return NextResponse.json(
            { msg: 'Email and password are required.', statusCode: 400 },
            { status: 400 }
        );
    }

    // Cari pengguna berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return NextResponse.json(
            { msg: 'Invalid email or password.', statusCode: 401 },
            { status: 401 }
        );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json(
            { msg: 'Invalid email or password.', statusCode: 401 },
            { status: 401 }
        );
    }

    // Buat sesi untuk pengguna
    await createSession(user.id);

    // Kembalikan respons sukses
    return NextResponse.json(
        {
            msg: 'Sign in successful.',
            statusCode: 200,
            user: { id: user.id, name: user.name, email: user.email },
        },
        { status: 200 }
    );
}
