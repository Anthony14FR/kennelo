import { NextRequest, NextResponse } from "next/server";

export interface Middleware {
    handle(request: NextRequest): Promise<NextResponse | null> | NextResponse | null;
}

export async function runMiddlewares(
    request: NextRequest,
    middlewares: Middleware[],
): Promise<NextResponse> {
    for (const middleware of middlewares) {
        const response = await middleware.handle(request);
        if (response !== null) {
            return response;
        }
    }

    return NextResponse.next();
}
