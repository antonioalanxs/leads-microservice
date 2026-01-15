import { User } from "@prisma/client";

import { PrismaClient } from "../configuration/prisma/client";
import { SupabaseClient } from "../configuration/supabase";
import { SignupDTOType } from "../schemas/authentication.schemas";
import { Optional } from "../types/optional.type";

export class UserModel {
  static async findByEmail(email: string): Promise<Optional<User>> {
    return await PrismaClient.getInstance().user.findUnique({
      where: { email },
    });
  }

  static async create(information: SignupDTOType): Promise<User> {
    const { email, password } = information;

    const { data, error } =
      await SupabaseClient.getInstance().auth.admin.createUser({
        email,
        password: password, // Supabase internally hashes the password
        email_confirm: true,
      });

    return await PrismaClient.getInstance().user.create({
      data: {
        id: data?.user?.id as string,
        email: data?.user?.email as string,
      },
    });
  }
}
