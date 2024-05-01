import { Inject, Injectable } from '@nestjs/common';
import { Attractive as PrismaAttractive } from '@prisma/client';
import { PrismaService } from './prisma.service';

export class AttractiveDoesntExists extends Error {
  constructor(message: string = 'Attractive doesnt exists') {
    super(message);
    this.name = 'AttractiveDoesntExists';
    // Mantém o stack trace em V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AttractiveDoesntExists);
    }
  }
}

export class TableAttractiveIsEmpty extends Error {
  constructor(message: string = 'Table attractive is empty') {
    super(message);
    this.name = 'TableAttractiveIsEmpty';
    // Mantém o stack trace em V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TableAttractiveIsEmpty);
    }
  }
}

@Injectable()
export class ToolService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createAttractive(
    name: string,
    price: number,
    address: string,
    openTime: string,
    tag: string,
  ): Promise<PrismaAttractive> {
    const tool = await this.prisma.attractive.create({
      data: {
        name,
        price,
        address,
        openTime,
        tag,
      },
    });
    return tool;
  }

  async getAllAttractive(): Promise<PrismaAttractive[]> {
    const tools = await this.prisma.attractive.findMany();

    if (!tools) throw new TableAttractiveIsEmpty();

    return tools;
  }

  async getAttractiveById(id: string): Promise<PrismaAttractive> {
    const tool = await this.prisma.attractive.findUnique({
      where: {
        id: id,
      },
    });

    if (!tool) throw new AttractiveDoesntExists();

    return tool;
  }

  async deleteAttractive(id: string): Promise<PrismaAttractive> {
    const tool = await this.prisma.attractive.delete({
      where: {
        id: id,
      },
    });

    if (!tool) throw new AttractiveDoesntExists();

    return tool;
  }

  async updateTool(
    id: string,
    name?: string,
    price?: number,
    tag?: string,
    openTime?: string,
  ): Promise<PrismaAttractive> {
    const data: Record<string, any> = {};

    // Only include properties in the data object if they are provided
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = price;
    if (tag !== undefined) data.tag = tag;
    if (openTime !== undefined) data.openTime = openTime;

    const tool = await this.prisma.attractive.update({
      where: {
        id: id,
      },
      data: data,
    });

    if (!tool) throw new AttractiveDoesntExists();

    return tool;
  }
}
