import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

const PORT = 8081

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const options = new DocumentBuilder()
    .setTitle('Newsletter service')
    .setDescription('Your favorite Reddit posts everyday')
    .setVersion('0.1')
    .build()
  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup('docs', app, document)

  await app.listen(PORT)

  console.log(`Server started. Try at http://localhost:${PORT}/docs/`)
}

bootstrap().catch((e) => {
  Logger.log(e, 'Server crashed')
  process.exit(1)
})
