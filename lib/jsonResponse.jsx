import { NextResponse } from "next/server";


export const jsonResponse = (msg, status) => {
  
    const isSuccess = status >= 200 && status < 300;
    return NextResponse.json({ status: isSuccess ? 'success' : 'error',statusCode:status, ...msg }, { status });
};
