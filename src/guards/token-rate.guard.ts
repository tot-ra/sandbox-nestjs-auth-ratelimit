import { Injectable, ExecutionContext } from '@nestjs/common';
import config from '../config/';
import { BaseRateLimitGuard, HOUR_SEC, MIN_SEC } from './base-rate.guard';
import { RateLimitConfig } from './rate-guard-endpoint-config.decorator';

@Injectable()
export class TokenRateGuard extends BaseRateLimitGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const customEndpointLimits = this.reflector.get<RateLimitConfig>(
      'endpointRateLimits',
      context.getHandler(),
    );
    let minLimit = config.TOKEN_LIMIT_PER_MIN;
    let hourLimit = config.TOKEN_LIMIT_PER_HOUR;
    let secLimit = config.TOKEN_LIMIT_PER_SEC;

    if (customEndpointLimits) {
      ({ minLimit, hourLimit, secLimit } = customEndpointLimits);
      console.debug('Using custom endpoint limit', {
        minLimit,
        hourLimit,
        secLimit,
      });
    }

    const [hitsPerSec, hitsPerMin, hitsPerHour] = await Promise.all([
      await this.incrementHitsAtFixedWindow(
        'token-rate',
        request.user.userId,
        'sec',
        1,
      ),
      await this.incrementHitsAtFixedWindow(
        'token-rate',
        request.user.userId,
        'min',
        MIN_SEC,
      ),
      await this.incrementHitsAtFixedWindow(
        'token-rate',
        request.user.userId,
        'hour',
        HOUR_SEC,
      ),
    ]);

    this.throwIfLimitExceeded(hitsPerHour, hourLimit, HOUR_SEC);
    this.throwIfLimitExceeded(hitsPerMin, minLimit, MIN_SEC);
    this.throwIfLimitExceeded(hitsPerSec, secLimit, 1);

    return true;
  }
}
