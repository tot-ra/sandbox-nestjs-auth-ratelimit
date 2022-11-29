export default {
    JWTSecret: 'secretKey',
    expiresIn: '60m',

    IP_LIMIT_PER_SEC: getIntEnvVar('IP_LIMIT_PER_SEC', 10),
    IP_LIMIT_PER_MIN: getIntEnvVar('IP_LIMIT_PER_MIN', 60),
    IP_LIMIT_PER_HOUR: getIntEnvVar('IP_LIMIT_PER_HOUR', 100),

    TOKEN_LIMIT_PER_SEC: getIntEnvVar('TOKEN_LIMIT_PER_SEC', 20),
    TOKEN_LIMIT_PER_MIN: getIntEnvVar('TOKEN_LIMIT_PER_MIN', 120),
    TOKEN_LIMIT_PER_HOUR: getIntEnvVar('TOKEN_LIMIT_PER_HOUR', 200),
};

function getIntEnvVar(key: string, defaultValue: number): number {
    return typeof(process.env[key])==='undefined' || parseInt(process.env[key]) === 0 ? defaultValue : parseInt(process.env[key]);
}
