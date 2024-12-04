import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Verifica que esté en false para considerar el vencimiento
      secretOrKey: process.env.JWT_SECRET, // Clave usada para firmar el token
    });

  }

  async validate(payload: any) {
    console.log('Payload JWT recibido:', payload);
    return { sub: payload.sub, email: payload.email };
  }
}
