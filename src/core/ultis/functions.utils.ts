import { join } from 'path';
import crypto from "crypto";
import { ValidationError } from 'class-validator';

export const getOsEnv = (key: string): string => {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
}

export const getOsEnvOptional = (key: string): string | undefined => {
  return process.env[key];
}

export const getPath = (path: string): string => {
  return join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js').replace('/\\/', '/');
}
export const getRelativePath = (path: string): string => {
  return path.replace('src/', 'dist/').slice(0, -3) + '.js'.replace('/\\/', '/');
}

export const getPaths = (paths: string[]): string[] => {
  return paths.map((p) => getPath(p));
}

export const getOsPath = (key: string): string => {
  return getPath(getOsEnv(key));
}

export const getOsPaths = (key: string): string[] => {
  return getPaths(getOsEnvArray(key));
}

export const getOsEnvArray = (key: string, delimiter = ','): string[] => {
  return (process.env[key] && process.env[key].split(delimiter)) || [];
}

export const toNumber = (value: string): number => {
  return parseInt(value, 10);
}

export const toBool = (value: string): boolean => {
  return value === 'true';
}

export const normalizePort = (port: string): number => {
  const parsedPort = parseInt(port, 10);
  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }
  return 4040;
}

export const gravatar = (_size: number, email: string): string => {
    if (!_size) {
      _size = 200;
    }

    const url = "https://gravatar.com/avatar";
    if (!email) {
      return `${url}/?s=${_size}&d=retro`;
    }

    const md5 = crypto.createHash("md5").update(email).digest("hex");
    return `${url}/${md5}?s=${_size}&d=retro`;
}

export const formatErrors = (errors: ValidationError[]): any[] => {
  return errors && errors.length
    ? errors.map(({ property, constraints }) => property + ":" + Object.values(constraints))
    : [];
}