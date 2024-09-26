import { NextRequest, NextResponse } from "next/server";

import QRCode from "qrcode";

import { institutions } from "@/app/data/institutions";
import { env } from "@/env";

const botToken = env.TELEGRAM_BOT_TOKEN;
const chatId = env.TELEGRAM_CHANNEL_ID;

export async function POST(req: NextRequest) {
  const position = Math.floor(Math.random() * (institutions.length + 1));
  const qrContent = institutions[position].qrContent!;
  const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {});

  // // Convert Base64 Data URL to Buffer
  const base64Qr = qrCodeDataUrl.split(";base64,").pop()!;
  const buffer = Buffer.from(base64Qr, "base64");

  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", new Blob([buffer], { type: "image/png" }));
  await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: "POST",
    body: formData,
  });

  return NextResponse.json({ status: "ok" });
}