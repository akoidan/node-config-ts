/**
 * Created by tushar on 10/01/18.
 */

import * as R from 'ramda'

const getVarName = R.replace('@@', '')
const hasEnvVar = R.test(/^@@.*$/)

type NodeENV = {
  env: {
    [key: string]: string
  }
}

function extractEnvVar<P extends NodeENV>(process: P, name: any): string {
  let envName = getVarName(name)
  let envVariable = process.env[envName]
  if (!envVariable && process.env.NODE_TS_CONFIG_THROW) {
    throw Error(`Environment variable "${envName}" is not set`)
  } else {
    console.warn(`Environment variable "${envName}" is not set`)
  }
  if (typeof envVariable === 'string') {
    envVariable = envVariable.trim()
    if (!envVariable) {
      throw Error(`Environment variable "${envName}" can not be empty`)
    }
  }
  return envVariable
}

export const replaceWithEnvVar = <T, P extends NodeENV>(
  baseConfig: T,
  process: P
): T => {
  const itar: any = R.map((value: any) => {
    if (R.is(Object, value)) return itar(value)
    if (R.is(String, value) && hasEnvVar(value))
      return extractEnvVar(process, value)
    return value
  })
  return itar(baseConfig)
}
