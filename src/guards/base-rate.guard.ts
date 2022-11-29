import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { Reflector } from "@nestjs/core";

export const MIN_SEC = 60;
export const HOUR_SEC = 60 * 60;
const MS_IN_SEC = 1000;

@Injectable()
export class BaseRateLimitGuard implements CanActivate {
    constructor(
        @InjectRedis() protected readonly redis: Redis,
        protected reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        throw new Error('not implemented');
    }

    protected throwIfLimitExceeded(requestsDoneWithinWindow: number, requestLimit: number, windowSizeSec: number) {
        if (requestsDoneWithinWindow > requestLimit) {
            const availableTimeStamp = (this.getWindowStart(windowSizeSec) + 1) * windowSizeSec * MS_IN_SEC;

            throw new HttpException({
                status: HttpStatus.TOO_MANY_REQUESTS,
                error: "Ratelimit exceeded",
                windowSizeSec,
                requestsDoneWithinWindow,
                requestLimit,
                currentTime: new Date().toISOString(),
                windowOpenTime: new Date(availableTimeStamp).toISOString(),
            }, HttpStatus.TOO_MANY_REQUESTS);
        }
    }

    protected async incrementHitsAtFixedWindow(tokenType: string, ID: string, windowName: string = 'sec', windowSizeSec: number = 1): Promise<number> {
        const windowStart = this.getWindowStart(windowSizeSec);
        const key = `${tokenType}-${windowName}-${ID}-${windowStart}`;

        const storedHits = await this.redis.get(key);
        const hits = storedHits ? parseInt(storedHits) : 0;
        await this.redis.set(key, hits + 1, "EX", windowSizeSec);

        console.debug('Token rate limit calculation', {
            key,
            windowName,
            hits
        })
        return hits;
    }

    protected getWindowStart(windowSizeSec): number {
        return Math.floor(Date.now() / (windowSizeSec * MS_IN_SEC));
    }
}
