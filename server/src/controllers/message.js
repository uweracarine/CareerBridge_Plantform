import * as msgService from '../services/message.js';
import { sendSuccess } from '../utils/response.js';

export const getConversations = async (req, res) => {
  const data = await msgService.getConversations(req.user.id);
  sendSuccess(res, data);
};
export const getMessages = async (req, res) => {
  const data = await msgService.getMessages(req.user.id, req.params.id);
  sendSuccess(res, data);
};
export const startConversation = async (req, res) => {
  const conv = await msgService.getOrCreateConversation(req.user.id, req.body.opportunityId, req.body.applicantId);
  sendSuccess(res, conv, 'Conversation ready', 201);
};
export const sendMessage = async (req, res) => {
  const msg = await msgService.sendMessage(req.user.id, req.params.id, req.body.message);
  sendSuccess(res, msg, 'Message sent', 201);
};
export const markConversationAsRead = async (req, res) => {
  const msgs = await msgService.markConversationAsRead(req.user.id, req.params.id);
  sendSuccess(res, msgs, 'Conversation updated');
};
export const getUnreadCount = async (req, res) => {
  const count = await msgService.getUnreadCount(req.user.id);
  sendSuccess(res, { count });
};
