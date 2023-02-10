import { join } from 'path';
import * as crypto from 'crypto';
import { ValidationError } from 'class-validator';
import { ErrorInfoRegex } from '@core/constants';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { JwtPayload, Session } from '@business/auth/model';
import * as useragent from 'express-useragent';
import { Request } from 'express';
import { SystemConfig } from '@core/configuration';
import { verify } from 'jsonwebtoken';

export const getOsEnv = (key: string): string => {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
};

export const getOsEnvOptional = (key: string): string | undefined => {
  return process.env[key];
};

export const getPath = (path: string): string => {
  return join(
    process.cwd(),
    path.replace('src/', 'dist/').slice(0, -3) + '.js',
  ).replace('/\\/', '/');
};
export const getRelativePath = (path: string): string => {
  return (
    path.replace('src/', 'dist/').slice(0, -3) + '.js'.replace('/\\/', '/')
  );
};

export const getPaths = (paths: string[]): string[] => {
  return paths.map((p) => getPath(p));
};

export const getOsPath = (key: string): string => {
  return getPath(getOsEnv(key));
};

export const getOsPaths = (key: string): string[] => {
  return getPaths(getOsEnvArray(key));
};

export const getOsEnvArray = (key: string, delimiter = ','): string[] => {
  return (process.env[key] && process.env[key].split(delimiter)) || [];
};

export const toNumber = (value: string): number => {
  return parseInt(value, 10);
};

export const toBool = (value: string): boolean => {
  return value === 'true';
};

export const normalizePort = (port: string): number => {
  const parsedPort = parseInt(port, 10);
  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }
  return 4040;
};

export const gravatar = (_size: number, email: string): string => {
  if (!_size) {
    _size = 200;
  }

  const url = 'https://gravatar.com/avatar';
  if (!email) {
    return `${url}/?s=${_size}&d=retro`;
  }

  const md5 = crypto.createHash('md5').update(email).digest('hex');
  return `${url}/${md5}?s=${_size}&d=retro`;
};

export const formatErrors = (errors: ValidationError[]): any[] => {
  return errors && errors.length
    ? errors.map(
        ({ property, constraints }) =>
          property + ':' + Object.values(constraints),
      )
    : [];
};

export const getMethodError = (error: Error): string => {
  let method = null;
  if (error != null && error.stack) {
    const lines = error.stack.split('\n').slice(1);
    if (lines.length > 1) {
      const match = lines[0].match(ErrorInfoRegex);
      method = `[${match[0]}]`;
    }
  }
  return method;
};

export const stringFormat = (str: CacheKey, ...args: string[]): string =>
  str.replace(/{(\d+)}/g, (_match, index) => args[index] || '');

export const getFileUploadUrl = (path: string, base: string): string => {
  if (path.indexOf(base) !== -1) {
    return path;
  }
  return `${base}/file-upload/${path}`;
};

export const getUserSession = (req: Request, token = null): Session => {
  const source = req.headers['user-agent'];
  const ua = useragent.parse(source);
  if (token) {
    const { roles, id } = verify(
      token,
      SystemConfig.Configs.AppSetting.SecretKey,
    ) as JwtPayload;
    return {
      browser: ua.browser,
      platform: ua.platform,
      ip: req.socket.remoteAddress,
      os: ua.os,
      roles,
      _id: id,
    };
  }
  return {
    browser: ua.browser,
    platform: ua.platform,
    ip: req.socket.remoteAddress,
    os: ua.os,
  };
};
