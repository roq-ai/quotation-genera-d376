import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { quotationValidationSchema } from 'validationSchema/quotations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.quotation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getQuotationById();
    case 'PUT':
      return updateQuotationById();
    case 'DELETE':
      return deleteQuotationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getQuotationById() {
    const data = await prisma.quotation.findFirst(convertQueryToPrismaUtil(req.query, 'quotation'));
    return res.status(200).json(data);
  }

  async function updateQuotationById() {
    await quotationValidationSchema.validate(req.body);
    const data = await prisma.quotation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteQuotationById() {
    const data = await prisma.quotation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
