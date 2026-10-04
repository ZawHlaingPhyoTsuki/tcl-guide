import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { PlacesModule } from "./places/places.module.js";
import { auth } from "./services.js";

@Module({
  imports: [AuthModule.forRoot({ auth }), PlacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
