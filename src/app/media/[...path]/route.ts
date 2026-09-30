import { NextRequest } from "next/server";
import { handleMediaProxy } from "@/services/api";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return handleMediaProxy(request, path, request.nextUrl.search);
}

export async function HEAD(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return handleMediaProxy(request, path, request.nextUrl.search);
}
