import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import User from '@/models/users';

export async function POST(req) {
  const { name, email, password } = await req.json();

  // Validasi input
  if (!name || !validator.isLength(name, { min: 3, max: 50 })) {
    return NextResponse.json(
      { msg: 'Name must be between 3 and 50 characters.', statusCode: 400 },
      { status: 400 }
    );
  }

  if (!email || !validator.isEmail(email)) {
    return NextResponse.json(
      { msg: 'A valid email is required.', statusCode: 400 },
      { status: 400 }
    );
  }

  if (!password || !validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
    return NextResponse.json(
      { msg: 'Password must be at least 8 characters long and include at least one number and one symbol.', statusCode: 400 },
      { status: 400 }
    );
  }

  // Periksa apakah email sudah ada
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { msg: 'Email is already taken.', statusCode: 400 },
      { status: 400 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan pengguna baru ke database
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Kembalikan respons sukses
    return NextResponse.json(
      {
        msg: 'User created successfully.',
        statusCode: 201,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { msg: 'Something went wrong. Please try again later.', statusCode: 500 },
      { status: 500 }
    );
  }
}
