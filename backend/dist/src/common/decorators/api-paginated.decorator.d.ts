import { Type } from '@nestjs/common';
export declare function ApiPaginatedResponse<T>(model: Type<T>): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
