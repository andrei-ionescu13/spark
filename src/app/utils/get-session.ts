import jwtDecode from 'jwt-decode'
import { cookies, headers } from 'next/headers'

const parseCookies = (rawCookies: string | null) => {
  const pairs = rawCookies?.split(';')
  const setCookies: any = {}

  if (pairs) {
    for (var i = 0; i < pairs.length; i++) {
      var nameValue = pairs[i].split('=')
      setCookies[nameValue[0].trim()] = nameValue[1]
    }
  }

  return setCookies
}

interface Decoded {
  adminId: string
  iat: number
  exp: number
}

export const getSession = async (): Promise<Decoded | null> => {
  const cookieStore = cookies()
  const setCookies: any = parseCookies(headers().get('set-cookie'))
  const accessToken =
    cookieStore.get('accessToken')?.value || setCookies?.accessToken

  if (accessToken) {
    const decoded: Decoded = jwtDecode(accessToken)

    if (decoded.exp > Date.now() / 1000) {
      return jwtDecode(accessToken)
    }
  }

  return null
}
