import { NextRequest } from "next/server";
import { handleBackendProxy } from "@/services/api";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return handleBackendProxy(request, path, request.nextUrl.search);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return handleBackendProxy(request, path, request.nextUrl.search);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return handleBackendProxy(request, path, request.nextUrl.search);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  return handleBackendProxy(request, path, request.nextUrl.search);
}

