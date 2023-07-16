import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { printingRequestValidationSchema } from 'validationSchema/printing-requests';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPrintingRequests();
    case 'POST':
      return createPrintingRequest();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPrintingRequests() {
    const data = await prisma.printing_request
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'printing_request'));
    return res.status(200).json(data);
  }

  async function createPrintingRequest() {
    await printingRequestValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.quotation?.length > 0) {
      const create_quotation = body.quotation;
      body.quotation = {
        create: create_quotation,
      };
    } else {
      delete body.quotation;
    }
    const data = await prisma.printing_request.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
