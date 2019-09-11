import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './UserSchema';
import { UserService } from './UserService';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
