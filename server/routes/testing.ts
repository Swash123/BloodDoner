import { RequestHandler } from "express";
export const handleTesting: RequestHandler = (req, res) => {
  const response="testing here";
  res.status(200).json(response);
};
