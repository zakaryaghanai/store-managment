import { Injectable } from "@nestjs/common";
import { HashingService } from "../abstract/hashing.service";
import { compare, hash, genSalt } from "bcryptjs";

@Injectable()
export class BcryptService implements HashingService {
  private SALT_ROUNDS = 10;
  async hash(data: string): Promise<string> {
    const salt = await genSalt(this.SALT_ROUNDS);
    return hash(data, salt);
  }
  async compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
