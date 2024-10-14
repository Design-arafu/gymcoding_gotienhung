import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();

  await dbConnect();
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { message: 'User has been created',
        newUser
      },
      {
        status: 201,
      },
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      },
    );
  }
};
