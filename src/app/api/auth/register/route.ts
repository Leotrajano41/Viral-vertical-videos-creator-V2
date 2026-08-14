import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    // Verify unique email constraint
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado no sistema" }, { status: 409 });
    }

    // Hash Password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User in Database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        plan: "free",
        credits: 50,
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        credits: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Usuário registrado com sucesso",
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
