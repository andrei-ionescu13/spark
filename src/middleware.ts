// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import jwtDecode from 'jwt-decode'
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'

type Decoded = any

export const getNewAccesToken = async (
  cookies: RequestCookies
): Promise<any> => {
  const headers = {
    Cookie: cookies.toString(),
  }

  const respose = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/access-token`,
    {
      headers,
    }
  )

  if (respose.ok) {
    const data = await respose.json()
    return data
  }

  return null
}

const checkSession = async (request: NextRequest, response: NextResponse) => {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (!accessToken && !refreshToken) {
    return null
  }

  if (!!accessToken) {
    const decoded: Decoded = jwtDecode(accessToken)

    if (decoded.exp > Date.now() / 1000) {
      return decoded
    }
  }

  if (
    !!refreshToken &&
    (jwtDecode(refreshToken) as Decoded).exp > Date.now() / 1000
  ) {
    const newAccesToken = await getNewAccesToken(request.cookies)

    if (!newAccesToken) {
      return null
    }

    response.cookies.set('accessToken', newAccesToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })

    return null
  }
  return null
}

const guestGuardPaths = [/^\/login$/, /^\/register$/]

const testAgainstRegexArray = (str: string, array: RegExp[]) => {
  let isMatch = false

  for (let index = 0; index < array.length; index++) {
    if (array[index].test(str)) {
      isMatch = true
      break
    }
  }

  return isMatch
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const session = await checkSession(request, response)

  if (
    session &&
    testAgainstRegexArray(request.nextUrl.pathname, guestGuardPaths)
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (
    !session &&
    !testAgainstRegexArray(request.nextUrl.pathname, guestGuardPaths)
  ) {
    return NextResponse.redirect(new URL('/login', request.url), 303)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
