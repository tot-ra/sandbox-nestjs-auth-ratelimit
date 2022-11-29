import { SetMetadata } from '@nestjs/common';

export type RateLimitConfig = {
    minLimit:number,
    hourLimit:number,
    secLimit:number
};

export const RateLimitEndpoint = (
    hourLimit: number,
    minLimit: number,
    secLimit: number,
) => SetMetadata('endpointRateLimits', { minLimit, hourLimit, secLimit } as RateLimitConfig);
