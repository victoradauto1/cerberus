import { Optional } from "@nestjs/common";
import { IsAlphanumeric, IsEmail, IsInt, IsOptional, IsString, Length } from "class-validator";
import { Status } from "commons/models/status"

export class UserDTO{

    @Length(42,42)
    @IsAlphanumeric()
    address: string;

    @IsString()
    @Length(1)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Optional()
    planId: string;

    @IsString()
    @Optional()
    privateKey: string;

    @IsInt()
    @IsOptional()
    status: Status

}