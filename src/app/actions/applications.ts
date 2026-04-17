"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ApplicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createApplication(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const jobUrl = formData.get("jobUrl") as string;
  const status = formData.get("status") as ApplicationStatus;
  const notes = formData.get("notes") as string;

  if (!company?.trim() || !role?.trim()) {
    throw new Error("Company and role are required");
  }

  await prisma.application.create({
    data: {
      userId: session.user.id,
      company: company.trim(),
      role: role.trim(),
      jobUrl: jobUrl?.trim() || null,
      status: status || "BOOKMARKED",
      notes: notes?.trim() || null,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateApplication(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Not found");

  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const jobUrl = formData.get("jobUrl") as string;
  const status = formData.get("status") as ApplicationStatus;
  const notes = formData.get("notes") as string;

  await prisma.application.update({
    where: { id },
    data: {
      company: company.trim(),
      role: role.trim(),
      jobUrl: jobUrl?.trim() || null,
      status,
      notes: notes?.trim() || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${id}`);
  redirect(`/dashboard/applications/${id}`);
}

export async function deleteApplication(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Not found");

  await prisma.application.delete({ where: { id } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.application.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard");
}
